var express = require("express");
var router = express.Router();
var multer = require("multer");
var config = require("../config.json");
var uuidv1 = require("uuid/v1");
var uuidv4 = require("uuid/v4");
var path = require("path");
const { insertImage, getType, insertCard, getAllImages, getPlaces } = require("../database");

// Imports the Google Cloud Vision client library
const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();

// Import the Google Cloud Storage client library
const { Storage } = require("@google-cloud/storage");
const gc = new Storage({
    keyFilename: path.join(__dirname, "../keyfile.json")
});

const bucket = gc.bucket("hucard");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
/*var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  }
});
var upload = multer({ storage: storage });*/

router.get("/getAll", async (req, res) => {
    var images = await getAllImages(req.user.username);
    res.json(images);
});

router.get("/getPlaces", async(req, res) => {
    var places = await getPlaces();
    res.json(places);
})

/* GET home page. */
router.post("/", function(req, res, next) {
    Product.create(req.body, function(err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

router.post("/upload", upload.single("file"), function(req, res, next) {
    if (!req.file) {
        res.status(400).send("No file uploaded.");
        return;
    }
    var fileName = req.file.originalname
    var fileType = fileName.substring(fileName.lastIndexOf('.'));
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(`${req.user.username}/${uuidv1()}${fileType}`);
    //blob.name = "userdenemetest.jpg";
    const blobStream = blob.createWriteStream();

    blobStream.on("error", err => {
        next(err);
    });

    blobStream.on("finish", async () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        var place = req.body.place;
        predict = await detect(publicUrl, place);
        var score = 0;
        if(predict != null){
          score = predict.score;
        }
        insertImage(publicUrl, req.user.username, place, score, Date.now());
        console.log("data girdi");
        if(score < 0.3){
            res.send("Image doesn't match.");
        }else{
            var cardId = uuidv4();
            var power = Math.floor(Math.random() * 2.4) + 1;
            var color = config.cardColors[Math.floor(Math.random() * config.cardColors.length)];
            var type = await getType(place);
            console.log(type);
            insertCard(cardId, req.user.username, power, color, type);
            res.status(200).send("won a card");
        }
        //insertImage(user, publicUrl, score, datenow);
        //insertCard(user, cardType, cardPower, cardColor);
        
    });
    blobStream.end(req.file.buffer);
});

async function detect(file, place) {
    const [result] = await client.landmarkDetection(file);

    const landmarks = result.landmarkAnnotations;
    //console.log("Landmarks:");
    //landmarks.forEach(landmark => console.log(landmark));
    for(var i = 0; i<landmarks.length; i++){
        console.log(landmarks[i].description);
        if(landmarks[i].description.toLowerCase().includes(place.toLowerCase())){
            console.log(landmarks[i].score);
            return landmarks[i];
        }
    }
    return null;
}

module.exports = router;

var express = require("express");
var router = express.Router();
var uuidv4 = require("uuid/v4");

const {
    getCards,
    combineCards,
    buyCard
  } = require("../database");

router.post("/combineCards", async (req, res) => {
    //console.log(req.body);
    result = await combineCards(req.body.card1Id, req.body.card2Id);
    if(result == null)
      res.status(400).send("fail");
    else
      res.send(result);
  });
  
  router.get("/cards", async(req, res) => {
      var cards = await getCards(req.user.username);
      res.json(cards);
  });

  router.post("/buyCard", async(req, res) => {
      //console.log("---------------------");
      //console.log(req.user);
      //console.log(req.body);
      //console.log("---------------------");
      if(req.user.coin < req.body.price){
          res.send("Not Enough Coin");
      }else{
          buyCard(uuidv4(), req.user.username, req.body.power, req.body.color, req.body.type, req.body.price);
          res.json({type: req.body.type, color: req.body.color, power: req.body.power});
      }
      //buyCard(red.body);
  })

  module.exports = router;
var express = require("express");
var app = express();
var http = require("http").Server(app);
const bodyParser = require("body-parser");
const uuid = require("uuid/v4");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt-nodejs");

const { initDB, getUser, createUser } = require("./database");
imagesRouter = require("./routes/image");

var sessionMiddleware = session({
    genid: req => {
        return uuid();
    },
    store: new FileStore(),
    secret: "supermegagreatsecretkeyhucard",
    resave: false,
    saveUninitialized: true
});

var io = require("./game").listen(http, sessionMiddleware);

initDB(() => {
    passport.use(
        new LocalStrategy((username, password, done) => {
            console.log("------------------");
            getUser(username)
                .then(res => {
                    console.log(res.rows);
                    const user = res.rows[0];
                    if (!user) {
                        return done(null, false, {
                            message: "Invalid credentials.\n"
                        });
                    }
                    if (!bcrypt.compareSync(password, user.password)) {
                        return done(null, false, {
                            message: "Invalid credentials.\n"
                        });
                    }
                    return done(null, user);
                })
                .catch(error => done(error));
        })
    );
    // tell passport how to serialize the user
    passport.serializeUser((user, done) => {
        console.log(user);
        done(null, user.username);
    });

    passport.deserializeUser((username, done) => {
        getUser(username)
            .then(res => {
                console.log(res.rows[0]);
                done(null, res.rows[0]);
            })
            .catch(error => done(error, false));
    });

    app.use(sessionMiddleware);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(passport.session());
    app.set("port", process.env.PORT || 8383);
    
    app.use("/image/", imagesRouter);

    app.use(express.static(__dirname + "/public"));

    app.get("/", function(req, res) {
        console.log("hello");
    });

    app.post("/login", (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (info) {
                return res.status(401).send(info.message);
            }
            if (err) {
                return res.status(401).send(err);
            }
            if (!user) {
                return res.status(401).send("user not found");
            }
            req.login(user, err => {
                if (err) {
                    console.log(err);
                    return res.status(401).send(err);
                }
                return res.send("logged in as "+user.username);
            });
        })(req, res, next);
    });

    app.post("/logout", (req, res) => {
        req.session.destroy();
        res.send("logout");
    });

    app.post("/register", (req, res) => {
        const saltRounds = bcrypt.genSaltSync(10);
        var user = req.body;
        bcrypt.hash(user.password, saltRounds, null, function(err, hash) {
            createUser(user.username, hash)
                .then(data => res.send(`Welcome ${user.username}`))
                .catch(err => res.status(406).send(err.detail));
        });
    });

    app.get("/authrequired", (req, res) => {
        console.log("--------------------");
        console.log(req.user);
        console.log("-----------------------");
        if (req.isAuthenticated()) {
            res.send("you hit the authentication endpoint\n");
        } else {
            res.redirect("/");
        }
    });

    app.get("/test", (req, res) => {
        console.log(req.user);
        if (req.isAuthenticated()) {
            res.send("you hit the test point\n");
        } else {
            res.status(500).send("error");
        }
    });

    http.listen(app.get("port"), function() {
        console.log("App started on port %s", app.get("port"));
    });
});

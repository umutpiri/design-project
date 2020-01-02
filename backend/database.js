const {Client} = require("pg");
const config = require('./config.json');

let db;

function initDB(callback){
    // localDB or herokuDB
    db = new Client(config.herokuDB);
    db.connect().then(res => {
        console.log("db connected");
        callback();}
        ).catch(err => console.log(err));
}

function toPgString(str){
    return "'"+str+"'";
}
// USERS
function getUser(username){
    username = toPgString(username);
    return db.query(`SELECT * from users where users.username = ${username}`);
}

function createUser(username, password){
    username = toPgString(username);
    password = toPgString(password);
    return db.query(`insert into users(username, password) values (${username},${password})`);
}

// CARDS
function insertCard(cardId, username, power, color, type){
    cardId = toPgString(cardId);
    username = toPgString(username);
    color = toPgString(color);
    type = toPgString(type);
    return db.query(`insert into cards(id, username, power, color, type) values (${cardId}, ${username}, ${power}, ${color}, ${type})`);
}

// IMAGES
function insertImage(url, username, place, score, date){
    url = toPgString(url);
    username = toPgString(username);
    place = toPgString(place);
    return db.query(`insert into images(url, username, place, score, date) values (${url},${username},${place},${score},to_timestamp(${Date.now()} / 1000.0))`);
}

async function getAllImages(username){
    username = toPgString(username);
    var result = await db.query(`SELECT * from images where images.username = ${username}`);
    return result.rows;
}

function getDB(){
    return db;
}

// PLACES
async function getType(place){
    place = toPgString(place);
    var result = await db.query(`SELECT type from places where places.place = ${place}`);
    try {
        return result.rows[0].type;
    } catch (error) {
        return "water";
    }
}

async function getPlaces(){
    var result = await db.query(`SELECT place, type from places`);
    return result.rows;
}

module.exports = {
    initDB,
    getDB,
    getUser,
    createUser,
    insertImage,
    getAllImages,
    insertCard,
    getType,
    getPlaces
};

/*
db.query("SELECT * from users").then(res => {
	//console.log(res.rows);
}).catch(err => {
	console.log(err);
})

db.query(`SELECT * from user_cards JOIN cards ON cards.id = user_cards.card_id WHERE user_id = ${userId}`).then(res => {
	//console.log(res.rows);
}).catch(err => {
	console.log(err);
})

db.query('INSERT INTO public.cards(name, power) VALUES (\'buz\', 9.3);').then(res => {
	//console.log(res);
}).catch(err => {
	console.log(err)
})*/
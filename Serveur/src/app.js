// IMPORT LIBRAIRIE
const path = require('path');
const api = require('./api.js');
const Datastore = require('nedb');
const express = require('express');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();


//Variable 
const app = express()
var db = new sqlite3.Database('src/base_donner/database.db');
var dbm = new Datastore({ filename: 'src/base_donner/message.db', autoload: true });
const basedir = path.normalize(path.dirname(__dirname)); // Détermine le répertoire de base
console.debug(`Base directory: ${basedir}`);

app.set('trust proxy', 1) // trust first proxy

app.use(cookieParser());
app.use(session({
    name: "sessionId", // le nom du cookie d'ID de session à définir dans la réponse et à lire dans la requête
    secret: "Don Pablo", // Il s'agit du secret utilisé pour signer le cookie d'identifiant de session
    saveUninitialized: true, // force une session «non initialisée» à être enregistrée dans le magasin
    resave: false, //force la session à être sauvegardée dans le magasin de sessions, même si la session n'a jamais été modifiée pendant la demande.
    cookie: { secure: false, maxAge: 60 * 60 * 24 * 7 } // pour securiser le site il faut que le site soit https
}));

app.post('/', (req, res) => {
    if (req.session.page_views) {
        req.session.page_views++;
        res.send("You visited this page " + req.session.page_views + " times");
    } else {
        req.session.page_views = 1;
        res.send("Welcome to this page for the first time!");
    }
    console.log(req.session)
    console.log(req.session.id)
    console.log("---------------")
    console.log(req.cookies)
    //res.send("hello sesion")
})

app.use('/api', api.default(db, dbm));



// Démarre le serveur
app.on('close', () => {
});

exports.default = app;


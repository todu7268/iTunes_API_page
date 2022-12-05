//import dependencies
const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const axios = require('axios');

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(bodyParser.json());

app.use(
    session({
        secret: "XASDASDA",
        saveUninitialized: true,
        resave: true,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.listen(3000);
console.log('Server is listening on port 3000');

app.get('/', (req, res) => {
    res.render('pages/main', {
        results: false
        //when you first open the page, there will be no results because you haven't searched for anything
        //so, you render it with results: false.
    });
});

app.post('/', (req, res) => {
    
    const helpVar = `search?term=${req.body.search}&media=music&limit=1`
    const helpVar1 = `https://itunes.apple.com/`
    const helpURL = helpVar1 + helpVar;
    //constructing a helper variable for the url in axios call

    axios({
        url: helpURL, 
        method: 'GET',
        dataType: 'json',
    })
        .then(result => {
            res.render('pages/main', {
                // if something is found and returned by the api
                results: true,
                name: JSON.stringify(result.data.results[0].trackName),
                genre: JSON.stringify(result.data.results[0].primaryGenreName),
                release_date: JSON.stringify(result.data.results[0].releaseDate),
                url: result.data.results[0].trackViewUrl,
                image: result.data.results[0].artworkUrl100
            });
        })

        .catch(error => {
            res.render('pages/main', {
                //if there's an error, so the api doesn't return anything
                results: false,
                message: "No results found."
            });
        })
});
const express = require('express');
const port = process.env.PORT || 8080;
const app = express();
const Twitter = require('twitter')

// Load .env variable
require('dotenv').config()

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
});

app.use(express.static(__dirname + "/dist/"));

app.get('/api/tw/favolites/list', (req, res) => {
    const params = { screen_name: 'ne_peer' }
    client.get('favorites/list', params, function (error, tweets, response) {
        if (!error) {
            res.status(200).send(tweets)
        } else {
            res.status(500).send(error)
        }
    });
});

app.listen(port);

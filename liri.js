// REQUIRE PACKAGES
require("dotenv").config();
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const request = require("request");

// GLOBAL VARIABLES
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);
const command = process.argv[2];
const parameter = process.argv[3];

// COMMANDS
// * `my-tweets`
//   This will show your last 20 tweets and when they were created at in your terminal/bash window.

// * `spotify-this-song`

// * `movie-this`

// * `do-what-it-says`

// FUNCTIONS
function myTweets() {
    const twitter = new Twitter(keys.twitter);
    const twitterParams = {
        screen_name: "whispersays",
    };
    twitter.get("statuses/user_timeline", twitterParams, (error, tweets, response) => {
        if (!error && response.statusCode === 200) {
            tweets.forEach((tweet) => {
                console.log(tweet.text);
                console.log(tweet.created_at);
            });
        }
    });
}

function spotifySong() {

}

function movieThis() {

}

function doWhatItSays() {

}

// RUN THE APP
switch (command) {
case "my-tweets":
    console.log("getting tweets");
    myTweets();
    break;
case "spotify-this-song":
    console.log("spotifying");
    break;
case "movie-this":
    console.log("searching movie info");
    break;
case "do-what-it-says":
    console.log("doing what it says");
    break;
default:
    console.log("Your argument is not valid. Try [my-tweets|spotify-this-son|movie-this|do-what-it-says].");
}

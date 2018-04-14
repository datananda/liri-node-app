// REQUIRE PACKAGES & MODULES
require("dotenv").config();
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const request = require("request");
const keys = require("./keys.js");

// GLOBAL VARIABLES
const command = process.argv[2];
let parameter = process.argv[3];

// COMMANDS
// * `movie-this`

// * `do-what-it-says`

// FUNCTIONS
function myTweets() {
    const twitter = new Twitter(keys.twitter);
    const twitterParams = {
        user_id: "985202948354473984",
        count: 20,
        trim_user: true,
    };
    twitter.get("statuses/user_timeline", twitterParams, (error, tweets, response) => {
        if (!error && response.statusCode === 200) {
            // console.log(tweets);
            tweets.forEach((tweet, i) => {
                console.log("----------------------------------------------");
                console.log(`Tweet ${i+1}`);
                console.log(`"${tweet.text}"`);
                console.log(`Created at: ${tweet.created_at}`); // TODO: format time better. this is UTC time.
            });
            console.log("----------------------------------------------");
        } else {
            console.log(`Error occurred: ${error}`);
        }
    });
}

function spotifySong() {
    const spotify = new Spotify(keys.spotify);
    if (!parameter) {
        parameter = "track:The+Sign+artist:Ace+of+Base";
    }
    const spotifyParams = {
        type: "track",
        query: parameter,
        limit: 1,
    };
    spotify.search(spotifyParams, (error, data) => {
        if (!error) {
            const trackInfo = data.tracks.items[0];
            const artistList = trackInfo.artists;
            console.log("----------------------------------------------");
            console.log(`Song Name: ${trackInfo.name}`);
            if (artistList.length > 1) {
                let artists = "";
                artistList.forEach((artistObj) => {
                    artists += `${artistObj.name}, `;
                });
                artists = artists.slice(0, -2);
                console.log(`Artists: ${artists}`);
            } else {
                console.log(`Artist: ${artistList[0].name}`);
            }
            console.log(`Preview Link: ${trackInfo.preview_url}`);
            console.log(`Album: ${trackInfo.album.name}`);
            console.log("----------------------------------------------");
        } else {
            console.log(`Error occurred: ${error}`);
        }
    });
}

function movieThis() {

}

function doWhatItSays() {

}

// RUN THE APP
if (parameter) {
    parameter = parameter.split(" ").join("+");
}

switch (command) {
case "my-tweets":
    myTweets();
    break;
case "spotify-this-song":
    spotifySong();
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

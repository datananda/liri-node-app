// REQUIRE PACKAGES & MODULES
require("dotenv").config();
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const request = require("request");
const fs = require("fs");
const chalk = require("chalk");
const term = require("terminal-kit").terminal;
const keys = require("./keys.js");

// GLOBAL VARIABLES
let command = process.argv[2];
let parameter = process.argv[3];

// FUNCTIONS
function getWidth(maxTextWidth) {
    if (maxTextWidth < term.width) {
        return maxTextWidth;
    }
    return term.width;
}

function printHeader(headerText, width) {
    let spacer = "";
    let header = headerText;
    for (let i = 2; i < width; i++) {
        spacer += "-";
    }
    for (let i = header.length + 3; i < width; i++) {
        header += " ";
    }
    console.log(chalk.blue(`+${spacer}+`));
    console.log(chalk.blue(`| ${header}|`));
    console.log(chalk.blue(`+${spacer}+`));
}

function printObject(obj, width) {
    Object.keys(obj).forEach((section) => {
        let sectionSpacer = "";
        let spacer = "";
        let text = obj[section];
        for (let i = 0; i < section.length; i++) {
            spacer += " ";
        }
        for (let i = section.length + 3; i < width; i++) {
            sectionSpacer += " ";
            spacer += " ";
        }
        for (let i = text.length + 3; i < width; i++) {
            text += " ";
        }
        console.log(`| ${spacer}|`);
        console.log(`| ${chalk.blue(section)}${sectionSpacer}|`);
        console.log(`| ${text}|`);
        console.log(`| ${spacer}|`);
    });
    let closer = "";
    for (let i = 2; i < width; i++) {
        closer += "-";
    }
    console.log(`+${closer}+`);
}

function myTweets() {
    const twitter = new Twitter(keys.twitter);
    const twitterParams = {
        user_id: "985202948354473984",
        count: 20,
        trim_user: true,
    };
    twitter.get("statuses/user_timeline", twitterParams, (error, tweets, response) => {
        if (!error && response.statusCode === 200) {
            tweets.forEach((tweet, i) => {
                console.log("----------------------------------------------");
                console.log(`Tweet ${i + 1}`);
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
            console.log("+---------------------------------------------");
            console.log(`| Song Name: ${trackInfo.name}`);
            if (artistList.length > 1) {
                let artists = "";
                artistList.forEach((artistObj) => {
                    artists += `${artistObj.name}, `;
                });
                artists = artists.slice(0, -2);
                console.log(`| Artists: ${artists}`);
            } else {
                console.log(`| Artist: ${artistList[0].name}`);
            }
            console.log(`| Preview Link: ${trackInfo.preview_url}`);
            console.log(`| Album: ${trackInfo.album.name}`);
            console.log("+---------------------------------------------");
        } else {
            console.log(`Error occurred: ${error}`);
        }
    });
}

function movieThis() {
    if (parameter) {
        const queryURL = `http://www.omdbapi.com/?apikey=trilogy&t=${parameter}`;
        request(queryURL, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const movieInfo = JSON.parse(body);
                const rottenTomatoesObj = movieInfo.Ratings.find(rating => rating.Source === "Rotten Tomatoes");
                console.log("----------------------------------------------");
                console.log(`Title: ${movieInfo.Title}`);
                console.log(`Year: ${movieInfo.Year}`);
                console.log(`IMDB Rating: ${movieInfo.imdbRating}`);
                console.log(`Rotten Tomatoes Rating: ${rottenTomatoesObj.Value}`);
                console.log(`Country: ${movieInfo.Country}`);
                console.log(`Language: ${movieInfo.Language}`);
                console.log(`Plot: ${movieInfo.Plot}`);
                console.log(`Actors: ${movieInfo.Actors}`);
                console.log("----------------------------------------------");
            } else {
                console.log(`Error occurred: ${error}`);
            }
        });
    } else {
        console.log("----------------------------------------------");
        console.log('If you haven\'t watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/');
        console.log("It's on Netflix!");
        console.log("----------------------------------------------");
    }
}

function processCommand() {
    switch (command) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifySong();
        break;
    case "movie-this":
        movieThis();
        break;
    default:
        console.log("Your argument is not valid. Try [my-tweets|spotify-this-song|movie-this|do-what-it-says].");
    }
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", (error, data) => {
        const randArgs = data.split(",");
        command = randArgs[0];
        parameter = randArgs[1];
        processCommand();
    });
}

// RUN THE APP
if (parameter) {
    parameter = parameter.split(" ").join("+");
}

if (command === "do-what-it-says") {
    doWhatItSays();
} else {
    printHeader("My Tweets", getWidth(50));
    printObject({ Artist: "ACDC", "Track Name": "You shook me" }, getWidth(50));
    processCommand();
}

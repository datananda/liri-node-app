// REQUIRE PACKAGES & MODULES
require("dotenv").config();
const Spotify = require("node-spotify-api");
const Twitter = require("twitter");
const request = require("request");
const fs = require("fs");
const chalk = require("chalk");
const term = require("terminal-kit").terminal;
const inquirer = require("inquirer");
const moment = require("moment");
const keys = require("./keys.js");

// FUNCTIONS
function getMaxLength(obj) {
    if (typeof obj === "object") {
        let length = 0;
        Object.keys(obj).forEach((key) => {
            if (key.length > length) {
                length = key.length;
            }
            if (obj[key].length > length) {
                length = obj[key].length;
            }
        });
        if (length < term.width) {
            return length;
        }
        return term.width;
    }
    if (obj < term.width) {
        return obj;
    }
    return term.width;
}

function printHeader(headerText, width, color) {
    let spacer = "";
    let header = headerText;
    for (let i = 0; i < width; i++) {
        spacer += "-";
    }
    for (let i = header.length; i < width; i++) {
        header += " ";
    }
    console.log("");
    console.log(chalk[color](`+-${spacer}-+`));
    console.log(chalk[color](`| ${header} |`));
    console.log(chalk[color](`+-${spacer}-+`));
}

// TODO: FIGURE OUT HOW TO WRAP TEXT IF IT OVERFLOWS WINDOW
function printObject(obj, width, color) { 
    Object.keys(obj).forEach((section) => {
        let sectionSpacer = "";
        let spacer = "";
        let text = obj[section];
        for (let i = 0; i < section.length; i++) {
            spacer += " ";
        }
        for (let i = section.length; i < width; i++) {
            sectionSpacer += " ";
            spacer += " ";
        }
        for (let i = text.length; i < width; i++) {
            text += " ";
        }
        console.log(`| ${spacer} |`);
        console.log(`| ${chalk[color](section)}${sectionSpacer} |`);
        console.log(`| ${text} |`);
        console.log(`| ${spacer} |`);
    });
    let closer = "";
    for (let i = 0; i < width; i++) {
        closer += "-";
    }
    console.log(`+-${closer}-+`);
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
            printHeader("My Tweets", getMaxLength(140), "blue");
            tweets.forEach((tweet, i) => {
                const formattedTime = moment.utc(tweet.created_at, "ddd MMM D HH:mm:ss Z YYYY").local().format("dddd, MMMM Do YYYY [at] h:mm a");
                const tweetObj = {
                    "Tweet Number": String(i + 1),
                    "Tweet Text": tweet.text,
                    "Created At": formattedTime,
                };
                printObject(tweetObj, getMaxLength(140), "blue");
            });
            console.log("");
        } else {
            console.log(`Error occurred: ${error}`);
        }
    });
}

function spotifySong(songName) {
    const spotify = new Spotify(keys.spotify);
    if (!songName) {
        songName = "track:The+Sign+artist:Ace+of+Base";
    }
    const spotifyParams = {
        type: "track",
        query: songName,
        limit: 1,
    };
    spotify.search(spotifyParams, (error, data) => {
        if (!error) {
            const trackInfo = data.tracks.items[0];
            const artistList = trackInfo.artists;
            const spotifyObj = {
                "Song Name": trackInfo.name,
            };
            if (artistList.length > 1) {
                let artists = "";
                artistList.forEach((artistObj) => {
                    artists += `${artistObj.name}, `;
                });
                artists = artists.slice(0, -2);
                spotifyObj.Artists = artists;
            } else {
                spotifyObj.Artist = artistList[0].name;
            }
            if (trackInfo.preview_url) {
                spotifyObj["Preview Link"] = trackInfo.preview_url;
            }
            spotifyObj.Album = trackInfo.album.name;
            printHeader("Spotify This Song", getMaxLength(spotifyObj), "green");
            printObject(spotifyObj, getMaxLength(spotifyObj), "green");
            console.log("");
        } else {
            console.log(`Error occurred: ${error}`);
        }
    });
}

function movieThis(movieName) {
    if (movieName) {
        const queryURL = `http://www.omdbapi.com/?apikey=trilogy&t=${movieName}`;
        request(queryURL, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const movieInfo = JSON.parse(body);
                const rottenTomatoesObj = movieInfo.Ratings.find(rating => rating.Source === "Rotten Tomatoes");
                const movieObj = {
                    Title: movieInfo.Title,
                    Year: movieInfo.Year,
                    "IMDB Rating": movieInfo.imdbRating,
                    "Rotten Tomatoes Rating": rottenTomatoesObj.Value,
                    Country: movieInfo.Country,
                    Language: movieInfo.Language,
                    Plot: movieInfo.Plot,
                    Actors: movieInfo.Actors,
                };
                printHeader("Movie This", getMaxLength(movieObj), "yellow");
                printObject(movieObj, getMaxLength(movieObj), "yellow");
                console.log("");
            } else {
                console.log(`Error occurred: ${error}`);
            }
        });
    } else {
        const movieRec = 'If you haven\'t watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/';
        printHeader("Movie This", movieRec.length, "yellow");
        console.log("|                                                                                            |");
        console.log('| If you haven\'t watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/ |');
        console.log("| It's on Netflix                                                                            |");
        console.log("|                                                                                            |");
        console.log("+--------------------------------------------------------------------------------------------+");
        console.log("");
    }
}

function processCommand(command, parameter) {
    switch (command) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifySong(parameter);
        break;
    case "movie-this":
        movieThis(parameter);
        break;
    default:
        console.log("The argument in random.txt is not valid. Try [my-tweets|spotify-this-song|movie-this|do-what-it-says].");
    }
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", (error, data) => {
        const randArgs = data.split(",");
        const command = randArgs[0];
        const parameter = randArgs[1];
        processCommand(command, parameter);
    });
}

// RUN THE APP
inquirer.prompt([
    {
        type: "list",
        name: "selection",
        message: "What do you want to do?",
        choices: ["My Tweets", "Spotify This Song", "Movie This", "Do What It Says"],
    },
]).then((response) => {
    if (response.selection === "Do What It Says") {
        doWhatItSays();
    } else if (response.selection === "My Tweets") {
        myTweets();
    } else if (response.selection === "Spotify This Song") {
        inquirer.prompt([
            {
                type: "input",
                name: "song",
                message: "Enter a song name",
            },
        ]).then((songResponse) => {
            spotifySong(songResponse.song);
        });
    } else if (response.selection === "Movie This") {
        inquirer.prompt([
            {
                type: "input",
                name: "movie",
                message: "Enter a movie name",
            },
        ]).then((movieResponse) => {
            movieThis(movieResponse.movie);
        });
    }
});

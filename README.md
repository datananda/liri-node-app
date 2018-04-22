# LIRI Node Bot

LIRI is a language interpretation and recognition interface accessed via the command line. LIRI can retrieve your latest tweets, search for songs on Spotify, and search for movie information via OMDB.

## Prerequisites

Install the required node packages:

```
npm install
```

Provide your own .env file with Spotify and Twitter API keys:

```
# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

# Twitter API keys

TWITTER_CONSUMER_KEY=your-twitter-consumer-key
TWITTER_CONSUMER_SECRET=your-twitter-consumer-secret
TWITTER_ACCESS_TOKEN_KEY=your-access-token-key
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret

```

## Running the Application

From the command line:

``` node liri.js ```

You will be prompted to select one of the following options:

* My Tweets - retrieve 20 of my latest tweets
* Spotify This Song - search for a song on spotify
* Movie This - search for a movie via OMDB API
* Do What It Says - will perform the command provided in the "random.txt" file

## Packages Used

* [chalk](https://www.npmjs.com/package/chalk) - for pretty colors :)
* [fs](https://nodejs.org/api/fs.html) - for file I/O
* [inquirer](https://www.npmjs.com/package/inquirer) - for prompting the user with choices
* [moment](https://www.npmjs.com/package/moment) - for formatting Twitter dates
* [node-spotify-api](https://www.npmjs.com/package/node-spotify-api) - for calling the Spotify API
* [request](https://www.npmjs.com/package/request) - for making a request to the OMDB API
* [terminal-kit](https://www.npmjs.com/package/terminal-kit) - for getting the terminal size
* [twitter](https://www.npmjs.com/package/twitter) - for calling the Twitter API

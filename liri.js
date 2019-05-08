
//create variable to require all the npm package
require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const axios = require('axios');
const moment = require('moment');
const omdb = require('omdb');

var spotify = new Spotify(keys.spotify);

var selector = function (command, userInput) {
    switch (command) {
        case "concert-this":
            concertThis(userInput);
            break;
        case "spotify-this-song":
            spotifyThis(userInput);
            break;
        case "movie-this":
            movieThis(userInput);
            break;
        case "do-what-it-says":
            doWhatItSays(userInput);
            break;
        default:
            console.log('LIRI does not know that!');
    }
}

//Create contructor to take in user input.
var run = function (arg1, arg2) {
    selector(arg1, arg2);
}

run(process.argv[2], process.argv.slice(3).join(" "));




function concertThis(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log(response.data);
            response.data.forEach(function (concert) {
                console.log("Venue: " + concert.venue.name);
                console.log("Location: " + concert.venue.city + ", " + concert.venue.country);
                console.log("Date: " + moment(concert.venue.datetime).format('MM/DD/YYYY'));
                console.log("\n--------------------------------------");
            });

        })

}

function spotifyThis(song) {

    if(song.length === 0){
        song = "The Sign"
    }

    spotify.search({ type: "track", query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var songInfo = data.tracks.items;

        songInfo.forEach(function (eachSong) {
            console.log("Song: " + eachSong.name);
            console.log("Artist: " + eachSong.artists[0].name);
            console.log("Album: " + eachSong.album.name);
            console.log("Link: " + eachSong.external_urls.spotify);
            console.log("\n--------------------------------------")

        })
    })
}

function movieThis(movie){

    if(movie.length === 0){
        movie = "Mr. Nobody"
    }
    
    omdb.search(movie, function(err, data) {
        if(err) {
            return console.error(err);
        }
     
        if(data.length < 1) {
            return console.log('No movies were found!');
        }
     
        data.forEach(function(movieInfo) {
            console.log('%s (%d)', movieInfo.title, movieInfo.year);
        });
    });
}

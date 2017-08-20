//Set up all package 'require' requests, including our keys.js file
var request = require('request'),
    fs = require('fs'),
    keys = require('./keys.js');

var action = process.argv[2],
    argument = "";
//Parse through the remaining indexes in the argument array and concatenate them into a single string, separated by spaces
if (process.argv[3] != null) {
    for (i = 3; i < process.argv.length; i++) {
        argument += process.argv[i] + ' ';
    };
}

processAction();

function processAction() {
    switch (action) {
        case 'my-tweets':
            myTweets();
            break;
        case 'spotify-this-song':
            spotifyThisSong();
            break;
        case 'movie-this':
            movieThis();
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log("This is not a designated function of LIRI.  Terminating session.");
    }

}


function myTweets() {
    var Twitter = require('twitter');

    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret,
    });

    var params = { screen_name: 'HillLIRIous' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log(error);
        } else {
            //Go through the 20 most recent tweets in descending chronological order and console.log each with a timestamp
            for (i = 0; i < 20; i++) {
                if (tweets[i]) {
                    console.log("Time/Date: " + tweets[i].created_at + "\n" + tweets[i].text + "\n");
                }

            }
        }
    });
};

function spotifyThisSong() {
    var Spotify = require('node-spotify-api');
    var setLimit = 5;

    var spotify = new Spotify({
        id: keys.spotifyKeys.id,
        secret: keys.spotifyKeys.secret,
    });

    if (!process.argv[3]) {
        argument = "The Sign by Ace of Base";
    };

    spotify.search({ type: 'track', query: argument, limit: setLimit }, function(error, data) {
        if (error) {
            console.log("Error!\n" + error);
        } else {
            for (i = 0; i < setLimit; i++) {
                if (data.tracks.items[i]) {
                    console.log("Search result #" + (i + 1) + "\n----------------");
                    console.log("Song Name: " + data.tracks.items[i].name);
                    console.log("Album: " + data.tracks.items[i].album.name);
                    console.log("Artist(s): ");
                    data.tracks.items[i].artists.forEach(function(key) {
                        console.log("  " + key.name);
                    });
                    console.log("Preview URL: " + data.tracks.items[i].preview_url + "\n");
                }

            }
        }
    });
};

function movieThis() {
    request('http://www.omdbapi.com/?apikey=40e9cece&', function (error, data) {
    	if (error) {
    		console.log("Error!\n" + error);
    	} else {
    		console.log(data);
    	}
    });
/*
   * Title of the movie.
   * Year the movie came out.
   * IMDB Rating of the movie.
   * Rotten Tomatoes Rating of the movie.
   * Country where the movie was produced.
   * Language of the movie.
   * Plot of the movie.
   * Actors in the movie.
    */
};

function doWhatItSays() {
    fs.readFile('./random.txt', 'UTF-8', function(error, data) {
        if (error) {
            console.log("Error!\n" + error);
        } else {
            var splitData = data.split(",");
            action = splitData[0];
            argument = splitData[1];
            processAction();
        }
    });
};


/*
function Liri() {
    this.name = name;
    this.profession = profession;
    this.gender = gender;
    this.age = age;
    this.level = level;
    this.strength = strength;
    this.hp = hp;

    this.printStats = function() {
        if (this.isAlive()) {
            console.log("");
            console.log("Name: " + this.name);
            console.log("Profession: " + this.profession);
            console.log("Gender: " + this.gender);
            console.log("Age: " + this.age);
            console.log("Level: " + this.level);
            console.log("Strength: " + this.strength);
            console.log("Hit Points: " + this.hp);
            console.log("-------------");
            console.log("");
        } else {
            console.log(this.name + " is dead.");
        }
    };*/
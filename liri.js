var liriBot = new Liri();

liriBot.processAction();


//master is the main Liri object
function Liri() {
    //In order to avoid any scoping unpleasantness, create a variable called "master" to allow access to the highest level of scope within LIRI
    var master = this;
    //Set up all package 'require' requests, including our keys.js file.  Since not all functions require these I decided not to
    this.now = new Date();
    this.request = require('request');
    this.fs = require('fs');
    this.keys = require('./keys.js');
    this.Twitter = require('twitter');
    this.Spotify = require('node-spotify-api');
    this.inquirer = require('inquirer');
    this.action = process.argv[2];
    this.argument = "";
    //Parse through the remaining indexes in the argument array and concatenate them into a single string, separated by spaces
    if (process.argv[3]) {
        for (i = 3; i < process.argv.length; i++) {
            this.argument += process.argv[i] + ' ';
        };
    };

    //////// Liri's Methods ////////

    //Logs all data to both the console and a text file called 'log.txt'
    this.logData = function(text) {
        console.log(text);
        master.fs.appendFileSync('log.txt', text + '\r\n', "utf-8", function(error) {
            if (error) {
                console.log("Error!" + error);
            }
        });
    };

    //Create a new console.log and log.txt entry with a time/date stamp
    this.timeStamp = function() {
        master.logData("*****" + master.now + "*****\n");
    }

    //Runs the user's initial request and is called again by doWhatItSays()
    this.processAction = function() {
        switch (master.action) {
            case 'my-tweets':
                master.timeStamp();
                master.myTweets();
                break;
            case 'spotify-this-song':
                master.timeStamp();
                master.spotifyThisSong();
                break;
            case 'movie-this':
                master.timeStamp();
                master.movieThis();
                break;
            case 'do-what-it-says':
                master.doWhatItSays();
                break;
                //If the user doesn't know the commands or types one in incorrectly, LIRI will offer to activate the 'inquirer' based interface.
            default:
                console.log("'" + master.action + "' is not a designated command line function of LIRI. Activating the advanced interface.");
                master.advancedInterface();
        };

    };

    //Gets up to the 20 latest tweets via the twitter node package.
    this.myTweets = function() {
        var client = new master.Twitter({
            consumer_key: master.keys.twitterKeys.consumer_key,
            consumer_secret: master.keys.twitterKeys.consumer_secret,
            access_token_key: master.keys.twitterKeys.access_token_key,
            access_token_secret: master.keys.twitterKeys.access_token_secret,
        });
        client.get('statuses/user_timeline', { screen_name: 'HillLIRIous' }, function(error, tweets, response) {
            if (error) {
                master.logData(error);
            } else {
                //Go through the 20 most recent tweets in descending chronological order and log each with a timestamp
                for (i = 0; i < 20; i++) {
                    if (tweets[i]) {
                        master.logData("Time/Date: " + tweets[i].created_at + "\n" + tweets[i].text + "\n");
                    }

                }
                master.logData("\n\n");
            }
        });
    };
    //Searches for a song using the spotify node package.  Provides a default if no argument is specified.
    this.spotifyThisSong = function() {
        var spotify = new master.Spotify({
                id: master.keys.spotifyKeys.id,
                secret: master.keys.spotifyKeys.secret,
            }),
            //Used to control the number of tracks returned
            setLimit = 5;
        //If there's no argument beyond the action, assign one
        if (!process.argv[3]) {
            master.argument = "The Sign by Ace of Base";
        };

        spotify.search({ type: 'track', query: master.argument, limit: setLimit }, function(error, data) {
            if (error) {
                master.logData("Error!\n" + error);
            } else {
                for (i = 0; i < setLimit; i++) {
                    if (data.tracks.items[i]) {
                        master.logData("Search result #" + (i + 1) + "\n----------------");
                        master.logData("Song Name: " + data.tracks.items[i].name);
                        master.logData("Album: " + data.tracks.items[i].album.name);
                        master.logData("Artist(s): ");
                        data.tracks.items[i].artists.forEach(function(key) {
                            master.logData("  " + key.name);
                        });
                        master.logData("Preview URL: " + data.tracks.items[i].preview_url + "\n");
                    }

                }
                master.logData("\n\n");
            }
        });
    };

    //Searches for a movie using the OMDB API.  Provides a default if no argument is specified.
    this.movieThis = function() {
        var rTValue = "N/A";
        if (!process.argv[3]) {
            var movieSearchKey = "Mr.Nobody";
        } else {
            var movieSearchKey = master.argument;
        };

        master.request("http://www.omdbapi.com/?t=" + movieSearchKey + "&apikey=40e9cece&", function(error, data, body) {
            if (!error && JSON.parse(body).Title != undefined) {
                master.logData("Title: " + JSON.parse(body).Title + "\n---------------");
                master.logData("Year released: " + JSON.parse(body).Year);
                master.logData("Imdb Rating: " + JSON.parse(body).imdbRating);

                //Note: Not all entries have these optional ratings!  V, for instance, does not and this will throw an error.
                //Instead of breaking the program, we'll do a search for the optional rating
                JSON.parse(body).Ratings.forEach(function(key) {
                    if (key.Source === 'Rotten Tomatoes') {
                        rTValue = key.Value;
                    };
                });
                
                master.logData("Rotten Tomatoes Rating: " + rTValue);
                master.logData("Actors: " + JSON.parse(body).Actors + "\n");
                master.logData("Plot: " + JSON.parse(body).Plot);
                master.logData("\n\n");
            } else {
                master.logData("Error!\n" + error);
            };
        });
    };

    this.doWhatItSays = function() {
        master.fs.readFile('./random.txt', 'UTF-8', function(error, data) {
            if (error) {
                master.logData("Error!\n" + error);
            } else {
                var splitData = data.split(",");
                master.action = splitData[0];
                master.argument = splitData[1];
                master.processAction();
            }
        });
    };

    //Liri's advanced interface, activated when the user enters an incorrect command or no command at all, on the command line
    //Currently uses default results
    this.advancedInterface = function() {
        master.inquirer.prompt([{
            type: "list",
            choices: ["Get my latest tweets", new master.inquirer.Separator(), "Spotify search", new master.inquirer.Separator(), "Movie search", new master.inquirer.Separator(), "Run default action from file (random.txt)", new master.inquirer.Separator(), "Exit", new master.inquirer.Separator()],
            name: "action",
            message: "Please choose an action from the list: \n"
        }]).then(function(data) {
            switch (data.action) {
                case "Get my latest tweets":
                    master.timeStamp();
                    master.myTweets();
                    break;
                case "Spotify search":
                    master.timeStamp();
                    master.spotifyThisSong();
                    break;
                case "Movie search":
                    master.timeStamp();
                    master.movieThis();
                    break;
                case "Run default action from file (random.txt)":
                    master.doWhatItSays();
                    break;
                case "Exit":
                default:
                    console.log("Thank you for using the LIRI advanced interface.  Goodbye.\n\n");
            };
        });

    };

    //This function is a work in progress.  It is meant to allow the user to enter additional query information, say a movie title, into the Advanced Interface.
    //Currently there is some sort of synchronization error.
    /*this.advancedInterfaceInput = function() {
        var query;
        master.inquirer.prompt([{
            type: "input",
            name: "query",
            message: "Enter your query: \n"
        }]).then(function(data) {
            console.log(data.query);
            query = data.query;
        });
        return query;
    };*/
};
//Set up all package 'require' requests
var request = require('request'),
    fs = require('fs'),
    keys = require('./keys.js');

var action = process.argv[2],
    argument = "";
//Parse through the remaining indexes in the argument array and concatenate them into a single string, separated by spaces, just in case the user doesn't use hyphens
for (i = 3; i < process.argv.length; i++) {
    argument += process.argv[i] + ' ';
};

console.log(argument);

switch (action) {
    case 'my-tweets':
    case 'my tweets':
        myTweets();
        break;
    case 'spotify-this-song':
    case 'spotify this song':
        spotifyThisSong();
        break;
    case 'movie-this':
    case 'movie this':
        movieThis();
        break;
    case 'do-what-it-says':
    case 'do what it says':
        doWhatItSays();
        break;
    default:
        console.log("This is not a designated function of LIRI.  Terminating session.");
}


function myTweets() {
    console.log("myTweets");
    var myTwitterKey = keys.twitterKeys;
    var tweet = ;
    console.log(JSON.stringify(tweet));
};

function spotifyThisSong() {
    console.log("spotifyThisSong");
};

function movieThis() {
    console.log("movieThis");
    /*var response = request('');*/
};

function doWhatItSays() {
    console.log("doWhatItSays");
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
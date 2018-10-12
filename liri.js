require("dotenv").config();


var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var request = require("request");
var moment = require("moment");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var loggedRecords = false;

//Function for appending process.argv[2] and the song, band, or movie name to log.txt
var append = function (specified) {

    var text = "\n" + process.argv[2] + ", " + specified;

    fs.appendFile("log.txt", text, function (err) {

        if (err) {
            console.log(err);
        } else {
            console.log("Content Added!");
        }
    });
}


//Function for finding results when process.argv[2] is movie-this
var movie = function () {
    if (process.argv[2] === "movie-this") {
        //if something is typed after movie-this, everything following movie-this becomes the movie search parameter, without having to be contained in quotes
        if (process.argv.length > 3) {
            var searchParam = process.argv.splice(3);
            //console.log(searchParam);
            var movie = searchParam.join(" ");
            //console.log(movie);
        } else {
            //if nothing is typed after movie-this, movie is "Mr. Nobody"
            var movie = "Mr. Nobody";
        }

        //request call to OMDB API, which returns all the required information
        request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
            var result = JSON.parse(body);
            console.log("-------------------");
            console.log("_________Your Movie__________");
            if (!error && response.statusCode === 200) {
                console.log("Title: " + result.Title);
                console.log("Year: " + result.Year);
                console.log("IMDB Rating: " + result.imdbRating);
                if (result.Ratings.length > 1) {
                    console.log("Rotten Tomatoes Score: " + result.Ratings[1].Value);
                } else {
                    console.log("Rotten Tomatoes Score: N/A");
                }
                console.log("Country: " + result.Country);
                console.log("Language: " + result.Language);
                console.log("Plot: " + result.Plot);
                console.log("Actors: " + result.Actors);
            }
        });
        //Appends to log.txt, as long as it isn't part of the do-what-it-says function pulling from random.txt
        if (!loggedRecords) {
            append(movie);
        }

    }
}

//Function for finding results when process.argv[2] is concert-this
var concert = function () {
    if (process.argv[2] === "concert-this") {
        //Whatever is typed after concert-this becomes the artist search parameter, without requiring quotes
        var searchParam = process.argv.splice(3);
        var artist = searchParam.join(" ");

        request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {

            var results = JSON.parse(body);

            //if the error indicates that the returned array is empty (meaning no tour dates), a sorry message is logged
            if (error === null && !results.length) {
                console.log("Sorry, they don't seem to be touring right now.");
                return;
            } else if (error) {
                console.log(error);
                return;
            }

            //if there is no error, the venue, city, date (using moment.js formatting), and lineup are printed
            if (!error && response.statusCode === 200) {

                console.log("-------------------");
                console.log("_________" + artist + "'s Concerts__________");
                for (var i = 0; i < results.length; i++) {
                    console.log("-----------------");
                    console.log("Venue: " + results[i].venue.name);
                    //For foreign countries, some region values are numbers for some reason, so this if/else shows the region value only if it is not blank and not a number (such as states like VA, FL, etc.)
                    if (results[i].venue.region && isNaN(parseInt(results[i].venue.region))) {
                        console.log("City: " + results[i].venue.city + ", " + results[i].venue.region + ", " + results[i].venue.country);
                    } else {
                        console.log("City: " + results[i].venue.city + ", " + results[i].venue.country);
                    }
                    console.log("Date: " + moment(results[i].datetime).format("L"));
                    if (results[i].lineup.length === 1) {
                        console.log("Lineup: " + results[i].lineup[0]);
                    } else {
                        console.log("Lineup: ");
                        for (var j = 0; j < results[i].lineup.length; j++) {
                            console.log(results[i].lineup[j]);
                        }
                    }
                }
            }
        });

        //Appends to log.txt, as long as it isn't part of the do-what-it-says function pulling from random.txt
        if (!loggedRecords) {
            append(artist);
        }
    }
}

//Function for finding results when process.argv[2] is spotify-this-song
var spot = function () {
    if (process.argv[2] === "spotify-this-song") {
        //if something is typed after spotify-this-song, everything following spotify-this-song becomes the song search parameter, without having to be contained in quotes
        if (process.argv.length > 3) {
            var searchParam = process.argv.splice(3);
        var song = searchParam.join(" ");
        } else {
            //if nothing is typed after spotify-this-song, song is "The Sign Ace of Base"
            var song = "The Sign Ace of Base";
        }

        //Spotify search function, returning one result based on the song parameter
        spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            //Function that capitalizes a value, namely the artist name on line 150
            String.prototype.capitalize = function () {
                return this.charAt(0).toUpperCase() + this.slice(1);
            }

            console.log("-------------------");
            console.log("_________Your Song__________");
            console.log("Artist: " + data.tracks.items[0].artists[0].name.capitalize());
            console.log('Song: "' + data.tracks.items[0].name + '"');
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview URL: " + data.tracks.items[0].external_urls.spotify);
        });

        //Appends to log.txt, as long as it isn't part of the do-what-it-says function pulling from random.txt
        if (!loggedRecords) {
            append(song);
        }

    }
}

//Function calls for each option
spot();
concert();
movie();

//If process.argv[2] is do-what-it-says, the fs module reads from random.txt
if (process.argv[2] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            throw error;
        } else {
            loggedRecords = true;

            console.log(data);
            //splits content of random.txt into an array based on commas and line breaks
            var dataArray = data.split("\n").join(",").split("\r").join(",").split(", ").join(",").split(",");
            //console.log(dataArray);

            //Loops through dataArray, replacing do-what-it-says with the first two values of dataArray, running the option functions, then removing what was added (plus two empty array values) to allow the next round of functions to work
            for (var i = 0; i < dataArray.length; i + 2) {
                process.argv.splice(2, 2, dataArray[i]);
                process.argv.push(dataArray[i + 1]);
                //console.log(dataArray);
                //console.log(process.argv);
                spot();
                movie();
                concert();
                dataArray.splice(0, 4);
            }
        }
    })
}





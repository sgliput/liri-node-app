require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var request = require("request");

var spotify = new Spotify(keys.spotify);

if(process.argv[2] === "movie-this"){
var movie = process.argv[3];

request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

  // If the request is successful (i.e. if the response status code is 200)
  if (!error && response.statusCode === 200) {
    console.log(JSON.parse(body));
    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
  }
});
}

if(process.argv[2] === "concert-this"){
var artist = process.argv[3];

request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error, response, body){
    console.log(error);
    
    console.log(JSON.parse(body));

});
}

if(process.argv[2] === "spotify-this-song"){
    if(process.argv.length > 3){
    var song = process.argv[3];
    } else{
        var song = "The Sign Ace of Base";
    }

    spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
        String.prototype.capitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

      console.log("Artist: " + data.tracks.items[0].artists[0].name.capitalize());
      console.log('Song: "' + data.tracks.items[0].name + '"');
      console.log("Album: " + data.tracks.items[0].album.name);
      console.log("Preview URL: " + data.tracks.items[0].external_urls.spotify);
      });

}

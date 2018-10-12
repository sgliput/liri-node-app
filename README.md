# liri-node-app

## Overview

This LIRI app (Language Interpretation and Recognition Interface) can access three different APIs based on user input. With certain input, it can read a separate file and use that data in its API calls. It also records the "search terms" in a separate file as an activity log. It requires the node-spotify-api, request, fs, and moment NPM packages.

## Spotify

After typing in "node liri", the next word determines which API is called. Typing "spotify-this-song" accesses the Spotify API, utilizing the node-spotify-api NPM package and enabled by a client ID and client secret from Spotify, both of which are stored in a separate .env file and accessed through the keys.js file. Whatever follows "spotify-this-song" is the song title searched by the Spotify API (with or without quotation marks). If nothing is typed after "spotify-this-song", the default song becomes "The Sign Ace of Base" since typing the artist with the title further clarifies what song is desired.

As seen in the example screenshot below, typing "node liri spotify-this-song Barlights" prints to the console the artist, song name, its album, and a preview link to listen to the song on Spotify (as long as you're signed in). The "Content Added!" line is triggered by the fs.appendFile function, confirming that it has automatically added "spotify-this-song Barlights" to log.txt, as seen in the left side of the screenshot.

![First Log Screenshot](/images/firstLog.png)


## Bandsintown

Typing "concert-this" after "node liri" in the command line accessed the Bandsintown API, inserting whatever words are typed afterward (with or without quotation marks) as the artist in the URL of the Bandsintown http call. If no error is returned, the artist's name is inserted into a title for the returned results and the venue, city, date (formatted with moment.js), and lineup of each concert are listed below. The city line also includes the state (region) and country, but only if the region is not a number, which seems to be the case in some other countries, like Japan, in which case only the city and country are listed. If the artist is alone, they are on the same line as the "Lineup:" label, but if they are one of several acts, they are all listed below "Lineup:". As seen below, the "Content Added!" line confirms that the search parameters in the initial command line call have been appended to log.txt.

![Second Log Screenshot](/images/secondLog.png)

There is no default if the user does not type anything after "concert-this" so nothing happens in that case. If the API call returns a null error and an empty array, it means the artist is not currently touring and has no concert dates to list, which logs a message to that effect.

![Third Log Screenshot](/images/thirdLog.png)

## OMDB

Typing "movie-this" accesses the OMDB API, inserting whatever words are typed afterward (with or without quotation marks) into the URL of the OMDB http call. If nothing is typed after "movie-this", the default movie searched becomes "Mr. Nobody", as seen below.

![Fourth Log Screenshot](/images/fourthLog.png)

Using the OMDB data, the console displays the movie's title, year, IMDB rating, Rotten Tomatoes rating (if applicable since OMDB also lists television; if there is no Rotten Tomatoes score, it shows "N/A"), country, language, plot summary, and a list of actors. Again, the "Content Added!" line confirms the search terms' insertion into log.txt, as shown below.

![Fifth Log Screenshot](/images/fifthLog.png)

## Do-What-It-Says

Typing "do-what-it-says" accesses the text in the separate random.txt file, using the fs.readFile function. The contents of that file are the first thing logged to the console in the screenshot below. They are broken into an array, separated at the commas and line breaks, and a for loop replaces the third and fourth values of process.argv in order to trigger the functions for the three API calls discussed above. This causes the appropriate API calls to fire one after the other, though not necessarily in order. The screenshot shows how the OMDB data is listed first, followed by Bandsintown and Spotify last.

To avoid confusion on new calls versus reading random.txt, the do-what-it-says option does not append anything to log.txt.

![Sixth Log Screenshot](/images/sixthLog.png)
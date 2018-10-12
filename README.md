# liri-node-app

## Overview

This LIRI app (Language Interpretation and Recognition Interface) can access three different APIs based on user input. With certain input, it can read a separate file and use that data in its API calls. It also records the "search terms" in a separate file as an activity log. It requires the node-spotify-api, request, fs, and moment NPM packages.

## Spotify

After typing in "node liri", the next word determines which API is called. Typing "spotify-this-song" accesses the Spotify API, utilizing the node-spotify-api NPM package and enabled by a client ID and client secret from Spotify, both of which are stored in a separate .env file and accessed through the keys.js file.

As seen in the example screenshot below, typing "node liri spotify-this-song Barlights" prints to the console the artist, song name, its album, and a preview link to listen to the song on Spotify (as long as you're signed in). The "Content Added!" line is triggered by the fs.appendFile function, confirming that it has automatically added "spotify-this-song Barlights" to log.txt, as seen in the left side of the screenshot.

![First Log Screenshot](https://sgliput.github.com/liri-node-app/images/firstLog.png)


## OMDB

Typing "movie-this" accesses the OMDB API, inserting whatever words are typed afterward into the URL of an http call.
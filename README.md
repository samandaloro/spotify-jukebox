# spotify-jukebox

The 'Spotify Jukebox' utilizes the Spotify Web API to fetch data about public playlists and display the information on a browser. Users can use the left and right arrow keys to browse different playlists and click the playlist cover art to open the playlist on the spotify desktop application or redirect to it on open.spotify.com

To run the project,
1. You will need a valid Spotify Authentication token, which can be retrieved at https://developer.spotify.com/console/get-playlist/
2. Select Get Token -> Request Token
3. Copy the token, and ~~replace the value of 'token' in app.js with the new token~~ enter it in the prompt when loading the page. Note that these tokens are only valid for 1 hour

TODO:
- ~~Simplify the process of refreshing the token by adding a prompt to update the token in the browser rather than modifying the code~~
- Add functionality to add new playlists in the browser

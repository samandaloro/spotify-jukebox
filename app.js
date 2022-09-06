

/* Spotify playlist IDs -> can be retrieved from the playlist url on open.spotify.com/playlist/ */
var playlistIds = ["37i9dQZF1DXa8NOEUWPn9W", "37i9dQZF1DXa2PvUpywmrr", "37i9dQZF1DX4dyzvuaRJ0n", "37i9dQZF1DWVY4eLfA3XFQ", 
                   "37i9dQZF1DXcBWIGoYBM5M", "37i9dQZF1DX4JAvHpjipBk", "37i9dQZF1DX0BcQWzuB7ZO", "37i9dQZF1DX1lVhptIYRda",
                   "37i9dQZF1DX3oM43CtKnRV", "37i9dQZF1DWVqJMsgEN0F4", "37i9dQZF1DWUZv12GM5cFk", "37i9dQZF1DXd1MXcE8WTXq"];
var originalPlaylistSize = playlistIds.length;
/* Playlist API */
var playlistAPI = "https://api.spotify.com/v1/playlists/";

/* Link to get new token */
var getNewTokenLink = "https://developer.spotify.com/console/get-playlist/";

/* Spotify Web API token - expires after 1 hour */
var token = "token"; 

/* Playlist objects to be created and populated upon API call */
var playlists = [];

/* Amount of tracks to be retrieved for each playlist */
var trackAmount = 10;

/* Set to false when token expires to notify user */
var isTokenValid = true;
var errMsg;

async function fetchPlaylistInfo(playlistId) {
    /* Make API call */
    var playlistData = await fetch(playlistAPI + playlistId, {
        method: "GET",
        headers: {"Authorization": "Bearer "+token, 
                  "Accept": "application/json", 
                  "Content-Type": "application/json"}
        }).then(response => {
            if (response.status == "401") {
                isTokenValid = false;
                errMsg = `Invalid Token, please refresh at ` + getNewTokenLink;
                throw Error(errMsg);
            } 
            else if (response.status == "404") {
                errMsg = `Error fetching playlist data ${playlistId}\n Please check that the playlist ID is entered correctly`;
                throw Error(errMsg);
            } 
            else if (!response.ok) {
                errMsg = "ERROR in response. Code: "+response.status;
                throw Error(errMsg);
            }
            return response.json();
        })
         .then(result => {
            /* console.log(result); */
            console.log(`Fetched data for ${result.name}`);

            /* Fetch top tracks from the playlist, only take artist and track name */
            var topTracks = [];
            for(t=0; t<trackAmount; t++) {
                var artist = result.tracks.items[t].track.artists[0].name;
                var name = result.tracks.items[t].track.name;
                topTracks.push(artist + " - " + name);
            }

            /* Gather all necessary data from the playlist */
            var info = {"Name":`${result.name}`,
                        "Description":`${result.description}`,
                        "Owner":`${result.owner.display_name}`,
                        "URI":`${result.uri}`,
                        "Image":`${result.images[0].url}`,
                        "TopTracks":topTracks,
                        "Followers":`${result.followers.total}`
                        }

            return info;
        })
        .catch(error => {
            console.log(error);
        });

        return playlistData;
}

async function getPlaylists() {
    /* Call API for each playlist and add to the playlist object array */
    for(i=0; i<playlistIds.length; i++) {
        playlists.push(await fetchPlaylistInfo(playlistIds[i]));
        console.log(playlists[i]);
    }
    /* Prompt for new token if the authentication token has expired */
    if (isTokenValid == false) { 
        token = prompt(errMsg + " and provide new token here: ");
        playlists = [];
        isTokenValid = true;
        getPlaylists();
    }
    else {
        createDefaultPlaylists(); 
    }
    
}

function createDefaultPlaylists() {
    for(i=0; i<playlists.length; i++) {
        createPlaylist(i);
    }
}

function createPlaylist(i) {

    var currentSlide;
    /* Check if playlist is an addition */
    if (i > originalPlaylistSize - 1) {
        var newSlide = document.createElement("div");
        newSlide.className = "slide fade";
        newSlide.style.display = "none";
        currentSlide = document.createElement("div");
        currentSlide.className = "playlist"+i;
        var slideshowElement = document.getElementById("slideshow");
        newSlide.appendChild(currentSlide);
        slideshowElement.appendChild(newSlide);

    }
    else {
        /* Get default slide div */
        var currentSlide = document.getElementById("playlist"+i);
    }

    /* Create and style div container for the playlist */
    var element = document.createElement("div");
    styleDivElement(element, i);

    /* Create and style image and link element */
    var imageLink = document.createElement("a");
    styleImage(imageLink, i);

    /* Create and style playlist title */
    var titleElement = document.createElement("h1");
    styleTitle(titleElement, i);

    /* Create and style playlist owner */
    var ownerElement = document.createElement("h5");
    styleOwner(ownerElement, i);

    /* Create and style playlist description */
    var descriptionElement = document.createElement("p");
    styleDescription(descriptionElement, i);

    /* Create and style playlist top tracks heading */
    var topTracks = document.createElement("p");
    styleTopTracks(topTracks, i);

    /* Create and style playlist top tracks list */
    var topTracksList = document.createElement("h4");
    styleTopTracksList(topTracksList, i);

    /* Create and style playlist followers */
    var followersElement = document.createElement("p");
    styleFollowers(followersElement, i);
        
    /* Append all children to the slide element */
    element.appendChild(imageLink);
    element.appendChild(titleElement);
    element.appendChild(ownerElement);
    element.appendChild(descriptionElement);
    element.appendChild(document.createElement("br"));
    element.appendChild(topTracks);
    element.appendChild(topTracksList)
    element.appendChild(followersElement);

    /* Append to the current slide */
    currentSlide.appendChild(element);

}

function styleDivElement(element, i) {
    element.className= "slide";
}

function styleImage(imageLink, i) {
    imageLink.setAttribute("href", playlists[i].URI);
    var imageElement = document.createElement("img")
    imageElement.className = "img";
    imageElement.setAttribute("src", playlists[i].Image);
    imageElement.setAttribute("alt", playlists[i].Name);
    imageLink.appendChild(imageElement);  
}

function styleTitle(titleElement, i) {
    titleElement.className = "title"
    titleElement.innerHTML = playlists[i].Name+" ";
}

function styleDescription(descriptionElement, i) {
    descriptionElement.className = "description";
    descriptionElement.innerHTML = removeCover(playlists[i].Description);
}

function styleFollowers(followersElement, i) {
    followersElement.className = "followers";
    followersElement.innerHTML = playlists[i].Followers + " followers"
}

function styleOwner(ownerElement, i) {
    ownerElement.className = "owner";
    ownerElement.innerHTML = " by " + playlists[i].Owner;
}

function styleTopTracks(topTracks, i) {
    topTracks.className = "top";
    topTracks.innerHTML = "Top Tracks";
}

function styleTopTracksList(topTracksList, i) {
    for(j=0; j<trackAmount; j++) {
        var track = document.createElement("p");
        track.className = "track";
        track.innerHTML = playlists[i].TopTracks[j]; 
        topTracksList.appendChild(track);
    }
    var more = document.createElement("p");
    more.className = "track";
    more.innerHTML = " and more..."
    topTracksList.appendChild(more);
}

/* Some playlist descriptions will mention who the cover artist is. Removing for aesthetic preference */
function removeCover(name) {
    if (name.search("Cover:") != -1) { return name.substring(0, name.search("Cover:")); }
    return name;
}

/* Functionality to add a new playlist */
async function addNewPlaylist() {
    var pid = document.getElementById("newPlaylist").value;
    document.getElementById("newPlaylist").value = "";
    console.log("New playlist id " + pid);
    if (pid !== null) {
        playlists.push(await fetchPlaylistInfo(pid));
        if (isTokenValid == false) { 
            token = prompt(errMsg + " and provide new token here: ");
            playlists = [];
            isTokenValid = true;
        }
    createPlaylist(playlists.length-1);
    console.log(playlists[playlists.length-1].Name+ " added")
    }
}
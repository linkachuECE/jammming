const clientId = 'a23843d079a34f28a8368672dc8a7bcd';
const redirectUri = 'http://localhost:3000'
let accessToken = null;

let Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }

        let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');

            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    search(searchTerm){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then((data) => {
            if (!data.tracks || !data.tracks.items)
                return [];
            else
                return data.tracks.items.map(track => ({
                    id:     track.id,
                    name:   track.name,
                    artist: track.artists[0].name,
                    album:  track.album.name,
                    uri:    track.uri
                }));
        });
    },

    async savePlaylist(name, trackURIs){
        let currAccessToken = accessToken;
        let headers = {Authorization: `Bearer ${currAccessToken}`}
        let userID = "";

        // Get userID
        const userIDEndpoint = "https://api.spotify.com/v1/me";
        userID = await fetch(userIDEndpoint, { headers: headers } ).then(response => response.json()).then(user => user.id);
        console.log(userID);
        
        // Create playlist
        const createPlaylistEndpoint = `https://api.spotify.com/v1/users/${userID}/playlists`
        let playlist = await fetch(createPlaylistEndpoint, {
            method: "POST", 
            headers: headers,
            body: JSON.stringify({name: name})
        }).then(response => response.json()).then(data => data);
        
        let playlistID = playlist.id;

        // Add tracks to playlist
        console.log(trackURIs);
        const addTracksPlaylistEndpoint = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
        let snapshot = await fetch(addTracksPlaylistEndpoint, { 
            headers: headers,
            method: "POST",
            body: JSON.stringify({uris: trackURIs})
        }).then(response => response.json()).then(data => data);

        console.log(snapshot);
    }
};

export default Spotify;
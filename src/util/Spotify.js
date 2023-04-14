const clientId = 'a23843d079a34f28a8368672dc8a7bcd';
const redirectUri = 'http://localhost:3000'
let accessToken = null;

let Spotify = {
    userID: "",
    async getUserID(){
        if(this.userID.length > 0)
            return this.userID;

        // Get userID
        let currAccessToken = accessToken;
        const userIDEndpoint = "https://api.spotify.com/v1/me";
        let headers = {Authorization: `Bearer ${currAccessToken}`}

        this.userID = await fetch(userIDEndpoint, { headers: headers } ).then(response => response.json()).then(user => user.id);
        return this.userID;
    },

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
        let currAccessToken = this.getAccessToken();
        let headers = {Authorization: `Bearer ${currAccessToken}`};

        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, { headers: headers })
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

        // Get userID
        await this.getUserID();
        
        // Create playlist
        const createPlaylistEndpoint = `https://api.spotify.com/v1/users/${this.userID}/playlists`
        let playlist = await fetch(createPlaylistEndpoint, {
            method: "POST", 
            headers: headers,
            body: JSON.stringify({name: name})
        }).then(response => response.json()).then(data => data);
        
        let playlistID = playlist.id;

        // Add tracks to playlist
        const addTracksPlaylistEndpoint = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
        let snapshot = await fetch(addTracksPlaylistEndpoint, { 
            headers: headers,
            method: "POST",
            body: JSON.stringify({uris: trackURIs})
        }).then(response => response.json()).then(data => data);

    },

    async getUserPlaylists(){
        let currAccessToken = this.getAccessToken();
        let headers = {Authorization: `Bearer ${currAccessToken}`};
        let playlists = [];

        // Get userID
        await this.getUserID();
        
        // Get playlists
        const userPlaylistsEndpoint = `https://api.spotify.com/v1/users/${this.userID}/playlists`
        
        playlists = await fetch(userPlaylistsEndpoint, { headers: headers })
        .then(response => response.json())
        .then((data) => {
            if (!data.items)
                return [];
            else
                return data.items.map(playlist => ({
                    id: playlist.id,
                    name: playlist.name
                }));
        });

        return playlists;
    },

    async getPlaylist(playlistID){
        let currAccessToken = this.getAccessToken();
        let headers = {Authorization: `Bearer ${currAccessToken}`};

        // Get userID
        await this.getUserID();

        // Get playlists
        const playlistEndpoint = `https://api.spotify.com/v1/users/${this.userID}/playlists/${playlistID}/tracks`
        
        let playlist = await fetch(playlistEndpoint, { headers: headers })
        .then(response => response.json())
        .then((data) => {
            return data;
        });

        playlist = playlist.items.map((item) => {
            return {
                id:     item.track.id,
                name:   item.track.name,
                artist: item.track.artists[0].name,
                album:  item.track.album.name,
                uri:    item.track.uri
            }
        });

        return playlist;
    },

    async deletePlaylist(playlistID){
        let currAccessToken = this.getAccessToken();
        let headers = {Authorization: `Bearer ${currAccessToken}`};

        // Create playlist
        const deletePlaylistEndpoint = `https://api.spotify.com/v1/playlists/${playlistID}/followers`
        let playlist = await fetch(deletePlaylistEndpoint, {
            method: "DELETE", 
            headers: headers,
        }).then(response => response.json()).then(data => data);

        
    },

    async deleteTracks(playlistID, tracks){
        let currAccessToken = this.getAccessToken();
        let headers = {Authorization: `Bearer ${currAccessToken}`};

        tracks = tracks.map(track => {
            console.log(track.uri);
            return { uri: track.uri }
        });

        console.log(tracks);

        // Create playlist
        const deleteTrackEndpoint = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`
        let playlist = await fetch(deleteTrackEndpoint, {
            method: "DELETE", 
            headers: headers,
            body: JSON.stringify({tracks: tracks})
        }).then(response => response.json()).then(data => data);

    },

    async addTracks(playlistID, tracks){
        let currAccessToken = this.getAccessToken();
        let headers = {Authorization: `Bearer ${currAccessToken}`};

        let uris = tracks.map(track => track.uri);

        console.log(uris);

        // Create playlist
        const addTrackEndpoint = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`
        let playlist = await fetch(addTrackEndpoint, {
            method: "POST", 
            headers: headers,
            body: JSON.stringify({uris: uris})
        }).then(response => response.json()).then(data => data);
    }
};

export default Spotify;
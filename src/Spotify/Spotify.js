import * as AuthActions from './AuthActions'
import { webVars } from './Globals';

// Helpers

function isEmpty(object){
    return (Object.keys(object).length === 0 && object.constructor === Object);
}

function queryConstructor(pathSegment, queryParameters = null){
    const url = webVars.baseApiUrl + pathSegment;
    
    if(queryParameters && !isEmpty(queryParameters)){
        const queryString = new URLSearchParams(queryParameters);
        return `${url}?${queryString.toString()}`;
    } else {
        return url;
    }
}

// Fetch helpers
async function fetchGetRequest(url){
    const accessToken = await AuthActions.getAccessToken();

    while(true){
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer    ${accessToken}`
            }
        });

        if(!response.ok){
            switch(response.status){
                case 401:
                    await AuthActions.getNewAccessToken();
                    continue;
                default:
                    console.log(`Bad GET request`);
                    console.log(response);
                    return null;
            }
        } else {   
            let data = null;

            try{
                data = await response.json();
            } catch(err){
                console.log(err);
            }
            
            return data;
        }
    }
}

async function fetchPutRequest(url, body){
    const accessToken = await AuthActions.getAccessToken();

    console.log(body);
    console.log(JSON.stringify(body));

    while(true){
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Bearer    ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        
        if(!response.ok){
            switch(response.status){
                case 401:
                    await AuthActions.getNewAccessToken();
                    continue;
                default:
                    console.log(`Bad PUT request from`);
                    console.log(response);
                    return null;
            }
        } else {
            let data = null;

            try{
                console.log(response);
                data = await response.json();
            } catch(err){
                console.log(err);
            }
            
            return data;
        }
    }
}

async function fetchPostRequest(url, body){
    const accessToken = await AuthActions.getAccessToken();

    while(true){
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer    ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        
        if(!response.ok){
            switch(response.status){
                case 401:
                    await AuthActions.getNewAccessToken();
                    continue;
                default:
                    console.log(`Bad POST request`);
                    console.log(response);
                    return null;
            }
        } else {
            let data = null;

            try{
                console.log(response);
                data = await response.json();
            } catch(err){
                console.log(err);
            }
            
            return data;
        }
    }
}

async function fetchDeleteRequest(url, body = null){
    const accessToken = await AuthActions.getAccessToken();

    while(true){
        let response;

        if(body){
            response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer    ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
        } else {
            response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer    ${accessToken}`,
                    "Content-Type": "application/json"
                }                
            });
        }
        
        if(!response.ok){
            switch(response.status){
                case 401:
                    await AuthActions.getNewAccessToken();
                    continue;
                default:
                    console.log(`Bad DELETE request from`);
                    console.log(response);
                    return null;
            }
        } else {
            let data = null;

            try{
                data = await response.json();
            } catch(err){
                console.log(response);
            }
            
            return data;
        }
    }
}

// Albums

export async function Albums_getNewAlbumReleases(country = "US", maxAlbums = 20){
    const pathSegment = "/browse/new-releases";

    const queryParameters = {
        country: country,
        limit: maxAlbums
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Albums_getAlbum(albumId, market = "US"){
    const pathSegment = `/albums/${albumId}`;

    const queryParameters = {
        market: market
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Albums_getSeveralAlbums(ids, market = "US"){
    const pathSegment = `/albums`;
    
    const albumString = ids.join(',');
    const queryParameters = {
        ids: albumString,
        market: market
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Albums_getAlbumTracks(albumId, limit = 20, market = "US"){
    const pathSegment = `/albums/${albumId}/tracks`;
    
    const queryParameters = {
        limit: limit,
        market: market
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Albums_getCurrentUserSavedAlbums(limit = 20, market = "US"){
    const pathSegment = `/me/albums`;
    
    const queryParameters = {
        limit: limit,
        market: market
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Albums_saveAlbumsForCurrentUser(ids){
    const pathSegment = `/me/albums`

    const queryParameters = {
        ids: ids
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    const body = {
        ids: ids
    };

    return await fetchPutRequest(queryUrl, body);
}

export async function Albums_removeCurrentUserSavedAlbums(ids){
    const pathSegment = `/me/albums`;

    const queryParameters = {
        ids: ids
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    const body = {
        ids: ids
    };

    return await fetchDeleteRequest(queryUrl, body);
}

// Artists

export async function Artists_getArtist(id){
    const pathSegment = `/artists/${id}`;

    const queryUrl = queryConstructor(pathSegment);

    return await fetchGetRequest(queryUrl);
}

export async function Artists_getArtistAlbums(id, limit = 20, market = "US"){
    const pathSegment = `/artists/${id}/albums`;

    const queryParameters = {
        limit: limit,
        market: market
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Artists_getArtistTopTracks(id, market = "US"){
    const pathSegment = `/artists/${id}/top-tracks`;

    const queryParameters = {
        market: market
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Artists_getRelatedArtists(id){
    const pathSegment = `/artists/${id}/related-artists`;

    const queryUrl = queryConstructor(pathSegment);

    return await fetchGetRequest(queryUrl);
}

// Genres

export async function Genres_getAvailableGenres(){
    const pathSegment = `/recommendations/available-genre-seeds`;

    const queryUrl = queryConstructor(pathSegment);

    return await fetchGetRequest(queryUrl);
}

// Player

export async function Player_getAvailableDevices(){
    const pathSegment = `/me/player/devices`;

    const queryUrl = queryConstructor(pathSegment);

    return await fetchGetRequest(queryUrl);
}

export async function Player_getCurrentlyPlayingTrack(market = "US"){
    const pathSegment = `/me/player/currently-playing`;
    
    const queryParameters = {
        market: market
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Player_getPlaybackState(market = "US"){
    const pathSegment = `/me/player`;
    
    const queryParameters = {
        market: market
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Player_transferPlayback(device_ids, play = true){
    const pathSegment = `/me/player`;

    const queryUrl = queryConstructor(pathSegment);

    const body = {
        device_ids: device_ids,
        play: play
    };

    return await fetchPutRequest(queryUrl, body);
}

export async function Player_startOrResumePlayback({    device_id = null,
                                                        context_uri = null,
                                                        uris = null,
                                                        offset = null,
                                                        position_ms = null    } = {}){
    const pathSegment = `/me/player/play`;

    const queryUrl = queryConstructor(pathSegment);

    const body = {};
    if(device_id)
        body.device_id = device_id;
    if(context_uri)
        body.context_uri = context_uri;
    if(uris)
        body.uris = uris;
    if(offset)
        body.offset = offset;
    if(position_ms)
        body.position_ms = position_ms;

    console.log(body);

    return await fetchPutRequest(queryUrl, body);
}

export async function Player_pausePlayback(device_id = null){
    const pathSegment = `/me/player/pause`;

    const queryUrl = queryConstructor(pathSegment);

    const body = {};
    if(device_id)
        body.device_id = device_id;

    return await fetchPutRequest(queryUrl, body);
}

export async function Player_skipToNext(device_id = null){
    const pathSegment = `/me/player/next`;

    const queryParameters = {};
    if(device_id)
        queryParameters.device_id = device_id;

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchPostRequest(queryUrl);
}

export async function Player_skipToPrevious(device_id = null){
    const pathSegment = `/me/player/previous`;

    const queryParameters = {};
    if(device_id)
        queryParameters.device_id = device_id;

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchPostRequest(queryUrl);
}

export async function Player_seekToPosition(position_ms, device_id = null){
    const pathSegment = `/me/player/seek`;

    const queryParameters = {
        position_ms: position_ms
    };

    if(device_id)
        queryParameters.device_id = device_id;

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchPutRequest(queryUrl);
}

async function Player_setRepeatMode(mode, device_id = null){
    const pathSegment = `/me/player/repeat`;

    const queryParameters = {
        state: mode
    };

    if(device_id)
        queryParameters.device_id = device_id;

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchPutRequest(queryUrl);
}

export async function Player_setRepeatTrack(device_id = null){
    Player_setRepeatMode("track", device_id);
}

export async function Player_setRepeatContext(device_id = null){
    Player_setRepeatMode("context", device_id);
}

export async function Player_setRepeatOff(device_id = null){
    Player_setRepeatMode("off", device_id);
}

export async function Player_setPlaybackVolume(volumePercent, device_id){
    const pathSegment = `/me/player/volume`;

    const queryParameters = {
        volume_percent: volumePercent
    };

    if(device_id)
        queryParameters.device_id = device_id;

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchPutRequest(queryUrl);
}

export async function Player_toggleShuffleOn(device_id = null){
    const pathSegment = `/me/player/shuffle`;

    const queryParameters = {
        state: true
    };

    if(device_id)
        queryParameters.device_id = device_id;

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchPutRequest(queryUrl);
}

export async function Player_toggleShuffleOff(device_id = null){
    const pathSegment = `/me/player/shuffle`;

    const queryParameters = {
        state: false
    };

    if(device_id)
        queryParameters.device_id = device_id;

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchPutRequest(queryUrl);
}

export async function Player_getRecentlyPlayedTracks(limit = null){
    const pathSegment = `/me/player/recently-played`;

    const queryParameters = {};

    if(limit)
        queryParameters.limit = limit;

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Player_getUserQueue(){
    const pathSegment = `/me/player/queue`;

    const queryUrl = queryConstructor(pathSegment);

    return await fetchGetRequest(queryUrl);
}

export async function Player_addItemToPlayback(uri, device_id = null){
    const pathSegment = `/me/player/queue`;

    const queryParameters = {
        uri: uri
    };

    if(device_id)
        queryParameters.device_id = device_id;

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchPostRequest(queryUrl);
}

// Playlists

export async function Playlists_getFeaturedPlaylists(country = "US", limit = 20){
    const pathSegment = `/browse/featured-playlists`;
    
    const queryParameters = {
        country: country,
        limit: limit
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Playlists_getPlaylist(playlistId, market = "US"){
    const pathSegment = `/playlists/${playlistId}`;
    
    const queryParameters = {
        market: market
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Playlists_getPlaylistItems(id, market = "US"){
    const pathSegment = `/playlists/${id}/tracks`;
    
    const queryParameters = {
        market: market
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Playlists_getCurrentUserPlaylists(limit = 20){
    const pathSegment = `/me/playlists`;
    
    const queryParameters = {
        limit: limit
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Playlists_getSpecificUserPlaylists(userId, limit = 20){
    const pathSegment = `/users/${userId}/playlists`;
    
    const queryParameters = {
        limit: limit
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Playlists_getPlaylistCoverImage(playlistId){
    const pathSegment = `/playlists/${playlistId}/images`;

    const queryUrl = queryConstructor(pathSegment);

    return await fetchGetRequest(queryUrl);
}

export async function Playlists_createPlaylist(userId, title, description = ""){
    const pathSegment = `/users/${userId}/playlists`;

    const body = {
        name: title,
        public: true
    }

    const queryUrl = queryConstructor(pathSegment);

    return await fetchPostRequest(queryUrl, body);
}

export async function Playlists_createPlaylistForCurrentUser(title, description = ""){
    const profile = await Users_getCurrentUserProfile();
    const userId = profile.id;

    return await Playlists_createPlaylist(userId, title, description);
}

export async function Playlists_addToPlaylist(playlistId, trackUris){
    const pathSegment = `/playlists/${playlistId}/tracks`;

    const body = {
        uris: trackUris
    }

    const queryUrl = queryConstructor(pathSegment);

    return await fetchPostRequest(queryUrl, body);
}

export async function Playlists_setPlaylistName(playlistId, name){
    const pathSegment = `/playlists/${playlistId}`;

    const body = {
        name: name
    }

    const queryUrl = queryConstructor(pathSegment);

    return await fetchPutRequest(queryUrl, body);
}

export async function Playlists_setPlaylistPublicStatus(playlistId, toPublic){
    const pathSegment = `/playlists/${playlistId}`;

    const body = {
        public: toPublic
    }

    const queryUrl = queryConstructor(pathSegment);

    return await fetchPutRequest(queryUrl, body);
}

export async function Playlists_setPlaylistDescription(playlistId, description){
    const pathSegment = `/playlists/${playlistId}`;

    const body = {
        description: description
    }

    const queryUrl = queryConstructor(pathSegment);

    return await fetchPutRequest(queryUrl, body);
}

export async function Playlists_removeMultipleTracksFromPlaylist(playlistId, trackUris, snapshotId = null){
    const pathSegment = `/playlists/${playlistId}/tracks`;

    const body = {
        tracks: trackUris.map(uri => {
            return {
                "uri": uri
            }
        })
    }

    if(snapshotId)
        body.snapshot_id = snapshotId;

    const queryUrl = queryConstructor(pathSegment);

    return await fetchDeleteRequest(queryUrl, body);
}

export async function Playlists_removeSingleTrackFromPlaylist(playlistId, trackUri, snapshotId = null){
    const pathSegment = `/playlists/${playlistId}/tracks`;

    const body = {
        tracks: [
            {
                "uri": trackUri
            }
        ]
    }

    if(snapshotId)
        body.snapshot_id = snapshotId;

    console.log(body)

    const queryUrl = queryConstructor(pathSegment);

    return await fetchDeleteRequest(queryUrl, body);
}

// Search

export async function Search_trackSearch(searchQuery, limit = 20){
    const pathSegment = `/search`;
    
    const queryParameters = {
        q: searchQuery,
        type: [
            "track"
        ]
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Search_artistSearch(searchQuery, limit = 20){
    const pathSegment = `/search`;
    
    const queryParameters = {
        q: searchQuery,
        type: [
            "artist"
        ]
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Search_albumSearch(searchQuery, limit = 20){
    const pathSegment = `/search`;
    
    const queryParameters = {
        q: searchQuery,
        type: [
            "album"
        ]
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

// Tracks

export async function Tracks_getTrack(trackId, market = "US"){
    const pathSegment = `/tracks/${trackId}`;
    
    const queryParameters = {
        market: market
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Tracks_getSeveralTracks(trackIds, market = "US"){
    const pathSegment = `/tracks`;
    
    const queryParameters = {
        ids: trackIds.join(","),
        market: market
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Tracks_getCurrentUserSavedTracks(market = "US", limit = 20){
    const pathSegment = `/me/tracks`;
    
    const queryParameters = {
        market: market,
        limit: limit
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Tracks_saveCurrentUserSavedTracks(trackIds){
    const pathSegment = `/me/tracks`;
    
    const queryParameters = {
        ids: trackIds.join(",")
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    const body = {
        ids: trackIds
    };

    return await fetchPutRequest(queryUrl, body);
}

export async function Tracks_removeCurrentUserSavedTracks(trackIds){
    const pathSegment = `/me/tracks`;
    
    const queryParameters = {
        ids: trackIds.join(",")
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    const body = {
        ids: trackIds
    };

    return await fetchDeleteRequest(queryUrl, body);
}

export async function Tracks_checkCurrentUserSavedTracks(trackIds){
    const pathSegment = `/me/tracks/contains`;
    
    const queryParameters = {
        ids: trackIds.join(",")
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Tracks_getTrackAudioFeatures(trackId){
    const pathSegment = `/audio-features/${trackId}`;
    
    const queryParameters = {
        ids: trackId
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Tracks_getMultipleTrackAudioFeatures(trackIds){
    const pathSegment = `/audio-features`;
    
    const queryParameters = {
        ids: trackIds.join(",")
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

// Users

export async function Users_getCurrentUserProfile(){
    const pathSegment = `/me`;

    const queryUrl = queryConstructor(pathSegment);

    return await fetchGetRequest(queryUrl);
}

export async function Users_getCurrentUserTopArtists(){
    const pathSegment = `/me/top/artists`;

    const queryUrl = queryConstructor(pathSegment);

    return await fetchGetRequest(queryUrl);
}

export async function Users_getCurrentUserFollowedArtists(after = null, limit = null){
    const pathSegment = "/me/following";

    let queryParameters = {
        type: "artist"
    };

    if(after)
        queryParameters.after = after;
    if(limit)
        queryParameters.limit = limit;

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}

export async function Users_getCurrentUserTopTracks(){
    const pathSegment = `/me/top/tracks`;

    const queryUrl = queryConstructor(pathSegment);

    return await fetchGetRequest(queryUrl);
}

export async function Users_getUserProfile(userId){
    const pathSegment = `/users/${userId}`;

    const queryUrl = queryConstructor(pathSegment);

    return await fetchGetRequest(queryUrl);
}

export async function Users_followPlaylist(playlistId, isPublic = true){
    const pathSegment = `/playlists/${playlistId}/followers`;


    const queryUrl = queryConstructor(pathSegment);

    const body = {
        public: isPublic
    };

    return await fetchPutRequest(queryUrl, body);
}

export async function Users_unfollowPlaylist(playlistId){
    const pathSegment = `/playlists/${playlistId}/followers`;

    const queryUrl = queryConstructor(pathSegment);

    return await fetchDeleteRequest(queryUrl);
}

export async function Users_followArtist(id){
    const pathSegment = `/me/following`;

    const queryParameters = {
        "type": "artist",
        ids: id
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    const body = {
        ids: [id]
    };

    return await fetchPutRequest(queryUrl, body);
}

export async function Users_unfollowArtist(id){
    const pathSegment = `/me/following`;

    const queryParameters = {
        "type": "artist",
        ids: id
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    const body = {
        ids: [id]
    };

    return await fetchDeleteRequest(queryUrl, body);
}

export async function Users_followArtists(ids){
    const pathSegment = `/me/following`;

    const queryParameters = {
        "type": "artist",
        ids: ids.join(',')
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    const body = {
        ids: ids
    };

    return await fetchPutRequest(queryUrl, body);
}

export async function Users_unfollowArtists(ids){
    const pathSegment = `/me/following`;

    const queryParameters = {
        "type": "artist",
        ids: ids.join(',')
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    const body = {
        ids: ids
    };

    return await fetchDeleteRequest(queryUrl, body);
}

export async function Users_getFollowedArtists(){
    const pathSegment = `/me/following`;
    
    const queryParameters = {
        type: "artist"
    };

    const queryUrl = queryConstructor(pathSegment, queryParameters);

    return await fetchGetRequest(queryUrl);
}
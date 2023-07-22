import * as AuthActions from './AuthActions'
import { webVars } from './Globals';

export async function getArtist(artistID){
    const accessToken = localStorage.getItem('accessToken')
    const baseUrl = webVars.baseApiUrl + "/v1/artists";

    const response = await fetch(`${baseUrl}/${artistID}`, {
        headers: {
            Authorization: `Bearer    ${accessToken}`
        }
    });  
    
    const data = await response.json();

    return data;
}

export async function getSearchResults(searchQuery){
    const baseUrl = webVars.baseApiUrl + "/v1/search";

    const queryString = new URLSearchParams({
        q: searchQuery,
        type: [
            "track"
        ]
    })

    const accessToken = await AuthActions.getAccessToken();

    while(true){
        const response = await fetch(`${baseUrl}?${queryString.toString()}`, {
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
                    console.log(response);
                    return null;
            }
        } else {   
            const data = await response.json();
            return data.tracks.items;
        }
    }
}

export async function getUserInfo(){
    const baseUrl = webVars.baseApiUrl + "/v1/me";

    const accessToken = await AuthActions.getAccessToken();
    
    while(true){
        const response = await fetch(baseUrl, {
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
                    console.log(response);
                    return null;
            }
        } else {    
            const data = await response.json();
            localStorage.setItem("userId", data.id);
            return data;
        }
    }
}

export async function createPlaylist(title){
    await getUserInfo();

    console.log(title);

    const userId = localStorage.getItem("userId");
    const baseUrl = `${webVars.baseApiUrl}/v1/users/${userId}/playlists`;

    const accessToken = await AuthActions.getAccessToken();

    const body = {
        name: title
    };

    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer    ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    return data;
}

export async function addToPlaylist(playlistId, tracks){
    if(!tracks)
        return;

    const baseUrl = `${webVars.baseApiUrl}/v1/playlists/${playlistId}/tracks`;

    const accessToken = await AuthActions.getAccessToken();

    const body = {
        uris: tracks.map((track) => track.uri)
    };

    const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer    ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    return data;
}
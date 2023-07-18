import axios from "axios";

const baseApiUrl = "https://api.spotify.com";
const tokenUrl = "https://accounts.spotify.com/api/token";
const clientId = "a23843d079a34f28a8368672dc8a7bcd";
const clientSecret = "d98f121afd3b4d9babc64ce90f4d35f2";
const redirectUri = 'http://localhost:3000';

async function requestAccessToken(){
    if(!localStorage.getItem("authCode"))
        return;

    let codeVerifier = localStorage.getItem('code_verifier');
    let authCode = localStorage.getItem("authCode");

    let body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier
    });

    const response = fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
    })
    .then(response => {
      if(!response.ok)
        throw new Error('HTTP status' + response.status);
    
        return response.json();
    })
    .then(data => {
        localStorage.setItem('accessToken', data.access_token)
    }).catch(error =>{
        console.log(error);
    }
    );
}

async function getArtist(artistID){
    const accessToken = localStorage.getItem('accessToken')
    const baseUrl = baseApiUrl + "/v1/artists";

    let response = await fetch(`${baseUrl}/${artistID}`, {
        headers: {
            Authorization: `Bearer  ${accessToken}`
        }
    });
    response = await response.json();
}

async function getSearchResults(searchQuery){
    const baseUrl = baseApiUrl + "/v1/search";

    let queryString = new URLSearchParams({
        q: searchQuery,
        type: [
            "track"
        ]
    })

    if (!localStorage.getItem("accessToken"))
        await requestAccessToken();

    const accessToken = localStorage.getItem("accessToken");

    let response = await fetch(`${baseUrl}?${queryString.toString()}`, {
        headers: {
          Authorization: `Bearer  ${accessToken}`
        }
    });
    let data = await response.json();

    return data.tracks.items;
}

async function getUserInfo(){
    const baseUrl = baseApiUrl + "/v1/me";

    if (!localStorage.getItem("accessToken"))
        await requestAccessToken();

    const accessToken = localStorage.getItem("accessToken");
    
    let response = await fetch(baseUrl, {
        headers: {
          Authorization: `Bearer  ${accessToken}`
        }
    });

    let data = await response.json();

    localStorage.setItem("userId", data.id)

    return data;
}

function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
  
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
  
    return base64encode(digest);
}

async function authorize(){
    let codeVerifier = generateRandomString(128);
    
    generateCodeChallenge(codeVerifier).then(codeChallenge => {
        let state = generateRandomString(16);
        let scope = 'user-read-private user-read-email playlist-modify-private playlist-modify-public';

        localStorage.setItem('code_verifier', codeVerifier);

        let args = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri,
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge
        });

        window.location = 'https://accounts.spotify.com/authorize?' + args;
    });
}

function setAuthCode(){
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('code'))
      localStorage.setItem("authCode", urlParams.get('code'));
}

async function createPlaylist(title){
    if(!localStorage.getItem("userId"))
        await getUserInfo();

    const userId = localStorage.getItem("userId");
    const baseUrl = `${baseApiUrl}/v1/users/${userId}/playlists`;

    const accessToken = localStorage.getItem("accessToken");

    let body = {
        name: title
    };

    let response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer  ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    let data = await response.json();

    return data;
}

async function addToPlaylist(playlistId, tracks){
    if(!tracks)
        return;

    const baseUrl = `${baseApiUrl}/v1/playlists/${playlistId}/tracks`;

    const accessToken = localStorage.getItem("accessToken");

    let body = {
        uris: tracks.map((track) => track.uri)
    };

    let response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer  ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    let data = await response.json();

    return data;
}

export {requestAccessToken, getSearchResults, getArtist, authorize, setAuthCode, getUserInfo, createPlaylist, addToPlaylist};
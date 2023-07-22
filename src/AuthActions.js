export const baseApiUrl = "https://api.spotify.com";
export const tokenUrl = "https://accounts.spotify.com/api/token";
export const clientId = "a23843d079a34f28a8368672dc8a7bcd";
export const clientSecret = "d98f121afd3b4d9babc64ce90f4d35f2";
export const redirectUri = 'http://localhost:3000';


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

export async function authorize(){
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

export function checkAuthCode(){
    const urlParams = new URLSearchParams(window.location.search);
    
    return urlParams.has('code');
}

export async function getAuthCode(){
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('code'))
        return urlParams.get('code');
    else
        authorize();
}

export function checkAccessToken(){
    if(localStorage.getItem("tokenDetails"))
        return true;
    else
        return false;
}

export async function testAccessToken(){
    const baseUrl = baseApiUrl + "/v1/me";

    let tokenDetails = localStorage.getItem('tokenDetails');
    
    if(!tokenDetails)
        return false;
    
    tokenDetails = JSON.parse(tokenDetails);
    let accessToken = tokenDetails.access_token;
    
    let response = await fetch(baseUrl, {
        headers: {
            Authorization: `Bearer    ${accessToken}`
        }
    });

    return response.ok;
}

export async function getNewAccessToken(){
    let authCode, codeVerifier;

    authCode = await getAuthCode();

    let i = 0
    codeVerifier = localStorage.getItem('code_verifier');
    
    let body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier
    });
    
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    })

    console.log(response);
    
    if (!response.ok){
        switch(response.status){
            case 400:
                authorize();
        }
    }    
        
    const data = await response.json();
    runAccessTokenTimer(data.expires_in);
    
    localStorage.setItem('tokenDetails', JSON.stringify(data));

    return data;
}

async function runAccessTokenTimer(timer){
    setTimeout(() => deleteToken, timer * 1000);
}

export async function getAccessToken(){
    let tokenDetails = localStorage.getItem('tokenDetails');
    
    if(!tokenDetails){
        tokenDetails = await getNewAccessToken();
    }
    
    tokenDetails = JSON.parse(tokenDetails);
    return tokenDetails.access_token;
}

export function deleteToken(){
    localStorage.removeItem('tokenDetails');
    console.log("Removed access token");
}

export async function login(){
    let authCode = await getAuthCode();
    let accessToken = await getNewAccessToken();
}

export function isLoggedIn(){
    return testAccessToken();
}

export function checkState(){
    // If there is an auth code in the URL, we need to check the access token and request a new one if it isn't valid
    if(checkAuthCode()){
        console.log("Auth code checked and found");

        if(!checkAccessToken()){
            console.log("Access token not found, requesting a new one");

            getNewAccessToken();

            console.log("Requested a new access token");
            
            if(checkAccessToken()){
                console.log("New access token saved");
            } else {
                console.log("New access token not saved");
            }

        } else {
            testAccessToken()
            .then((tokenValid) => {
                if(!tokenValid){
                    console.log("Access token not found, requesting a new one");

                    getNewAccessToken();

                    console.log("Requested a new access token");

                    if(checkAccessToken()){
                        console.log("New access token saved");
                    } else {
                        console.log("New access token not saved");
                    }
                } else {
                    console.log("Access token in storage is valid");
                }
            })
        }
    // If there is no auth code, check if an access token exists.
    // If it does and it's valid, do nothing
    // If it's not valid, delete it
    } else {
        console.log("Auth code checked and not found");
        if(checkAccessToken()){
            console.log("Found access token, testing...")
            testAccessToken()
            .then((tokenValid) => {
                if(!tokenValid){
                    console.log("Access token in local storage not valid, deleting...")
                    deleteToken();
                    console.log("Delete access token");
                } else {
                    console.log("Access token in storage is valid");
                }
            })
        } else {
            console.log("Access token checked and not found");
        }
    }
}
import * as AuthActions from './AuthActions'

export async function getArtist(artistID){
        const accessToken = localStorage.getItem('accessToken')
        const baseUrl = AuthActions.baseApiUrl + "/v1/artists";

        let response = await fetch(`${baseUrl}/${artistID}`, {
                headers: {
                        Authorization: `Bearer    ${accessToken}`
                }
        });
        response = await response.json();
}

export async function getSearchResults(searchQuery){
        const baseUrl = AuthActions.baseApiUrl + "/v1/search";

        let queryString = new URLSearchParams({
                q: searchQuery,
                type: [
                        "track"
                ]
        })

        const accessToken = await AuthActions.getAccessToken();

        let i = 0
        let response = await fetch(`${baseUrl}?${queryString.toString()}`, {
                headers: {
                        Authorization: `Bearer    ${accessToken}`
                }
        });

        if(!response.ok){
                switch(response.status){
                        case 401:
                                await AuthActions.getNewAccessToken();
                }
        }
        
        let data = await response.json();
        return data.tracks.items;
}

export async function getUserInfo(){
        const baseUrl = AuthActions.baseApiUrl + "/v1/me";

        const accessToken = await AuthActions.getAccessToken();
        
        let response = await fetch(baseUrl, {
                headers: {
                    Authorization: `Bearer    ${accessToken}`
                }
        });

        while(true){
                if(!response.ok && response.status == 401){
                        await AuthActions.getNewAccessToken();
                }
                
                let data = await response.json();
                
                localStorage.setItem("userId", data.id)
                
                return data;
        }
}

export async function createPlaylist(title){
        if(!localStorage.getItem("userId"))
                await getUserInfo();

        const userId = localStorage.getItem("userId");
        const baseUrl = `${AuthActions.baseApiUrl}/v1/users/${userId}/playlists`;

        const accessToken = await AuthActions.getAccessToken();

        let body = {
                name: title
        };

        let response = await fetch(baseUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer    ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
        });

        let data = await response.json();

        return data;
}

export async function addToPlaylist(playlistId, tracks){
        if(!tracks)
                return;

        const baseUrl = `${AuthActions.baseApiUrl}/v1/playlists/${playlistId}/tracks`;

        const accessToken = await AuthActions.getAccessToken();

        let body = {
                uris: tracks.map((track) => track.uri)
        };

        let response = await fetch(baseUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer    ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
        });

        let data = await response.json();

        return data;
}
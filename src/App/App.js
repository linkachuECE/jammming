import { useEffect, useState } from 'react';
import logo from '../logo.svg';
import Playlist from '../Components/Playlist/Playlist';
import SearchBar from '../Components/SearchBar/SearchBar';
import SearchResults from '../Components/SearchResults/SearchResults';
import UserProfile from '../Components/UserProfile/UserProfile';
import * as Spotify from '../Spotify/Spotify';
import * as AuthActions from '../Spotify/AuthActions'
import AppStyles from './App.module.css'

function App() {
    const [searchResults, setSearchResults] = useState([]);

    const [playlist, setPlaylist] = useState({});

    const [userInfo, setUserInfo] = useState({});

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        AuthActions.checkState();
        setLoggedIn(AuthActions.isLoggedIn());
    }, []);

    function addToPlaylistHandler(track){
        if(!playlist.tracks){
            setPlaylist((prev) => {
                return {
                    title: prev.title,
                    id: prev.id,
                    tracks: [
                        track
                    ]
                }
            })
        }
        else if(!playlist.tracks.find((currTrack) => currTrack.id === track.id)){
            setPlaylist((prev) =>{
                return {
                    title: prev.title,
                    tracks: [
                        ...prev.tracks,
                        track
                    ]
                }
            }
        )}
    }

    function removeFromPlaylistHandler(track){
        if(playlist.tracks.find((currTrack) => currTrack.id === track.id)){
            setPlaylist((prev) => {
                return {
                    title: prev.title,
                    tracks: prev.tracks.filter((currTrack) => currTrack.id !== track.id)
                }
            })
        }
    }

    function changePlaylistTitleNameHandler(newTitle){
        console.log(newTitle);

        setPlaylist((prev) => {
            return {
                title: newTitle,
                tracks: prev.tracks
            }
        })
    }

    async function searchQueryHandler(query){
        if(!query)
            return;

        let results = [];
        results = await Spotify.Search_trackSearch(query);

        let tracks = results.tracks.items;

        let newResults = [];

        if(tracks.length != 0){
            newResults = tracks.map(track => {
                return {
                    title: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    id: track.id,
                    uri: track.uri
                }
            });
        }
            
        setSearchResults(newResults);
    }

    async function createPlaylistHandler(){
        if(!playlist || !playlist.tracks || !playlist.title|| playlist.tracks.length == 0)
            return;

        const {id} = await Spotify.Playlists_createPlaylistForCurrentUser(playlist.title);

        const trackUris = playlist.tracks.map(track => track.uri);

        Spotify.Playlists_addToPlaylist(id, trackUris);

        setPlaylist({});
    }

    async function functionTester(){
        const result1 = await Spotify.Player_getPlaybackState();
        console.log(result1);

        const result2 = await Spotify.Player_getUserQueue();
        console.log(result2);

        const result3 = await Spotify.Player_getRecentlyPlayedTracks();
        console.log(result3);
        const randomTrackUri = result3.items[0].track.uri;
        console.log(randomTrackUri);

        const result4 = await Spotify.Player_addItemToPlayback(randomTrackUri);
        console.log(result4);
    }

    return (
        <div className={AppStyles.app}>
            { userInfo && <UserProfile user={userInfo} /> }
            <div className={AppStyles.searchContainer}>
                <SearchResults searchResults={searchResults} onAddTrack={addToPlaylistHandler} onSearchQuery={searchQueryHandler} />
            </div>
            <div className={AppStyles.playlistContainer}>
                <Playlist title={playlist.title} tracks={playlist.tracks} onRemoveTrack={removeFromPlaylistHandler} onTitleChange={changePlaylistTitleNameHandler} onCreate={createPlaylistHandler} />
            </div>
            <button onClick={functionTester}>Test function</button>
        </div>
    );
}

export default App;

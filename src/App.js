import { useEffect, useState } from 'react';
import logo from './logo.svg';
import Playlist from './components/Playlist/Playlist';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import UserProfile from './components/UserProfile/UserProfile';
import * as Spotify from './Spotify';
import * as AuthActions from './AuthActions'
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
        results = await Spotify.getSearchResults(query);

        let newResults = [];

        if(results.length != 0){
            newResults = results.map(result => {
                return {
                    title: result.name,
                    artist: result.artists[0].name,
                    album: result.album.name,
                    id: result.id,
                    uri: result.uri
                }
            });
        }
            
        setSearchResults(newResults);
    }

    async function createPlaylistHandler(){
        if(!playlist || !playlist.tracks || playlist.tracks.length == 0)
            return;

        const {id} = await Spotify.createPlaylist(playlist.title);

        Spotify.addToPlaylist(id, playlist.tracks);

        setPlaylist({});
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
        </div>
    );
}

export default App;

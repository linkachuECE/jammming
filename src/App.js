import logo from './logo.svg';
import './App.css';
import './components/Track/Track'
import Track from './components/Track/Track';
import Tracklist from './components/Tracklist/Tracklist';
import Playlist from './components/Playlist/Playlist';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Login from './components/Login/Login';
import { useEffect, useState } from 'react';
import { requestAccessToken, getSearchResults, authorize, setAuthCode, getUserInfo, createPlaylist, addToPlaylist } from './Spotify';
import UserProfile from './components/UserProfile/UserProfile';

function App() {
  const [searchResults, setSearchResults] = useState([]);

  const [playlist, setPlaylist] = useState({});

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    setAuthCode();
    if(localStorage.getItem("authCode")){
      getUserInfo().then(user => setUserInfo({
        name: user.display_name,
        id: user.id,
        country: user.country,
        email: user.email
      }));
    }

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

    let results = await getSearchResults(query);
    
    let newResults = results.map(result => {
      return {
        title: result.name,
        artist: result.artists[0].name,
        album: result.album.name,
        id: result.id,
        uri: result.uri
      }
    });
    
    setSearchResults(newResults);
  }

  async function createPlaylistHandler(){
    const {id} = await createPlaylist(playlist.title);

    addToPlaylist(id, playlist.tracks);

    setPlaylist({});
  }

  return (
    <div className="App">
      { userInfo && <UserProfile user={userInfo} /> }
      <Login onClick={authorize} />
      <Playlist title={playlist.title} tracks={playlist.tracks} onRemoveTrack={removeFromPlaylistHandler} onTitleChange={changePlaylistTitleNameHandler} onCreate={createPlaylistHandler} />
      <SearchBar onSearchQuery={searchQueryHandler} />
      <SearchResults searchResults={searchResults} onAddTrack={addToPlaylistHandler} />
    </div>
  );
}

export default App;

import { render } from '@testing-library/react';
import React from 'react'
import { SearchBar } from '../SearchBar/SearchBar'
import { SearchResults } from '../SearchResults/SearchResults'
import { Playlist } from '../Playlist/Playlist'
import { PlaylistList } from '../PlaylistList/PlaylistList';
import Spotify from '../../util/Spotify';
import PlaylistTracker from '../../util/PlaylistTracker';

import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [], 
      playlistName: null,
      playlistTracks: [],
      playlistID: null,
      playlistLoaded: false,
      localPlaylists: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.editPlaylist = this.editPlaylist.bind(this);
    this.refreshLocalPlaylists = this.refreshLocalPlaylists.bind(this);
  }

  removeTrack(track){
    let newList = this.state.playlistTracks.filter((currTrack) => currTrack.id !== track.id);
    this.setState({playlistTracks: newList});

    if(this.state.playlistID)
      PlaylistTracker.delete(track);
  }

  addTrack(newTrack){
    if(!this.state.playlistTracks.some((currTrack) => currTrack.id === newTrack.id)){
      this.setState({playlistTracks: [...this.state.playlistTracks, newTrack]});
    }

    if(this.state.playlistID)
      PlaylistTracker.add(newTrack);
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    let trackURIs = this.state.playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);

    this.clearSelection();
    this.refreshLocalPlaylists();
  }

  async selectPlaylist(id, name){
    let playlist = await Spotify.getPlaylist(id);

    this.setState({
      playlistName: name,
      playlistID: id,
      playlistTracks: playlist,
    });

    PlaylistTracker.init(id, playlist);
  }

  deletePlaylist(playlistID){
    Spotify.deletePlaylist(playlistID);

    this.clearSelection();

    this.refreshLocalPlaylists();
  }

  async refreshLocalPlaylists(){
    console.log("Refreshing");
    this.setState({
      localPlaylists: await Spotify.getUserPlaylists()
    });
  }

  clearSelection(){
    this.setState({
      playlistName: null,
      playlistID: null,
      playlistTracks: []
    });
  }

  editPlaylist(){
    PlaylistTracker.executeChanges();

    this.clearSelection();
    this.refreshLocalPlaylists();
  }

  search(searchTerm){
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({searchResults: searchResults});
    })
  }
  
  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist 
              playlistName={this.state.playlistName}
              playlistID={this.state.playlistID}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              onDelete={this.deletePlaylist}
              onEdit={this.editPlaylist}
              onClear={this.clearSelection}
            />
          </div>
          <div className="User-playlists">
            <PlaylistList 
              onSelect={this.selectPlaylist}
              refreshList={this.refreshLocalPlaylists}
              playlists={this.state.localPlaylists}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default App;

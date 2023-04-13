import { render } from '@testing-library/react';
import React from 'react'
import { SearchBar } from '../SearchBar/SearchBar'
import { SearchResults } from '../SearchResults/SearchResults'
import { Playlist } from '../Playlist/Playlist'
import Spotify from '../../util/Spotify';

import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [], 
      playlistName: "default",
      playlistTracks: [
        
      ]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  removeTrack(track){
    let newList = this.state.playlistTracks.filter((currTrack) => currTrack.id !== track.id);
    this.setState({playlistTracks: newList});
  }

  addTrack(newTrack){
    if(!this.state.playlistTracks.some((currTrack) => currTrack.id === newTrack.id)){
      this.setState({playlistTracks: [...this.state.playlistTracks, newTrack]});
    }
  }

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist(){
    let trackURIs = this.state.playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);

    this.setState({playlistTracks: []});
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
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default App;

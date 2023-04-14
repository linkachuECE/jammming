import React from 'react'
import { TrackList } from '../TrackList/TrackList'
import './Playlist.css'
import PlaylistTracker from '../../util/PlaylistTracker';

export class Playlist extends React.Component {
    constructor(props){
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
        this.renderInput = this.renderInput.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
    }

    handleNameChange(event){
        this.props.onNameChange(event.target.value);
    }

    removeTrack(track){
        if(this.props.playlistID)
            PlaylistTracker.delete(track);
        this.props.onRemove(track);
    }

    deletePlaylist(){
        this.props.onDelete(this.props.playlistID);
    }

    renderInput(){
        let def = this.props.playlistID ? this.props.playlistName : 'New Playlist';

        return (
            <div key={def} >
                <input defaultValue={def} onChange={this.handleNameChange} style={{textAlign: "center"}}/>
            </div>
        );
    }

    renderButtons(){
        if(!this.props.playlistID){
            return <button className="Playlist-button Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
        } else {
            return (
                <div>
                    <button className="Playlist-button Playlist-edit" onClick={this.props.onEdit}>APPLY CHANGES</button>
                    <button className="Playlist-button Playlist-delete" onClick={this.deletePlaylist}>DELETE PLAYLIST</button>
                    <button className="Playlist-button Playlist-clear" onClick={this.props.onClear}>CLEAR SELECTION</button>
                </div>
            );
        }
    }

    render(){
        return (
            <div className="Playlist">
                {this.renderInput()}
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
                {this.renderButtons()}
            </div>
        )
    }
}
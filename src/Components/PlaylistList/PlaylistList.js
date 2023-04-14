import React from 'react'
import './PlaylistList.css'
import Spotify from '../../util/Spotify'
import { PlaylistListItem } from '../PlaylistListItem/PlaylistListItem'
import { keyboard } from '@testing-library/user-event/dist/keyboard';

export class PlaylistList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            playlists: []
        };

        this.renderPlaylist = this.renderPlaylist.bind(this);
    }

    async componentDidMount(){
        this.props.refreshList();
    }

    renderPlaylist(playlist){
        return <PlaylistListItem playlist={playlist} key={playlist.id} onSelect={this.props.onSelect} />
    }

    render(){
        return (
            <div className="PlaylistList">
                <h2>Local Playlists</h2>
                <button className="PlaylistList-refresh" onClick={this.props.refreshList}>REFRESH</button>
                {this.props.playlists.map(this.renderPlaylist)}
            </div>
        )
    }
}
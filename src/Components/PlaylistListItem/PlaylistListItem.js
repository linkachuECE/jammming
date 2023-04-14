import React from 'react'
import './PlaylistListItem.css'
import Spotify from '../../util/Spotify'

export class PlaylistListItem extends React.Component {
    constructor(props){
        super(props);

        this.onSelect = this.onSelect.bind(this);
    }

    onSelect(){
        this.props.onSelect(this.props.playlist.id, this.props.playlist.name);
    }

    

    render(){
        return (
            <div className="PlaylistListItem">
                <div className="PlaylistListItem-information">
                    <h3 onClick={this.onSelect}>{this.props.playlist.name}</h3>
                </div>
            </div>
        );
    }
}
import React from 'react'
import { Track } from '../Track/Track'
import './TrackList.css'

export class TrackList extends React.Component{
    constructor(props){
        super(props);
        this.renderTrack = this.renderTrack.bind(this);
    }

    renderTrack(track){
        return <Track track={track} key={track.id} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval} />
    }

    render(){
        return (
            <div className="TrackList">
                {this.props.tracks.map(this.renderTrack)}
            </div>
        )
    }
}
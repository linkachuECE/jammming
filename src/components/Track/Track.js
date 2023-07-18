import React from "react";

function Track(props){
    const track = props.track;

    function onAddTrack(e){
        props.onAddTrack(track);
    }

    function onRemoveTrack(e){
        props.onRemoveTrack(track);
    }

    const handler = props.added ? onRemoveTrack : onAddTrack;
    const symbol = props.added ? "-" : "+";

    return (
        <div className="track">
            <div className="trackInfo">
                <h3>{track.title}</h3>
                <h4>{track.artist} | {track.album}</h4>
            </div>
            <button className="AddOrRemove" onClick={handler}>{symbol}</button>
        </div>
    );
}

export default Track;
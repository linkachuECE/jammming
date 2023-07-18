import React from "react";
import Track from "../Track/Track";

function Tracklist(props){
    return (
        <div className="trackList">
            {props.tracks && props.tracks.map(track => {
                return (
                    <Track
                        track={track}
                        key={track.id}
                        onAddTrack={props.onAddTrack}
                        onRemoveTrack={props.onRemoveTrack}
                        added={props.added}
                    /> 
                );
            })}
        </div>
    );
}

export default Tracklist;
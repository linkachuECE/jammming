import React from "react";
import standardStyles from "../genericStyleModules/standardElements.module.css"
import trackStyles from "./track.module.css"

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
        <div className={trackStyles.track}>
            <div className={trackStyles.trackInfo}>
                <h3>{track.title}</h3>
                <h4>{track.artist} | {track.album}</h4>
            </div>
            <button className={`${standardStyles.button} ${trackStyles.button}`} onClick={handler}>{symbol}</button>
        </div>
    );
}

export default Track;
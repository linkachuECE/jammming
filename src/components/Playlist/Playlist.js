import React from "react";
import Tracklist from "../Tracklist/Tracklist";
import buttonStyles from "../genericStyleModules/button.module.css"
import inputStyles from "../genericStyleModules/input.module.css"

function Playlist(props){
    const title = props.title;
    const inputValue = props.Playlist
    const tracks = props.tracks ? props.tracks : [];

    function onTitleChange(e){
        props.onTitleChange(e.target.value);
    }

    function onCreate(e){
        e.preventDefault();
        props.onCreate();
    }

    return (
        <div className="playlist">
            <form>
                <input type="text" placeholder="Enter a playlist title" value={title} onChange={onTitleChange} className={inputStyles.input} />
                <button type="submit" onClick={onCreate} className={buttonStyles.button}>Save to Account</button>
            </form>
            <Tracklist tracks={props.tracks} onAddTrack={props.onAddTrack} onRemoveTrack={props.onRemoveTrack} added={true} />
        </div>
    );
}

export default Playlist;
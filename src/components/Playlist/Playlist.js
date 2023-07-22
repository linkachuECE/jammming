import React from "react";
import Tracklist from "../Tracklist/Tracklist";
import standardStyles from "../genericStyleModules/standardElements.module.css"
import playlistStyles from "./playlist.module.css"
import PlaylistNameEntry from "../PlaylistNameEntry/PlaylistNameEntry";

function Playlist(props){
    const title = props.title;
    const inputValue = props.Playlist
    const tracks = props.tracks ? props.tracks : [];

    function onCreate(e){
        e.preventDefault();
        props.onCreate();
    }

    return (
        <div className={playlistStyles.playlist} >
            <PlaylistNameEntry onCreate={props.onCreate} onTitleChange={props.onTitleChange} />
            <Tracklist tracks={props.tracks} onAddTrack={props.onAddTrack} onRemoveTrack={props.onRemoveTrack} added={true} />
        </div>
    );
}

export default Playlist;
import React from "react";
import Tracklist from "../Tracklist/Tracklist";
import standardStyles from "../genericStyleModules/standardElements.module.css"

function PlaylistNameEntry(props){
    const title = props.title;

    function onTitleChange(e){
        props.onTitleChange(e.target.value);
    }

    function onCreate(e){
        e.preventDefault();
        props.onCreate();
    }

    return (
        <div>
            <form>
                <input type="text" placeholder="Enter a playlist title" value={title} onChange={onTitleChange} className={standardStyles.input} />
                <button type="submit" onClick={onCreate} className={standardStyles.button}>Save to Account</button>
            </form>
        </div>
    );
}

export default PlaylistNameEntry;
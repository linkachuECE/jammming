import React from "react";
import Tracklist from "../Tracklist/Tracklist";

function SearchResults(props){
    return (
        <div className="searchResults">
            <h1>Search Results:</h1>
            <Tracklist tracks={props.searchResults} onAddTrack={props.onAddTrack} added={false} />
        </div>
    )
}

export default SearchResults;
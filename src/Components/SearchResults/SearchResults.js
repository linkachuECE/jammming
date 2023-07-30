import React from "react";
import Tracklist from "../Tracklist/Tracklist";
import styles from "./searchResults.module.css"
import SearchBar from "../SearchBar/SearchBar";

function SearchResults(props){
    return (
        <div className={styles.searchResults}>
            <SearchBar onSearchQuery={props.onSearchQuery} />
            <Tracklist tracks={props.searchResults} onAddTrack={props.onAddTrack} added={false} />
        </div>
    )
}

export default SearchResults;
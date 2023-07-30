import React from "react";
import standardStyles from "../genericStyleModules/standardElements.module.css"
import searchBarStyles from "./searchBar.module.css"

function SearchBar(props){
    function onSearchQuery(e){
        let val = e.target.elements["query"].value;
        e.preventDefault();
        props.onSearchQuery(val);
    }

    return (
        <div className={searchBarStyles.searchBar}>
            <form onSubmit={onSearchQuery}>
                <input type="text" id="query" placeholder="Enter a search query" className={standardStyles.input} />
                <button type="submit" className={standardStyles.button} >Search</button>
            </form>
        </div>
    );
}

export default SearchBar;
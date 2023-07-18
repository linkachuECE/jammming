import React from "react";

function SearchBar(props){
    function onSearchQuery(e){
        let val = e.target.elements["query"].value;
        e.preventDefault();
        props.onSearchQuery(val);
    }

    return (
        <div className="searchBar">
            <form onSubmit={onSearchQuery}>
                <input type="text" id="query" placeholder="Enter a search query" />
                <input type="submit" value="Search" />
            </form>
        </div>
    );
}

export default SearchBar;
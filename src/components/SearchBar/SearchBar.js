import React from "react";
import buttonStyles from "../genericStyleModules/button.module.css"
import inputStyles from "../genericStyleModules/input.module.css"

function SearchBar(props){
    function onSearchQuery(e){
        let val = e.target.elements["query"].value;
        e.preventDefault();
        props.onSearchQuery(val);
    }

    return (
        <div className="searchBar">
            <form onSubmit={onSearchQuery}>
                <input type="text" id="query" placeholder="Enter a search query" className={inputStyles.input} />
                <button type="submit" className={buttonStyles.button} >Submit</button>
            </form>
        </div>
    );
}

export default SearchBar;
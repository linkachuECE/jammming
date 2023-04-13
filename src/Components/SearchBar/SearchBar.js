import React from 'react'
import './SearchBar.css'

export class SearchBar extends React.Component {
    constructor(props){
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.state = {searchTerm: null};
    }

    search(){
        this.props.onSearch(this.state.searchTerm);
    }

    handleEnter(event){
        if(event.key === 'Enter')
            this.search();
    }

    handleTermChange(event){
        this.setState({searchTerm: event.target.value});
        if(event.key === 'Enter')
            this.search();
    }

    render(){
        return (
            <div className="SearchBar">
                <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyDown={this.handleEnter}/>
                <button className="SearchButton" onClick={this.search} >SEARCH</button>
            </div>
        );
    }
};
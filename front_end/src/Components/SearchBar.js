import React, { Component } from 'react';

class SearchBar extends Component {
    //Javascript functions go here:




    render() {
        return (
        <form>
            <input type="text" />
            <button onClick = {this.downloadSelected}>Download Selected</button>
            <button onClick = {this.props.selectAll}>Select All</button>
            <button onClick = {this.props.unselectAll}>Unselect All</button>
            <select>
                <option>Option</option>
            </select>
        </form>
        )
    }
}

export default SearchBar;
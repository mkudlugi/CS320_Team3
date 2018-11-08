import React, { Component } from 'react';

class SearchBar extends Component {
    //Javascript functions go here:

    render() {
        return (
        <form>
            <input type="text" />
            <button >Download Selected</button>
            <button>Select All</button>
            <select>
                <option>Option</option>
            </select>
        </form>
        )
    }
}

export default SearchBar;
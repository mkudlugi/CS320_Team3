import React, { Component } from 'react';

class SearchBar extends Component {
    //Javascript functions go here:




    render() {
        return (
            <nav class="navbar navbar-light bg-light navbar-expand-lg">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                    <label onClick = {this.props.selectAll} class="btn btn-secondary">Select All </label>
                    <label onClick = {this.props.unselectAll} class="btn btn-secondary">Unselect All </label>
                    <label onClick = {this.props.downloadSelected} class="btn btn-secondary">Downaload Selected </label>
                    </li>
                    {/* <li class="nav-item">
                        <a class="nav-link" href="#">Download</a>
                    </li> */}
                    <li class="nav-item dropdown">
                        <select class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <option value="all">Search by all</option>
                            <option value="tenant">Search by Tenant</option>
                            <option value="serial">Search by Serial</option>
                        </select>
                    </li>
                </ul>
                <form class="form-inline my-2 my-lg-0">
                    <input class="form-control mr-sm-2" id="searchInput" type="search" placeholder="Search" aria-label="Search"></input>
                    <button class="btn my-2 my-sm-0" type="submit" onClick={this.props.onSearchClick}>Search</button>
                </form>
            </nav>
        )
    }
}

export default SearchBar;
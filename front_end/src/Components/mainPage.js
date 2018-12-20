import React, { Component } from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';

class MainPage extends Component {
    //Javascript functions go here:
    state = {
        jsonList: [],
        jsonListItems: [],
        page: 0
    }
    constructor(props) {
        super(props);
        this.state = {
            jsonList: [],
            jsonListItems: [],
            page: 0
        }
        this.toggleAll = this.toggleAll.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
    }

    onSearchClick(){
        const searchInputValue = document.getElementById("searchInput").value;
        console.log(searchInputValue);

        this.setState({page: 0})

        var url = "http://filemasterxp-env.7hpy2sty52.us-east-1.elasticbeanstalk.com/" + "search?nPerPage=20&pageNumber=0&search=" + searchInputValue;

        console.log(url);

        axios.get(url)
        .then(res => {
            console.log('onSearchCLick Axios call Success');
            const jl = res.data;
            const jli = res.data.items;
            this.setState({ jsonList: jl, jsonListItems: jli});
            console.log(this.state.jsonList);
        })
        .catch(error => {
            console.log('onSearchCLick Axios call failed');
            this.setState({ jsonList: [], jsonListItems: []});
        }) 
    }

    //Loads next 20 json elements
    pageForward() {
        console.log("Forward button clicked");
        let page = this.state.page + 1;
        const url = "http://filemasterxp-env.7hpy2sty52.us-east-1.elasticbeanstalk.com/" + "all?nPerPage=20&pageNumber=" + page;
        this.setState({page: page})
        axios.get(url)
        .then(res => {
            console.log('Axios call Success');
            const jl = res.data;
            const jli = res.data.items;
            this.setState({ jsonList: jl, jsonListItems: jli});
            console.log(this.state.page)
        })
        .catch(error => {
            console.log('Axios call failed');
            this.setState({ jsonList: [], jsonListItems: []});
        }) 
    }

    //Loads previous 20 json elements
    pageBack() {
        console.log("Back button clicked");
        let page = this.state.page - (this.state.page > 0);
        const url = "http://filemasterxp-env.7hpy2sty52.us-east-1.elasticbeanstalk.com/" + "all?nPerPage=20&pageNumber=" + page;
        this.setState({page: page})

        axios.get(url)
        .then(res => {
            console.log('Axios call Success');
            const jl = res.data;
            const jli = res.data.items;
            this.setState({ jsonList: jl, jsonListItems:jli});
            console.log(this.state.page)
        })
        .catch(error => {
            console.log('Axios call failed');
        }) 
    }
    
    toggled = true;
    toggleAll(e) {
        e.preventDefault();
        var allInputs = document.getElementsByTagName("input");
        for (var i = 0, max = allInputs.length; i < max; i++) {
            if (allInputs[i].type === 'checkbox')
                allInputs[i].checked = this.toggled;
        }
        this.toggled = !this.toggled;

    }

    downloadSelected(e) {
    e.preventDefault();
    var allSelected = document.getElementsByTagName("input");
    for(var i = 0,max = allSelected.length;i<max;i++){
        if(allSelected[i].type === 'checkbox' && allSelected[i].checked ===true)
            allSelected[i].parentElement.parentElement.childNodes[5].childNodes[0].click()
    }
}
    //Executes the axios command which fetches 50 systems and places it into jsonList
    componentDidMount() {
        axios.get("http://filemasterxp-env.7hpy2sty52.us-east-1.elasticbeanstalk.com/" + "all?nPerPage=20&pageNumber="+this.state.page)
          .then(res => {
            const jl = res.data;
            const jli = res.data.items;
            console.log(this.state.page)
            this.setState({ jsonList: jl, jsonListItems: jli});
            console.log('Axios call Success')
          })
          .catch(error => {
            console.log('Axios call failed');
            this.setState({ jsonList: [], jsonListItems: []});
          })
      }

    //Sets capacity to red
    makeRed(capacity) {
        return (
            <font color = "red">{capacity}</font>
        )
    }

    render() {
        //Headers for the main display table
        const headers = [
            'Serial Number',
            'Date',
            'Company Name',
            'Free Space (%)',
            'Select',
            'Download'
        ];

        const HeaderRow = () => (
            <thead class="thead-dark">
                {headers.map(header => (
                    header === 'Select' ? 
                    <th>{header}</th> : //<input id='select-all' type = "checkbox" onChange={this.checkIfChecked() ? this.selectAll : this.unselectAll} />
                    <th>{header}</th>
                ))}
            </thead>
        );
        
        //Component that defines what each row of the table displays
        const Row = ({serialNumberInserv, date, companyName, capacity, data}) => (
            <tr>
                <td>{serialNumberInserv}</td>
                <td>{date}</td>
                <td>{companyName}</td>
                <td>{capacity}</td>
                <td> <input type = "checkbox" /> </td>
                <td><a href={data} download={serialNumberInserv+".json"}><img src="download icon.png"/></a></td>
            </tr>
        );

        //Component that collects all rows into an array to display in the table
        const Rows = () => {
            const rows = [];

            for (let i = 0; i < this.state.jsonList.length; i++) {
                //Parses JSON object for corresponding data
                const sni = this.state.jsonList[i].serialNumberInserv;
                const d = this.state.jsonList[i].date;
                const cn = this.state.jsonList[i].system.companyName;
                var cp = Math.round(this.state.jsonList[i].capacity.total.freePct * 100) / 100;
                cp = "" + cp;
                if(cp < 30.0) {
                    cp = this.makeRed(cp);
                }
                const obj = this.state.jsonList[i];
                var dat = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

                //Defines a row with the info from the current json object and adds it to the list of rows
                rows.push(<Row serialNumberInserv={sni} date={d} companyName={cn} capacity={cp} data={dat}/>);
            }
            return rows;
        };

    return(
        <div class="container-fluid">
            <link rel="stylesheet" href="style.css" />
            <div class="row align-items-center h-100">
                <div class="col-md-8">
                    <h2>File_MasterXP</h2>
                </div>
            </div>

            <hr/>

            {/* <h5 class="ml-2">{(this.state.page * 20) + 1}-{(Math.floor(this.state.total / 20) === this.state.page) ? this.state.total : this.state.page * 20 + 20} of {this.state.total}</h5> */}

            <SearchBar 
                selectAll={this.selectAll} 
                unselectAll={this.unselectAll}
                onSearchClick={this.onSearchClick}
                downloadSelected={this.downloadSelected}
                toggleAll={this.toggleAll}
            />


            <div> 
                <table class="table table-striped">
                    <HeaderRow />
                    <tbody>
                        <Rows />
                    </tbody> 
                </table>
            </div>
            <br></br>

            <div class = "bottomIcon" align = "center">
                <ul class="pages">
                    <a href="#" class="m-2" onClick={this.pageBack.bind(this)}>Prev</a>
                    {/* <b class="m-2">{this.state.page + 1}</b> */}
                    <a href="#" class="m-2" onClick={this.pageForward.bind(this)}>Next</a>
                </ul>
            </div>
            
        </div>
        );
    }
}

export default MainPage;
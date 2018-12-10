import React, { Component } from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';

var selected_json = []
function downloadAll_array(elem, thing){ //doesn't work
    
    if(thing.checked == true) selected_json.push(elem)
}

class MainPage extends Component {
    //Javascript functions go here:
    constructor(props) {
        super(props);
        this.state = {
            jsonList: [],
            page: 1
        }
        this.selectAll = this.selectAll.bind(this);
        this.unselectAll = this.unselectAll.bind(this);
        this.downloadSelected = this.downloadSelected.bind(this)
    }

    //Loads next 20 json elements
    pageForward() {
        console.log("Forward button clicked");
        const url = "http://filemasterxp-env.7hpy2sty52.us-east-1.elasticbeanstalk.com/all?nPerPage=20&pageNumber=" + (this.state.page);
        var p = this.state.page;
        p = p + 1;
        this.setState({page: p})

        axios.get(url)
        .then(res => {
            console.log('Axios call Success');
            const jl = res.data;
            this.setState({ jsonList: jl });
            console.log(this.state.page)
        })
        .catch(error => {
            console.log('Axios call failed');
        }) 
    }

    //Loads previous 20 json elements
    pageBack() {
        console.log("Back button clicked");
        const url = "http://filemasterxp-env.7hpy2sty52.us-east-1.elasticbeanstalk.com/all?nPerPage=20&pageNumber=" + (this.state.page);
        var p = this.state.page;
        if(p > 0) p = p - 1
        this.setState({page: p})

        axios.get(url)
        .then(res => {
            console.log('Axios call Success');
            const jl = res.data;
            this.setState({ jsonList: jl });
            console.log(this.state.page)
        })
        .catch(error => {
            console.log('Axios call failed');
        }) 
    }
    
    selectAll(e) {
        e.preventDefault();
        var allInputs = document.getElementsByTagName("input");
        for (var i = 0, max = allInputs.length; i < max; i++) {
            if (allInputs[i].type === 'checkbox')
                allInputs[i].checked = true;
        }
    }

unselectAll(e) {
    e.preventDefault();
    var allInputs = document.getElementsByTagName("input");
    for (var i = 0, max = allInputs.length; i < max; i++) {
        if (allInputs[i].type === 'checkbox')
            allInputs[i].checked = false;
}   
}
    downloadSelected(e) {
        e.preventDefault();
        return selected_json
        // what to return in order to show download window?
    
    // e.preventDefault();
    // var allSelected = document.getElementsByTagName("input");
    // for(var i = 0,max = allSelected.length;i<max;i++){
    //     if(allSelected[i].type === 'checkbox' && allSelected[i].checked ===true)
    //     //download
    //}
}

    //Executes the axios command which fetches 50 systems and places it into jsonList
    componentDidMount() {
        axios.get("http://filemasterxp-env.7hpy2sty52.us-east-1.elasticbeanstalk.com/all?nPerPage=20&pageNumber=0")
          .then(res => {
            const jsonList = res.data;
            this.setState({ jsonList });
            console.log('Axios call Success')
          })
          .catch(error => {
            console.log('Axios call failed');
          })
      }

    //   checkIfChecked() {
    //     document.getElementById("select-all")
        
    //   }

    render() {
        //Headers for the main display table
        const headers = [
            'serialNumberInserv',
            'Date(YYYY-MM-DDTHH:mm:ssZ)',
            'authorized tenants',
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
        const Row = ({serialNumberInserv, date, authorizedTenants, data}) => (
            <tr>
                <td>{serialNumberInserv}</td>
                <td>{date}</td>
                <td>{authorizedTenants}</td>
                <td> <input type = "checkbox" value = {serialNumberInserv} onchange={downloadAll_array(data, this)}/> </td>
                <td><a href={data} download={serialNumberInserv+".json"}><img src="download icon.png" /></a></td>
            </tr>
        );

        //Component that collects all rows into an array to display in the table
        const Rows = () => {
            const rows = [];

            for (let i = 0; i < this.state.jsonList.length; i++) {
                //Parses JSON object for corresponding data
                const sni = this.state.jsonList[i].serialNumberInserv;
                const d = this.state.jsonList[i].date;
                const at = this.state.jsonList[i].authorized.tenants;
                const obj = this.state.jsonList[i];
                var dat = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));

                //Defines a row with the info from the current json object and adds it to the list of rows
                rows.push(<Row serialNumberInserv={sni} date={d} authorizedTenants={at} data={dat}/>);
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
                <div class="col-md-4">
                    <button class="btn btn-secondary float-right">Log Out</button>
                </div>
            </div>

            <hr/>

            <SearchBar 
                selectAll={this.selectAll} 
                unselectAll={this.unselectAll}
                downloadSelected={this.downloadSelected}
            />


            <div> 
                <table class="table table-striped">
                    <HeaderRow />
                    <tbody>
                        <Rows />
                    </tbody> 
                </table>
            </div>
            <div class = "bottomIcon" align = "center">
                <ul class="pages">
                    <li><a href="#" onClick={this.onSearchClick.bind(this)}><img src="left icon.png" /></a></li>
                    <li><a href="#" onClick={this.pageBack.bind(this)}>Previous Page</a></li>
                    <li><a href="#" onClick={this.pageForward.bind(this)}>Next Page</a></li>
                    <li><a href="#"><img href ="#" src="right icon.png" /></a></li>
                </ul>
            </div>
        </div>
        );
    }
}

export default MainPage;
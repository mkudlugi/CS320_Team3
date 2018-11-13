import React, { Component } from 'react';
import SearchBar from './SearchBar';
import axios from 'axios';

class MainPage extends Component {
    //Javascript functions go here:
    state = {
        jsonList: []
    }

    componentDidMount() {
        axios.get(`http://filemasterxp-env.7hpy2sty52.us-east-1.elasticbeanstalk.com/oneRand`)
          .then(res => {
            const jsonList = res.data;
            this.setState({ jsonList });
          })
          .catch(error => {
            console.log('Axios call failed');
          })
      }

    render() {
        const headers = [
            'serialNumberInserv',
            'Date(YYY-MM-DDTHH:mm:ssZ)',
            'authorized tenants',
            'Select',
            'Download'
        ];

        const HeaderRow = () => (
            <tr bgcolor ="Silver">
                {headers.map(header => (
                    <th>{header}</th>
                ))}
            </tr>
        );
        
        const Row = ({serialNumberInserv, date, authorizedTenants}) => (
            <tr bgcolor = "Gainsboro">
                <td>{serialNumberInserv}</td>
                <td>{date}</td>
                <td>{authorizedTenants}</td>
                <td> <input type = "checkbox" /> </td>
                <td><img src="download icon.png" /></td>
            </tr>
        );

        const Rows = () => {
            const rows = [];
            console.log(this.state.jsonList.length);
            for (let i = 0; i < this.state.jsonList.length; i++) {
                // When parsing through the data, this is where you would pass in the values to be used in the Row
                rows.push(<Row serialNumberInserv='1' date='2' authorizedTenants='3'/>);
            }
            return rows;
        };

    return(
        <div>
            <link rel="stylesheet" href="style.css" />
            <p >File_MasterXP</p> <button>Log Out</button>
            <hr/>

            <SearchBar />

            <br/>

            <div class = "table"> 
                <table  width="90%" border="1" 
                cellpadding="10"
                align="center">
                    <HeaderRow />
                    <Rows />
                </table>
            </div>
            <div class = "bottomIcon" align = "center">
                <ul>
                    <li><a href="#"><img src="left icon.png" /></a></li>
                    <li><a href="#">Go to First Page</a></li>
                    <li><a href="#">Go to Last page</a></li>
                    <li><a href="#"><img href ="#" src="right icon.png" /></a></li>
                </ul>
            </div>
        </div>
        );
    }
}

export default MainPage;
import React, { Component } from 'react';
import SearchBar from './SearchBar';

class MainPage extends Component {
    //Javascript functions go here:

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
        
        const Row = (val1, val2, val3) => (
            <tr bgcolor = "Gainsboro">
                <td>{'val1'}</td>
                <td>{'val2'}</td>
                <td>{'val3'}</td>
                <td> <input type = "checkbox" /> </td>
                <td><img src="download icon.png" /></td>
            </tr>
        );
        
        // This is the number of rows based on the data returned. This is just a temporary value
        const rowNums = 10;

        const Rows = () => {
            const rows = [];
            for (let i = 0; i < rowNums; i++) {
                // When parsing through the data, this is where you would pass in the values to be used in the Row
                rows.push(<Row />);
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
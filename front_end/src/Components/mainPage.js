import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class mainPage extends Component {
    //Javascript functions go here:

    render() {
        return(
            //HTML goes here. Note that the HTML has to be wrapped in a div tag. 
            <div>
                <head>
                    <link rel="stylesheet" href="style.css" />
                    <p >File_MasterXP</p> <button>Log Out</button>
                    <hr/>
                </head>

            <body>
                <input type="text" placeholder = "Search"/>
                <button >Download Selected</button>
                <button>Select All</button>
                <select>
                    <option>Option</option>
                </select>

                <br/>

                <div class = "table"> 
                    <table  width="90%" border="1" 
                    cellpadding="10"
                    align="center">
                        <tr bgcolor ="Silver">
                            <th>serialNumberInserv</th>
                            <th>Date(YYY-MM-DDTHH:mm:ssZ)</th>
                            <th>authorized tenants</th>
                            <th>Select</th>
                            <th>Download</th>
                        </tr>
                        <tr bgcolor = "Gainsboro">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td> <input type = "checkbox" /> </td>
                            <td><img src="download icon.png" /></td>
                        </tr>
                        <tr bgcolor = "WhiteSmoke">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td> <input type = "checkbox" /> </td>
                            <td><img src="download icon.png" /></td>
                        </tr>
                        <tr bgcolor = "Gainsboro">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td> <input type = "checkbox" /> </td>
                            <td><img src="download icon.png" /></td>
                        </tr>
                        <tr bgcolor = "WhiteSmoke">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td> <input type = "checkbox" /> </td>
                            <td><img src="download icon.png" /></td>
                        </tr>
                        <tr bgcolor = "Gainsboro">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td> <input type = "checkbox" /> </td>
                            <td><img src="download icon.png" /></td>
                        </tr>
                        <tr bgcolor = "WhiteSmoke">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td> <input type = "checkbox" /> </td>
                            <td><img src="download icon.png" /></td>
                        </tr>
                        <tr bgcolor = "Gainsboro">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td> <input type = "checkbox" /> </td>
                            <td><img src="download icon.png" /></td>
                        </tr>
                        <tr bgcolor = "WhiteSmoke">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td> <input type = "checkbox" /> </td>
                            <td><img src="download icon.png" /></td>
                        </tr>
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
            </body>
            <footer>

            </footer>
            </div>
        );
    }

}

export default mainPage;
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from './logo.svg';
import './Assets/Login.css';

//This is the main component that runs the app. 
//We can use this page as a manager of all of our different pages

//Import components here:
import basic_comp from './Components/Basic_Comp';

class App extends Component {
  //Javascript functions go here:

  render() {
    return (
      //HTML goes here
      <html>
      <Router>
        <div>
        <body>
          <div class = "container">
            <div class = "wrapper">
              <div class = "name">
                <h1>File_MasterXP</h1>
              </div>
              <div class = "input1">
                <input type="text" placeholder = "Username" /><br/>
              </div>
              <div class = "input2">
                <input type="text" placeholder = "Password"/><br/>
              </div>
              <div class = "button">
                <p><button> Login</button></p>
              </div>
              <div class ="forgetpassword">
                <p><a href ="#">Forget Password?</a></p>
              </div>
            </div>
            <div class = "footer">
              <hr />
              <p>Github, etc Footer<br/>
              Designed by Scrumbledor's Army<br/>
              Umass 2018</p>
            </div>
          </div>
        </body>
        </div>
      </Router>
      </html>
    );
  }
}
export default App;
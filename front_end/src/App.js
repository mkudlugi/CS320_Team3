import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './Assets/App.css';
import './Assets/Login.css';

//This is the main component that runs the app. 
//We can use this page as a manager of all of our different pages

//Import components here:
import basic_comp from './Components/Basic_Comp';
import MainPage from './Components/mainPage';
import Login from './Login'

class App extends Component {
  //Javascript functions go here:

  render() {
    return (
      //HTML goes here
  
      <Router>
        <div>
        <Route exact path='/' component={MainPage}/> {/*add /mainPage to display this*/}
        <Route exact path='/login' component={Login}/>
        </div>
      </Router>
    );
  }
}

export default App;

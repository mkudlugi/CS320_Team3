import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from './logo.svg';
import './Assets/App.css';

//This is the main component that runs the app. 
//We can use this page as a manager of all of our different pages

//Import components here:
import basic_comp from './Components/Basic_Comp';
import MainPage from './Components/mainPage';

class App extends Component {
  //Javascript functions go here:

  render() {
    return (
      //HTML goes here
  
      <Router>
        <div>
        We can make external components to then add to this page:
        <Route exact path='/' component={basic_comp}/>
        <Route exact path='/' component={basic_comp}/>
        <Route exact path='/mainPage' component={MainPage}/> {/*add /mainPage to display this*/}
        </div>
      </Router>
    );
  }
}

export default App;

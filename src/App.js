import React, { Component } from 'react';
import './App.css';
// import CustomTree from './components/familyNum/familyNum';
import CustomTree from './components/customTree/CustomCanvas';


class App extends Component {
  render() {
    return (
        <CustomTree fit={true}/>
    );
  }
}

export default App;

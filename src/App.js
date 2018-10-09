import React, { Component } from 'react';
import './App.css';
// import CustomTree from './components/familyNum/familyNum';
import CustomTree from './components/sankey/sankey';



class App extends Component {
  render() {
    return (
        <CustomTree fit={false} height={1000}/>
    );
  }
}

export default App;

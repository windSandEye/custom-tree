import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CustomTree from './components/payAbiltyCrowdTree/payAbiltyCrowdTree';


class App extends Component {
  render() {
    const node = {
      desc: '描述',
      count: 1000,
      parentCount: 2000,
      parentDesc:'上一个节点'
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <CustomTree/>
      </div>
    );
  }
}

export default App;

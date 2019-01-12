import React, { Component } from "react";
import "./App.css";
import Content from "./Components/Content";

class App extends Component {
  render() {
    return (
      <div className="App">
      <header className="App-header">
        <img src="Logo.png" className="App-logo" alt="logo" />
      </header>
      <Content />
      </div>
    );
  }
}

export default App;

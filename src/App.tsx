import React, { Component } from "react";
import Content from "./Components/Content";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Content />
          <img src="Logo.png" className="App-logo" alt="logo" />
        </header>
      </div>
    );
  }
}

export default App;

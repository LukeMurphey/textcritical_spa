import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import "./App.css";
import AboutDialog from "./components/AboutDialog";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { modal: null };
  }

  closeModal() {
    this.setState({ modal: null });
  }

  openAboutModal() {
    this.setState({ modal: 'about' });
  }

  render() {
    return (
      <div className="App">
        <h1> Welcome to TextCritical.net</h1>
        <Button onClick={() => this.openAboutModal()}>About</Button>
        {this.state.modal === 'about' && (
          <AboutDialog
            onClose={() => this.closeModal()}
          />
        )}
      </div>
    );
  }
}

export default App;

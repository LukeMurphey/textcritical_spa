import React, { Component } from "react";
import { Button, Menu } from "semantic-ui-react";
import "./App.css";
// import "./semantic_darkly.css";
import AboutDialog from "./components/AboutDialog";
import Reader from "./components/Reader";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { modal: null };
  }

  closeModal() {
    this.setState({ modal: null });
  }

  openAboutModal() {
    this.setState({ modal: "about" });
  }

  render() {
    return (
      <div className="App">
        <Menu attached="top" inverted>
        <Menu.Item style={{backgroundColor: '#1b5de0'}}>
          <img style={{width: 22, height: 22}} src='book_white.png' />
        </Menu.Item>
          <Menu.Item
            name="about"
            active={false}
            content="About"
            onClick={ () => this.openAboutModal() }
          />

          <Menu.Menu position="right">
            <div className="ui right aligned category search item">
              <div className="ui transparent icon input">
                <input
                  className="prompt"
                  type="text"
                  placeholder="Search works..."
                />
                <i className="search link icon" />
              </div>
              <div className="results" />
            </div>
          </Menu.Menu>
        </Menu> 
        {this.state.modal === "about" && (
          <AboutDialog onClose={() => this.closeModal()} />
        )}
        <div style={{marginTop: 16}}/>
        <Reader />
      </div>
    );
  }
}

export default App;

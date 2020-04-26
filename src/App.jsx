import React, { Component } from 'react';
import { Menu, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import AboutDialog from './components/AboutDialog/index';
import Reader from './components/Reader/index';

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
    const { modal } = this.state;
    const { inverted, includeMenu } = this.props;

    return (
      <div>
        { includeMenu && (
          <Menu inverted={!inverted} attached="top">
            <Container>
              <Menu.Item style={{ backgroundColor: '#009ec2' }}>
                <img alt="" style={{ width: 22, height: 22 }} src="book.png" />
              </Menu.Item>
              <Menu.Item
                name="about"
                active={false}
                content="About"
                onClick={() => this.openAboutModal()}
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
            </Container>
          </Menu>
        )}
        {modal === 'about' && (
          <AboutDialog onClose={() => this.closeModal()} />
        )}
        <Container style={{ marginTop: 12 }}>
          <Reader inverted={inverted} />
        </Container>
      </div>
    );
  }
}

App.propTypes = {
  inverted: PropTypes.bool,
  includeMenu: PropTypes.bool,
};

App.defaultProps = {
  inverted: false,
  includeMenu: false,
};

export default App;

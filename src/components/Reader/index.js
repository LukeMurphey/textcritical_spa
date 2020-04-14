import React, { Component } from "react";
import { Button, Input, Icon, Dropdown } from "semantic-ui-react";
import "./index.css";

class Reader extends Component {
  constructor(props) {
    super(props);
    this.state = { modal: null };
  }

  closeModal() {
    this.setState({ modal: null });
  }

  render() {
    return (
      <div>
        <Input action="Go" placeholder="Jump to reference..." />{" "}
        <Button.Group>
          <Button icon>
            <Icon name="folder outline" />
          </Button>
          <Button icon>
            <Icon name="search" />
          </Button>
          <Button icon>
            <Icon name="info" />
          </Button>
        </Button.Group>{" "}
        <Button.Group>
          <Button icon>
            <Icon name="share" />
          </Button>
          <Button icon>
            <Icon name="download" />
          </Button>
        </Button.Group>{" "}
        <div style={{display: 'inline-block', width: 300}}>
        <Dropdown text="Other Versions" fluid button>
          <Dropdown.Menu>
            <Dropdown.Item text="Septuagint (LXX)" description="Greek" />
            <Dropdown.Item
              text="Bible (American Standard Version)"
              description="English"
            />
          </Dropdown.Menu>
        </Dropdown>
        </div>

      </div>
    );
  }
}

export default Reader;

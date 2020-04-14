import React, { Component } from "react";
import { Button, Input, Icon, Dropdown } from "semantic-ui-react";
import "./index.css";

const works = [
  {
    title: "Septuagint (LXX)",
    descriptor: "lxx",
    language: "Greek",
  },
  {
    title: "Bible (American Standard Version)",
    descriptor: "asv",
    language: "English",
  },
];

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
        <div style={{ display: "inline-block", width: 300 }}>
          <Dropdown text="Other Versions" fluid button>
            <Dropdown.Menu>
              {works.map((work) => (
                <Dropdown.Item key={ work.descriptor } text={work.title} description={work.language} />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>
            Work goes here
        </div>
      </div>
    );
  }
}

export default Reader;

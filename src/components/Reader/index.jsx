import React, { Component } from 'react';
import {
  Button, Input, Icon, Dropdown, Dimmer, Loader, Container, Header, Grid,
} from 'semantic-ui-react';
import { ENDPOINT_READ_WORK } from '../Endpoints';
import Chapter from './Chapter';
import './index.css';

class Reader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: null,
      data: null,
    };
  }

  componentDidMount() {
    fetch(ENDPOINT_READ_WORK('new-testament/Matthew/2'))
      .then((res) => res.json())
      .then((data) => {
        this.setState({ data });
      })
      .catch(console.log);
  }

  closeModal() {
    this.setState({ modal: null });
  }

  openWorkInfoModal() {
    this.setState({ modal: 'aboutWork' });
  }

  render() {
    const { modal, data } = this.state;
    return (
      <div>
        <Input
          action={<Button basic>Go</Button>}
          placeholder="Jump to reference..."
        />
        {' '}
        <Button.Group>
          <Button basic icon>
            <Icon name="folder outline" />
          </Button>
          <Button basic icon>
            <Icon name="search" />
          </Button>
          <Button basic icon>
            <Icon name="info" onClick={() => this.openWorkInfoModal()} />
          </Button>
        </Button.Group>
        {' '}
        <Button.Group>
          <Button basic icon>
            <Icon name="share" />
          </Button>
          <Button basic icon>
            <Icon name="download" />
          </Button>
        </Button.Group>
        {' '}
        <div style={{ display: 'inline-block', width: 300 }}>
          <Dropdown basic text="Other Versions" fluid button>
            <Dropdown.Menu>
              {data && data.related_works.map((work) => (
                <Dropdown.Item
                  key={work.title_slug}
                  text={work.title}
                  description={work.language}
                />
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        {modal === 'aboutWork' && <Button onClose={() => this.closeModal()} />}
        {data && (
          <>
            <div style={{ marginTop: 6 }} />
            <Grid>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Header floated="left" as="h3">{data.chapter.full_title}</Header>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Container textAlign="right">
                    <Header floated="right" as="h3">{data.work.title}</Header>
                  </Container>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <div style={{ marginTop: 6 }} />
            <Chapter chapter={data.chapter} content={data.content} work={data.work} />
          </>
        )}
        {!data && (
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        )}

      </div>
    );
  }
}

export default Reader;

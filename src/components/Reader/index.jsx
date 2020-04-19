import React, { Component } from 'react';
import {
  Button, Input, Icon, Dropdown, Container, Header, Grid, Placeholder,
} from 'semantic-ui-react';
import { ENDPOINT_READ_WORK } from '../Endpoints';
import Chapter from './Chapter';
import ErrorMessage from '../ErrorMessage';
import AboutWorkDialog from '../AboutWorkDialog';
import WorkDownloadDialog from '../WorkDownloadDialog';
import './index.css';

class Reader extends Component {
  static convertDivisionsToOptions(divisions) {
    return divisions.map((d) => ({
      key: d.description,
      text: d.full_title,
      value: d.descriptor,
    }));
  }

  /**
   * This function looks for the chapter the user entered. It looks both in the description as well
   * as the key.
   * This is useful because the works often use a Greek name as the description but an English
   * description too and we want both to be searchable (don't want users to have to type Μαρκον).
   * @param {*} options List of dropdown options
   * @param {*} query The string that the user entered that we are searching for
   */
  static workSearch(options, query) {
    return options.filter((opt) => opt.text.includes(query) || opt.key.includes(query));
  }

  constructor(props) {
    super(props);
    this.state = {
      modal: null,
      data: null,
      error: null,
    };
  }

  componentDidMount() {
    this.loadChapter('new-testament', 'matthew', '2');
  }

  /**
   * Load the given chapter.
   *
   * @param {string} work The work to load
   * @param {...any} divisions The list of division indicators
   */
  loadChapter(work, ...divisions) {
    const divisionReference = divisions.join('/');

    fetch(ENDPOINT_READ_WORK(`${work}/${divisionReference}`))
      .then((res) => res.json())
      .then((data) => {
        this.setState({ data });
      })
      .catch((e) => {
        this.setState({
          error: e.toString(),
        });
      });
  }

  closeModal() {
    this.setState({ modal: null });
  }

  openWorkInfoModal() {
    this.setState({ modal: 'aboutWork' });
  }

  openDownloadModal() {
    this.setState({ modal: 'downloadWork' });
  }

  changeWork() {
    this.setState({ modal: 'aboutWork' });
  }

  changeChapter(event, info) {
    const { data } = this.state;
    this.loadChapter(data.work.title_slug, info.value);
  }

  render() {
    const { modal, data, error } = this.state;
    let description = '';

    if (data) {
      description = data.chapter.description;
    }

    return (
      <div>
        <Input
          action={<Button basic>Go</Button>}
          placeholder="Jump to reference..."
          defaultValue={description}
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
            <Icon name="download" onClick={() => this.openDownloadModal()} />
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
        {data && modal === 'aboutWork' && <AboutWorkDialog work={data.work.title_slug} onClose={() => this.closeModal()} />}
        {data && modal === 'downloadWork' && <WorkDownloadDialog work={data.work.title_slug} onClose={() => this.closeModal()} />}
        {data && (
          <>
            <div style={{ marginTop: 6 }} />
            <Grid>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Header floated="left" as="h3">
                    {data.chapter.parent_division && (
                      <>
                        <Dropdown
                          inline
                          floating
                          deburr
                          scrolling
                          search={Reader.workSearch}
                          options={Reader.convertDivisionsToOptions(data.divisions)}
                          defaultValue={data.chapter.parent_division.descriptor}
                          onChange={(event, info) => this.changeChapter(event, info)}
                        />
                        <div style={{ display: 'inline-block', paddingLeft: 6 }}>
                          {data.chapter.type}
                          {` ${data.chapter.descriptor}`}
                        </div>
                      </>
                    )}
                  </Header>
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
        {error && (
          <ErrorMessage title="Unable to load the content" description="The given chapter could not be loaded from the server" message={error} />
        )}
        {!data && !error && (
          <Placeholder style={{ marginTop: 32 }}>
            <Placeholder.Header>
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        )}

      </div>
    );
  }
}

export default Reader;

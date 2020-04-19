import React, { Component } from 'react';
import {
  Button, Input, Icon, Dropdown, Container, Header, Grid, Placeholder, Loader, Dimmer, Segment, Message,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { ENDPOINT_READ_WORK, ENDPOINT_RESOLVE_REFERENCE } from '../Endpoints';
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
   * @param {array} options List of dropdown options
   * @param {string} query The string that the user entered that we are searching for
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
      loading: false,
      divisions: null,
      loadedWork: null,
      referenceValid: true,
      referenceValue: '',
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
    this.setState({ loading: true });

    fetch(ENDPOINT_READ_WORK(`${work}/${divisionReference}`))
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          data,
          loading: false,
          loadedWork: work,
          divisions,
          referenceValue: data.chapter.description,
        });
      })
      .catch((e) => {
        this.setState({
          error: e.toString(),
        });
      });
  }

  /**
   * Close any open modal.
   */
  closeModal() {
    this.setState({ modal: null });
  }

  /**
   * Open the info modal.
   */
  openWorkInfoModal() {
    this.setState({ modal: 'aboutWork' });
  }

  /**
   * Open the modal for downloading a work.
   */
  openDownloadModal() {
    this.setState({ modal: 'downloadWork' });
  }

  /**
   * Change the work to another related work.
   *
   * @param {*} event React's original SyntheticEvent.
   * @param {*} info All props.
   */
  changeWork(work) {
    const { referenceValue } = this.state;
    debugger;
    this.loadChapter(work, referenceValue);
  }

  /**
   * Handle the selection of the division.
   *
   * @param {*} event React's original SyntheticEvent.
   * @param {*} info All props.
   */
  changeChapter(event, info) {
    const { data } = this.state;
    this.loadChapter(data.work.title_slug, info.value);
  }

  /**
   * Handle a change in the reference input.
   *
   * @param {*} event React's original SyntheticEvent.
   * @param {*} info All props.
   */
  changeReference(event, info) {
    const { data } = this.state;
    fetch(ENDPOINT_RESOLVE_REFERENCE(data.work.title_slug, info.value))
      .then((res) => (Promise.all([res.status, res.json()])))
      .then(([status, referenceInfo]) => {
        if (status === 200) {
          this.setState({
            divisions: referenceInfo.divisions,
            referenceValue: info.value,
            referenceValid: true,
          });
        } else {
          this.setState({
            referenceValue: info.value,
            referenceValid: false,
          });
        }
      })
      .catch((e) => {
        this.setState({
          error: e.toString(),
        });
      });
  }

  /**
   * Go to the reference defiend in the input box.
   */
  goToReference() {
    const { divisions, loadedWork } = this.state;
    this.loadChapter(loadedWork, ...divisions);
  }

  render() {
    const {
      modal, data, error, loading, referenceValid, referenceValue,
    } = this.state;

    const { inverted } = this.props;

    // Figure out a description for the chapter
    let description = '';
    let referenceDescription = referenceValue;

    if (data) {
      description = data.chapter.description;

      if (referenceValue === '') {
        referenceDescription = description;
      }
    }

    return (
      <Segment inverted={inverted} basic>
        <Input
          inverted={inverted}
          action={<Button onClick={() => this.goToReference()} basic>Go</Button>}
          placeholder="Jump to reference..."
          value={referenceDescription}
          error={!referenceValid}
          onChange={(e, d) => this.changeReference(e, d)}
        />
        {' '}
        <Button.Group>
          <Button inverted={inverted} basic icon>
            <Icon name="folder outline" />
          </Button>
          <Button inverted={inverted} basic icon>
            <Icon name="search" />
          </Button>
          <Button inverted={inverted} basic icon>
            <Icon name="info" onClick={() => this.openWorkInfoModal()} />
          </Button>
        </Button.Group>
        {' '}
        <Button.Group>
          <Button inverted={inverted} basic icon>
            <Icon name="share" />
          </Button>
          <Button inverted={inverted} basic icon>
            <Icon name="download" onClick={() => this.openDownloadModal()} />
          </Button>
        </Button.Group>
        {' '}
        <div style={{ display: 'inline-block', width: 300 }}>
          <Dropdown
            basic
            text="Other Versions"
            fluid
            button
          >
            <Dropdown.Menu>
              {data && data.related_works.map((work) => (
                <Dropdown.Item
                  key={work.title_slug}
                  text={work.title}
                  description={work.language}
                  onClick={() => this.changeWork(work.title_slug)}
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
                          value={data.chapter.parent_division.descriptor}
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
            <Segment inverted={inverted} basic>
              {loading && (
                <Dimmer active>
                  <Loader inverted={inverted} />
                </Dimmer>
              )}
              {data && data.warnings.map((warning) => (
                <Message
                  warning
                  key={warning[0]}
                  header={warning[0]}
                  content={warning[1]}
                />
              ))}

              <Chapter chapter={data.chapter} content={data.content} work={data.work} />
            </Segment>
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

      </Segment>
    );
  }
}

Reader.propTypes = {
  inverted: PropTypes.bool,
};

Reader.defaultProps = {
  inverted: true,
};

export default Reader;

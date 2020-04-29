import React, { Component } from 'react';
import {
  Button, Input, Icon, Dropdown, Container, Header, Grid, Placeholder, Segment,
  Message, Menu, Popup,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { ENDPOINT_READ_WORK, ENDPOINT_RESOLVE_REFERENCE } from '../Endpoints';
import Chapter from './Chapter';
import ErrorMessage from '../ErrorMessage';
import AboutWorkDialog from '../AboutWorkDialog';
import WorkDownloadDialog from '../WorkDownloadDialog';
import WordInformation from '../WordInformation/WordInformationPopup';
import BookSelection from '../BookSelection';
import './index.css';

const NextPageStyle = {
  bottom: '20px',
  right: '10px',
  position: 'fixed',
};

const PriorPageStyle = {
  bottom: '20px',
  left: '10px',
  position: 'fixed',
};

const ToolbarBarStyle = {
  marginTop: 0,
  marginBottom: 0,
  paddingTop: 0,
  paddingBottom: 0,
};

class Reader extends Component {
  /**
   * Convert the list of divisions to options that can be processed by the dropdown menu.
   *
   * @param {array} divisions The list of divisions.
   */
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
    const queryLower = query.toLowerCase();
    return options.filter((opt) => (
      opt.text.toLowerCase().includes(queryLower)
      || opt.key.toLowerCase().includes(queryLower)
    ));
  }

  /**
   * Get a placeholder for the content.
   */
  static getPlaceholder() {
    return (
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
    );
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
      selectedWord: null,
      popupX: null,
      popupY: null,
    };
  }

  componentDidMount() {
    this.loadChapter('new-testament', 'John', '1');
  }

  onVerseClick(verseDescriptor, verse, id, href, x, y) {
    this.setState({
      referenceValue: verseDescriptor,
    });
  }

  onWordClick(word, x, y, positionRight, positionBelow) {
    this.setState({
      selectedWord: word,
      modal: 'word',
      popupX: x,
      popupY: y,
      popupPositionRight: positionRight,
      popupPositionBelow: positionBelow,
    });
  }

  onSelectWork(work) {
    this.loadChapter(work);
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
          modal: null,
          error: null,
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
    const { divisions } = this.state;
    this.loadChapter(work, ...divisions);
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
    const { divisions, loadedWork, referenceValid } = this.state;

    if (referenceValid) {
      this.loadChapter(loadedWork, ...divisions);
    }
  }

  /**
   * Go to the next chapter.
   */
  goToNextChapter() {
    const { data } = this.state;
    if (data.next_chapter) {
      this.loadChapter(data.work.title_slug, data.next_chapter.full_descriptor);
    }
  }

  /**
   * Go to the prior chapter.
   */
  goToPriorChapter() {
    const { data } = this.state;
    if (data.previous_chapter) {
      this.loadChapter(data.work.title_slug, data.previous_chapter.full_descriptor);
    }
  }

  render() {
    const {
      modal, data, error, loading, referenceValid, referenceValue, selectedWord, popupX, popupY,
      popupPositionRight, popupPositionBelow,
    } = this.state;

    const { inverted } = this.props;

    const onVerseClick = (verseDescriptor, verse, id, href, x, y) => {
      this.onVerseClick(verseDescriptor, verse, id, href, x, y);
    };

    const onWordClick = (word, x, y, positionRight, positionBelow) => {
      this.onWordClick(word, x, y, positionRight, positionBelow);
    };

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
      <>
        <Segment style={ToolbarBarStyle} inverted={inverted} basic>
          <Menu inverted={inverted} text>
            <Input
              inverted={inverted}
              action={
                (
                  <Button
                    disabled={!referenceValid}
                    onClick={() => this.goToReference()}
                    basic
                  >
                    Go
                  </Button>
                )
              }
              placeholder="Jump to reference..."
              value={referenceDescription}
              error={!referenceValid}
              onChange={(e, d) => this.changeReference(e, d)}
            />
            {' '}
            <Button.Group>
              <Popup
                content={<BookSelection onSelectWork={(work) => this.onSelectWork(work)} />}
                on="click"
                position="bottom left"
                pinned
                trigger={(
                  <Button inverted={inverted} basic icon>
                    <Icon name="book" />
                  </Button>
                )}
              />
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
                disabled={!referenceValid}
                style={{ marginTop: 2 }}
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
            <div style={{ float: 'right', marginLeft: 'auto', marginTop: 11 }}>
              <Dropdown icon="ellipsis vertical">
                <Dropdown.Menu>
                  <Dropdown.Item text="About TextCritical.net" />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Menu>
        </Segment>
        {data && !loading && (
          <Segment style={{ marginTop: 0, paddingTop: 0 }} inverted={inverted} basic>
            {data && !loading && modal === 'aboutWork' && <AboutWorkDialog work={data.work.title_slug} onClose={() => this.closeModal()} />}
            {data && !loading && modal === 'downloadWork' && <WorkDownloadDialog work={data.work.title_slug} onClose={() => this.closeModal()} />}
            {data && !loading && modal === 'word' && <WordInformation positionBelow={popupPositionBelow} positionRight={popupPositionRight} x={popupX} y={popupY} word={selectedWord} onClose={() => this.closeModal()} />}
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
            {data && data.warnings.map((warning) => (
              <Message
                warning
                key={warning[0]}
                header={warning[0]}
                content={warning[1]}
              />
            ))}
            <Chapter
              chapter={data.chapter}
              content={data.content}
              work={data.work}
              onVerseClick={onVerseClick}
              onWordClick={onWordClick}
              onClickAway={() => this.closeModal()}
            />
            <Button
              icon
              style={PriorPageStyle}
              disabled={data.previous_chapter === null}
              onClick={() => this.goToPriorChapter()}
            >
              <Icon name="left chevron" />
            </Button>
            <Button
              icon
              style={NextPageStyle}
              disabled={data.next_chapter === null}
              onClick={() => this.goToNextChapter()}
            >
              <Icon name="right chevron" />
            </Button>
          </Segment>
        )}
        {error && (
          <ErrorMessage title="Unable to load the content" description="The given chapter could not be loaded from the server" message={error} />
        )}
        {loading && !error && (
          Reader.getPlaceholder()
        )}
      </>
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

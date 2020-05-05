import React, { Component } from 'react';
import {
  Button, Input, Icon, Dropdown, Container, Header, Grid, Placeholder, Segment,
  Message, Menu, Popup, Sidebar, Image,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { ENDPOINT_READ_WORK, ENDPOINT_RESOLVE_REFERENCE, ENDPOINT_WORK_IMAGE } from '../Endpoints';
import Chapter from './Chapter';
import ErrorMessage from '../ErrorMessage';
import AboutWorkDialog from '../AboutWorkDialog';
import WorkDownloadDialog from '../WorkDownloadDialog';
import WordInformation from '../WordInformation/WordInformationPopup';
import FootnotePopup from '../FootnotePopup';
import BookSelection from '../BookSelection';
import history from '../../history';
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

const ContainerStyle = {
  marginTop: 0,
  paddingTop: 56,
};

const MenuStyle = {
  paddingTop: 4,
  paddingBottom: 4,
  borderBottom: '1px solid #e2e2e2',
  backgroundColor: 'white',
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
      errorTitle: null,
      errorMessage: null,
      errorDescription: null,
      loading: false,
      divisions: null,
      loadedWork: null,
      referenceValid: true,
      referenceValue: '',
      selectedWord: null,
      popupX: null,
      popupY: null,
      redirected: false,
    };
  }

  componentDidMount() {
    const {
      defaultWork,
      division0,
      division1,
      division2,
      division3,
      division4,
      leftovers,
    } = this.props;

    const divisions = [
      division0,
      division1,
      division2,
      division3,
      division4,
      leftovers,
    ].filter((entry) => entry);

    if (defaultWork) {
      this.loadChapter(defaultWork, ...divisions);
    } else {
      this.loadChapter('new-testament', 'John', '1');
    }
  }

  /**
   * Handle the clicking of a verse.
   *
   * @param {string} verseDescriptor The descriptor that can be used to recognize a verse
   * @param {string} verse The verse number
   * @param {string} id An ID that designates the verse
   * @param {string} href A href for the verse
   * @param {int} x The x coordinate of the verse marker
   * @param {int} y The y coordinate of the verse marker
   */
  onVerseClick(verseDescriptor, verse, id, href) {
    this.setState({
      referenceValue: verseDescriptor,
    });

    history.push(href);
  }

  /**
   * Handle the clicking of a word.
   *
   * @param {string} word The word to get information on
   * @param {int} x The x coordinate designating where to show the popup
   * @param {int} y The y coordinate designating where to show the popup
   * @param {bool} positionRight Indicates it is best to show the popup to the right of the offset
   * @param {bool} positionBelow Indicates it is best to show the popup below the offset
   */
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

  /**
   * Handle the clicking of a note.
   *
   * @param {string} note The note's contents
   * @param {string} id The ID of the note
   * @param {int} x The x coordinate designating where to show the popup
   * @param {int} y The y coordinate designating where to show the popup
   * @param {bool} positionRight Indicates it is best to show the popup to the right of the offset
   * @param {bool} positionBelow Indicates it is best to show the popup below the offset
   */
  onNoteClick(note, id, x, y, positionRight, positionBelow) {
    this.setState({
      selectedNote: note,
      modal: 'note',
      popupX: x,
      popupY: y,
      popupPositionRight: positionRight,
      popupPositionBelow: positionBelow,
    });
  }

  /**
   * Handle the selection of a work.
   * @param {string} work the title slug of a work to load
   */
  onSelectWork(work) {
    this.loadChapter(work);
  }

  /**
   * Open or close the book selection dialog.
   * @param {bool} open Whether the dialog for selecting a book ought to be open.
   */
  setBookSelectionOpen(open = true) {
    this.setState({
      bookSelectionOpen: open,
    });
  }

  /**
   * Set an error state.
   *
   * @param {string} errorTitle The title
   * @param {string} errorDescription The description
   * @param {string} errorMessage The detailed error message (like from an AJAX call)
   */
  setErrorState(errorTitle, errorDescription = '', errorMessage = null) {
    this.setState({
      errorMessage,
      errorDescription,
      errorTitle,
    });
  }

  /**
   * Load the given chapter.
   *
   * @param {string} work The work to load
   * @param {array} divisions The list of division indicators
   */
  loadChapter(work, ...divisions) {
    let divisionReference = '';
    if (divisions) {
      divisionReference = divisions.join('/');
    }

    history.push(`/work/${work}/${divisionReference}`);

    this.setState({
      loading: true,
      bookSelectionOpen: false,
      modal: null,
      errorTitle: null,
      errorMessage: null,
      errorDescription: null,
      redirected: false,
    });

    fetch(ENDPOINT_READ_WORK(`${work}/${divisionReference}`))
      .then((res) => (Promise.all([res.status, res.json()])))
      .then(([status, data]) => {
        if (status === 200) {
          let redirected = false;
          // If the work alias didn't match, then update the URL accordingly
          if (data.work.title_slug !== work) {
            redirected = true;
            history.push(`/work/${data.work.title_slug}/${divisionReference}`);
          }

          this.setState({
            data,
            loading: false,
            loadedWork: work,
            divisions,
            referenceValue: data.chapter.description,
            redirected,
          });
        } else {
          this.setErrorState(
            'Work could not be found',
            'Yikes. The given work is not recognized as a valid work.',
          );
        }
      })
      .catch((e) => {
        this.setErrorState(
          'Unable to load the content',
          'The given chapter could not be loaded from the server',
          e.toString(),
        );
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
        this.setErrorState(
          'Unable to load the content',
          'The given chapter could not be loaded from the server',
          e.toString(),
        );
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
      modal, data, errorDescription, loading, referenceValid, referenceValue, selectedWord,
      popupX, popupY, popupPositionRight, popupPositionBelow, bookSelectionOpen, errorTitle,
      errorMessage, selectedNote, redirected,
    } = this.state;

    const { inverted } = this.props;

    const onVerseClick = (verseDescriptor, verse, id, href, x, y) => {
      this.onVerseClick(verseDescriptor, verse, id, href, x, y);
    };

    const onWordClick = (word, x, y, positionRight, positionBelow) => {
      this.onWordClick(word, x, y, positionRight, positionBelow);
    };

    const onNoteClick = (word, x, y, positionRight, positionBelow) => {
      this.onNoteClick(word, x, y, positionRight, positionBelow);
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
        <Menu text inverted={inverted} fixed="top" style={MenuStyle}>
          <Button.Group>
            <Button inverted={inverted} basic icon>
              <Icon name="bars" />
            </Button>
          </Button.Group>
          <Container>
            <Button.Group>
              <Popup
                content={<BookSelection onSelectWork={(work) => this.onSelectWork(work)} />}
                on="click"
                position="bottom left"
                pinned
                onClose={() => this.setBookSelectionOpen(false)}
                onOpen={() => this.setBookSelectionOpen(true)}
                open={bookSelectionOpen}
                trigger={(
                  <Button inverted={inverted} basic>
                    <Icon name="book" />
                  </Button>
                )}
              />
            </Button.Group>
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
            <div style={{ display: 'inline-block', width: 300 }}>
              <Dropdown
                basic
                text="Other Versions"
                fluid
                button
                inverted={inverted}
                disabled={!referenceValid || !data || data.related_works.length === 0}
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
          </Container>
        </Menu>
        {data && !loading && (
          <Sidebar.Pushable as={Segment} style={{ marginTop: 48, borderLeft: 0 }}>
            <Sidebar
              as={Menu}
              animation="overlay"
              icon="labeled"
              style={{ width: 200 }}
              inverted
              visible
              vertical
              width="thin"
            >
              <Image src={ENDPOINT_WORK_IMAGE(data.work.title_slug, 200)} />
              <Menu.Item as="a" onClick={() => this.openWorkInfoModal()} style={{ textAlign: 'left' }}>
                Information
              </Menu.Item>
              <Menu.Item as="a" onClick={() => this.openDownloadModal()} style={{ textAlign: 'left' }}>
                Download
              </Menu.Item>
              <Menu.Item as="a" style={{ textAlign: 'left' }}>
                Share
              </Menu.Item>
              <Menu.Item as="a" style={{ textAlign: 'left' }}>
                Search
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher>
              <Container style={ContainerStyle} inverted={inverted} basic>
                {data && !loading && modal === 'aboutWork' && <AboutWorkDialog work={data.work.title_slug} onClose={() => this.closeModal()} />}
                {data && !loading && modal === 'downloadWork' && <WorkDownloadDialog work={data.work.title_slug} onClose={() => this.closeModal()} />}
                {data && !loading && modal === 'word' && <WordInformation positionBelow={popupPositionBelow} positionRight={popupPositionRight} x={popupX} y={popupY} word={selectedWord} onClose={() => this.closeModal()} />}
                {data && !loading && modal === 'note' && <FootnotePopup positionBelow={popupPositionBelow} positionRight={popupPositionRight} x={popupX} y={popupY} note={selectedNote} onClose={() => this.closeModal()} />}
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
                {redirected && (
                <Message info>
                  <p>
                    The URL you were using was old so you were redirected to the new one. You may want
                    to update your shortcuts.
                  </p>
                </Message>
                )}
                <Chapter
                  chapter={data.chapter}
                  content={data.content}
                  work={data.work}
                  onVerseClick={onVerseClick}
                  onWordClick={onWordClick}
                  onNoteClick={onNoteClick}
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
              </Container>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        )}
        {errorTitle && (
          <ErrorMessage title={errorTitle} description={errorDescription} message={errorMessage} />
        )}
        {loading && !errorTitle && (
          <Container style={ContainerStyle} inverted={inverted} basic>
            {Reader.getPlaceholder()}
          </Container>
        )}
      </>
    );
  }
}

Reader.propTypes = {
  inverted: PropTypes.bool,
  defaultWork: PropTypes.string,
  division0: PropTypes.string,
  division1: PropTypes.string,
  division2: PropTypes.string,
  division3: PropTypes.string,
  division4: PropTypes.string,
  leftovers: PropTypes.string,
};

Reader.defaultProps = {
  inverted: true,
  defaultWork: null,
  division0: null,
  division1: null,
  division2: null,
  division3: null,
  division4: null,
  leftovers: null,
};

export default Reader;

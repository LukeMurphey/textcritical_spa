import React, { Component } from 'react';
import {
  Header, Modal, Button, Placeholder,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { ENDPOINT_WORD_PARSE } from '../Endpoints';
import ErrorMessage from '../ErrorMessage';

class WordInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      wordInfo: null,
      error: null,
    };
  }

  componentDidMount() {
    const { word } = this.props;
    this.getWordInfo(word);
  }

  /**
   * Get information for the given word.
   *
   * @param {string} word The word to get information on
   */
  getWordInfo(word) {
    this.setState({ loading: true });

    fetch(ENDPOINT_WORD_PARSE(word))
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          wordInfo: data,
          loading: false,
          error: null,
        });
      })
      .catch((e) => {
        this.setState({
          error: e.toString(),
        });
      });
  }

  render() {
    const { word, onClose } = this.props;
    const { wordInfo, loading, error } = this.state;
    return (
      <Modal defaultOpen onClose={onClose}>
        <Modal.Header>{word}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>
              Information on
              {word}
            </Header>
            {!loading && wordInfo && (
              <div>
                {word}
              </div>
            )}
            {!loading && error && (
              <div>
                <ErrorMessage title="Unable to get word information" description="Information for the given word could not be obtained." message={error} />
              </div>
            )}
            {loading && (
              <Placeholder style={{ marginTop: 32 }}>
                <Placeholder.Header>
                  <Placeholder.Line />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                  <Placeholder.Line />
                </Placeholder.Paragraph>
              </Placeholder>
            )}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

WordInformation.propTypes = {
  word: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WordInformation;

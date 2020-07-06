import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { Container, Form, TextArea, Segment, Button } from 'semantic-ui-react';
import { withRouter } from "react-router-dom";
import { ENDPOINT_CONVERT_BETA_CODE_QUERY } from '../Endpoints';
import { READ_WORK } from '../URLs';
import FullscreenDialog from '../FullscreenDialog';

const BetaCodeConverter = ({ inverted, history }) => {
  const [originalText, setOriginalText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onClickBack = () => {
    history.push(READ_WORK());
  };

  const getWordInfo = () => {
    setLoading(true);

    fetch(ENDPOINT_CONVERT_BETA_CODE_QUERY(originalText))
      .then((res) => res.json())
      .then((data) => {
        setConvertedText(data);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }

  return (
    <FullscreenDialog inverted={inverted} onClickBack={onClickBack} backTitle="Back to the Library">
      <Container>
        <Segment inverted={inverted}>
          <Form>
            <TextArea placeholder='Enter beta-code here' value={originalText} onChange={(event, data) => setOriginalText(data.value)} />
            <Segment inverted={inverted}>{convertedText}</Segment>
            <Button primary onClick={getWordInfo}>Primary</Button>
          </Form>
        </Segment>
      </Container>
    </FullscreenDialog>
  );
};

BetaCodeConverter.propTypes = {
  inverted: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

BetaCodeConverter.defaultProps = {
  inverted: false,
};

export default withRouter(BetaCodeConverter);

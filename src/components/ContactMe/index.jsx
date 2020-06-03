import React from 'react';
import {
  Header, Segment, Container,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { READ_WORK } from '../URLs';
import FullscreenDialog from '../FullscreenDialog';

const ContactMe = ({ inverted, history }) => {
  const onClickBack = () => {
    history.push(READ_WORK());
  };

  return (
    <FullscreenDialog inverted={inverted} onClickBack={onClickBack} backTitle="Back to the Library">
      <Container>
        <Segment inverted={inverted}>
          <Header as="h1">Getting in Touch</Header>
          If you found something that does not work, please
          {' '}
          <a href="https://github.com/LukeMurphey/textcritical_net/issues">create an issue</a>
          .
        </Segment>
      </Container>
    </FullscreenDialog>
  );
};

ContactMe.propTypes = {
  inverted: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

ContactMe.defaultProps = {
  inverted: false,
};

export default withRouter(ContactMe);

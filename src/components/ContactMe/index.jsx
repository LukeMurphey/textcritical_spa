import React from 'react';
import {
  Header, Segment, Container,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const ContactMe = ({ inverted }) => (
  <Container style={{ paddingTop: 32 }}>
    <Segment inverted={inverted}>
      <Header as="h1">Getting in Touch</Header>
      If you found something that does not work, please
      {' '}
      <a href="https://github.com/LukeMurphey/textcritical_net/issues">create an issue</a>
      .
    </Segment>
  </Container>
);

ContactMe.propTypes = {
  inverted: PropTypes.bool,
};

ContactMe.defaultProps = {
  inverted: false,
};

export default ContactMe;

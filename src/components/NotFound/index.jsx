import React from 'react';
import {
  Header, Segment, Container, Button,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const NotFound = ({ inverted }) => (
  <Container style={{ marginTop: 32 }}>
    <Segment inverted={inverted} color="red">
      <Header as="h1">Page Not Found</Header>
      I cannot seem to find the page you are looking for.
      Your best bet is probably just to head up to the
      {' '}
      <a href="/">homepage</a>
      <div style={{ marginTop: 16 }}>
        <Button onClick={() => { window.location = '/'; }}>Take me to the homepage</Button>
      </div>
    </Segment>
  </Container>
);

NotFound.propTypes = {
  inverted: PropTypes.bool,
};

NotFound.defaultProps = {
  inverted: false,
};

export default NotFound;

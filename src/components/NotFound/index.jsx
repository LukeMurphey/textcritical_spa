import React from 'react';
import {
  Header, Segment, Container, Button,
} from 'semantic-ui-react';

const NotFound = () => (
  <Container style={{ marginTop: 32 }}>
    <Segment color="red">
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

export default NotFound;

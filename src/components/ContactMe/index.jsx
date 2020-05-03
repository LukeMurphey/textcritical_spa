import React from 'react';
import {
  Header, Segment, Container,
} from 'semantic-ui-react';

const ContactMe = () => (
  <Container style={{ marginTop: 32 }}>
    <Segment>
      <Header as="h1">Getting in Touch</Header>
      If you found something that does not work, please
      {' '}
      <a href="https://github.com/LukeMurphey/textcritical_net/issues">create an issue</a>
      .
    </Segment>
  </Container>
);

export default ContactMe;

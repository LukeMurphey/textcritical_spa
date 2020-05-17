import React from 'react';
import {
  Header, Segment, Container,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const About = ({ inverted }) => (
  <Container style={{ marginTop: 32 }}>
    <Segment inverted={inverted}>
      <Header as="h1">About TextCritical.net</Header>
      TextCritical.net is a website that provides ancient Greek texts and useful analysis tools.
      <Header as="h2">Source Code</Header>
      This site is open source. See
      {' '}
      <a target="blank" href="https://lukemurphey.net/projects/ancient-text-reader/">LukeMurphey.net</a>
      for information regarding how to get access to the source code and how to set up your
      own instance of the site for development purposes.

    </Segment>
  </Container>
);

About.propTypes = {
  inverted: PropTypes.bool,
};

About.defaultProps = {
  inverted: false,
};


export default About;

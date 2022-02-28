import React from 'react';
import {
  Header, Segment, Container,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { READ_WORK } from '../URLs';
import FullscreenDialog from '../FullscreenDialog';

const About = ({ inverted, history }) => {
  const onClickBack = () => {
    history.push(READ_WORK());
  };  

  return (
    <FullscreenDialog inverted={inverted} onClickBack={onClickBack} backTitle="Back to the Library">
      <Container>
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
    </FullscreenDialog>
  );
};

About.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  inverted: PropTypes.bool,
};

About.defaultProps = {
  inverted: false,
};

About.defaultProps = {
  inverted: false,
};

export default withRouter(About);

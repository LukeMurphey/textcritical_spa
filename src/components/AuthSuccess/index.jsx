import React from 'react';
import { Header, Segment, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const AuthSuccess = ({inverted}) => (
  <Segment inverted={inverted} style={{padding: 48}}>
      <Header as='h3'>Authentication Complete</Header>
      <Icon name='check' color='green' size='large' />
      You have completed the login process. You can close this window.
  </Segment>
);

AuthSuccess.propTypes = {
  inverted: PropTypes.bool.isRequired
}

export default AuthSuccess;

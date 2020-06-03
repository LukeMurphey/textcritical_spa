import React from 'react';
import {
  Segment, Icon, Header, Divider, Container,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

const BackButtonStyle = {
  display: 'inline-block',
  fontSize: 16,
  textAlign: 'middle',
};

const BackLinkStyle = {
  cursor: 'pointer',
  marginBottom: 0,
};

const TitleStyle = {
  display: 'inline-block',
  fontSize: 12,
  verticalAlign: 'top',
  paddingLeft: 12,
  color: 'white',
};

const ContentStyle = {
  marginTop: 0,
};

const FullscreenDialog = ({
  children, onClickBack, inverted, backTitle,
}) => (
  <Container>
    <Segment compact style={BackLinkStyle} onClick={onClickBack} inverted={inverted}>
      <div style={BackButtonStyle}>
        <Icon name="arrow left" corner="top left" fitted />
      </div>
      <div style={TitleStyle}>
        <Header inverted={inverted} as="h4">{backTitle}</Header>
      </div>
    </Segment>
    <Divider style={{ marginTop: 0 }} />
    <Segment compact style={ContentStyle} inverted={inverted}>
      {children}
    </Segment>
  </Container>
);

FullscreenDialog.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.object.isRequired,
  inverted: PropTypes.bool,
  onClickBack: PropTypes.func,
  backTitle: PropTypes.string,
};

FullscreenDialog.defaultProps = {
  inverted: false,
  onClickBack: () => {},
  backTitle: 'Back',
};

export default FullscreenDialog;

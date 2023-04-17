import React from 'react';
import {
  Segment, Container,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { READ_WORK } from '../URLs';
import FullscreenDialog from '../FullscreenDialog';
import UserNotesTable from '../UserNotesTable';

const UserNotes = ({ inverted, history }) => {
  const onClickBack = () => {
    history.push(READ_WORK());
  };

  return (
    <FullscreenDialog inverted={inverted} onClickBack={onClickBack} backTitle="Back to the Library">
      <Container>
        <Segment inverted={inverted}>
          <UserNotesTable inverted={inverted} />
        </Segment>
      </Container>
    </FullscreenDialog>
  );
};

UserNotes.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  inverted: PropTypes.bool,
};

UserNotes.defaultProps = {
  inverted: false,
};

UserNotes.defaultProps = {
  inverted: false,
};

export default withRouter(UserNotes);

import React, { useState, useEffect} from "react";
import { Segment, Container } from "semantic-ui-react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { READ_WORK } from "../URLs";
import FullscreenDialog from "../FullscreenDialog";
import UserNotesTable from "../UserNotesTable";
import UserNoteEditor from "../UserNoteDialog/UserNoteEditor";
import { ENDPOINT_NOTES } from "../Endpoints";

const UserNotes = ({ inverted, history }) => {
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  
  const onClickBack = () => {
    history.push(READ_WORK());
  };

  const getNotes = () => {
    setIsLoading(true);
    fetch(ENDPOINT_NOTES())
      .then((res) => res.json())
      .then((newData) => {
        setNotes(newData);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e.toString());
        setIsLoading(false);
      });
  };

  const onCreateNewNote = () => {

  };

  const onSelectNote = (note) => {
    setSelectedNote(note);
  };

  const onSave = () => {
    setSelectedNote(null);
    getNotes();
  };

  // Load the note when opening the form
  useEffect(() => {
    getNotes();
  }, []);

  return (
    <FullscreenDialog
      inverted={inverted}
      onClickBack={onClickBack}
      backTitle="Back to the Library"
    >
      <Container>
        <Segment inverted={inverted}>
          {selectedNote && (
            <UserNoteEditor
              note={selectedNote}
              onClose={() => setSelectedNote(null)}
              onSave={onSave}
            />
          )}
          <UserNotesTable
            inverted={inverted}
            notes={notes}
            isLoading={isLoading}
            onSelectNote={onSelectNote}
            onCreateNewNote={onCreateNewNote}
          />
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

import React, { useState } from 'react';
import {
  ListItem,
  ListHeader,
  ListDescription,
  ListContent,
  List,
  Message,
  Button,
  Placeholder,
} from 'semantic-ui-react'
import PropTypes from 'prop-types';
import ButtonLink from 'src/components/ButtonLink';
import { READ_WORK } from 'src/components/URLs';
import './NotesList.scss';

export const STATE_LOADING = 0;
export const STATE_ERROR = 1;
export const STATE_LIST = 2;
export const STATE_NO_NOTES = 3;

const numberOfPlaceholderRows = 4;

const UserNotesList = ({ notes, pageSize, onSelectNote, onCreateNewNote, topContent, isLoading, inverted }) => {

  const [activePage, setActivePage] = useState(1);
  let state = STATE_NO_NOTES;
  let totalPages = 0;
  let pagedNotes = null;

  if (isLoading) {
    state = STATE_LOADING;
  }

  // Determine the current page
  else if (notes && notes.length > 0) {
    totalPages = Math.ceil(notes.length / pageSize);
    const start = (activePage - 1) * pageSize;
    pagedNotes = notes.slice(start, start + pageSize);
    state = STATE_LIST;
  }

  const onPageChange = (event, data) => {
    setActivePage(data.activePage);
  }

  const getNoteReferenceDescription = (noteReference) => {
    if (noteReference.work && noteReference.division) {
      return `${noteReference.work.title}: ${noteReference.division.description}`
    }
    if (noteReference.work) {
      return `${noteReference.work.title}`
    }

    return '';
  }

  const getUrlForReference = (noteReference) => {
    if (noteReference.verse_indicator) {
      return READ_WORK(noteReference.work_title_slug, null, `${noteReference.division_full_descriptor}\\${noteReference.verse_indicator}`)
    }

    return READ_WORK(noteReference.work_title_slug, null, noteReference.division_full_descriptor);
  }

  return (
    <>
        <>
          {topContent}
        </>
      {state === STATE_NO_NOTES && (
        <Message>
          <Message.Header>No Notes Exist</Message.Header>
          You do not have any notes.
          {onCreateNewNote && (
            <div className="create-first-note-button">
              <Button onClick={onCreateNewNote}>Create New Notes</Button>
            </div>
          )}
        </Message>
      )}
      {state !== STATE_NO_NOTES && (
        <List divided relaxed>
            {state === STATE_LOADING && (
              <>
                {[...Array(numberOfPlaceholderRows)].map((x, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <ListItem>
                    <ListContent>
                      <ListHeader as='a'>
                        <Placeholder inverted={inverted}>
                          <Placeholder.Paragraph>
                            <Placeholder.Line />
                          </Placeholder.Paragraph>
                        </Placeholder>
                      </ListHeader>
                      <ListDescription as='a'>
                        <Placeholder inverted={inverted}>
                          <Placeholder.Paragraph>
                            <Placeholder.Line />
                          </Placeholder.Paragraph>
                        </Placeholder>
                      </ListDescription>
                    </ListContent>
                  </ListItem>
                )
                )}
              </>
            )}
            {state === STATE_LIST && (
              pagedNotes.map((note) => (
                <ListItem key={note.id}>
                  <ListContent>
                    <ListHeader as='a'>
                      <ButtonLink onClick={() => onSelectNote(note)}>{note.title}</ButtonLink>
                    </ListHeader>
                    <ListDescription as='a'>
                      {note.references && note.references.length > 0 && (
                        <a href={getUrlForReference(note.references[0])}>{getNoteReferenceDescription(note.references[0])}</a>
                      )}
                    </ListDescription>
                  </ListContent>
                </ListItem>
              ))
            )}
          </List>
      )}
    </>
  );
};

UserNotesList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  notes: PropTypes.arrayOf(PropTypes.object),
  onSelectNote: PropTypes.func.isRequired,
  onCreateNewNote: PropTypes.func.isRequired,
  topContent: PropTypes.element,
  isLoading: PropTypes.bool,
  inverted: PropTypes.bool,
  pageSize: PropTypes.number,
};

UserNotesList.defaultProps = {
  topContent: null,
  isLoading: false,
  notes: null,
  useDialog: true,
  inverted: false,
  pageSize: 10,
}

export default UserNotesList;

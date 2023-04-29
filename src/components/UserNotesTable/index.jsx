import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Placeholder, Button, Message, Pagination } from 'semantic-ui-react';
import moment from "moment";
import ButtonLink from "../ButtonLink";
import { READ_WORK } from '../URLs';
import './index.scss';

export const STATE_LOADING = 0;
export const STATE_ERROR = 1;
export const STATE_LIST = 2;
export const STATE_NO_NOTES = 3;

const numberOfPlaceholderRows = 5;

const UserNotesTable = ({ inverted, isLoading, notes, onCreateNewNote, onSelectNote, showWorkLinks, pageSize }) => {

  const [activePage, setActivePage] = useState(1);
  let state = STATE_NO_NOTES;
  let totalPages = 0;
  let pagedNotes = null;

  if (isLoading) {
    state = STATE_LOADING;
  }

  else if (notes && notes.length > 0) {
    state = STATE_LIST;
    totalPages = Math.ceil(notes.length / pageSize);
    const start = (activePage - 1) * pageSize;
    pagedNotes = notes.slice(start, start + pageSize);
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
      {state === STATE_NO_NOTES && (
        <Message>
          <Message.Header>No Notes Exist</Message.Header>
          You do not have any notes.
          {onCreateNewNote && (
            <div className="create-first-note-button">
              <Button onClick={onCreateNewNote}>Create New Note</Button>
            </div>
          )}
        </Message>
      )}
      {state !== STATE_NO_NOTES && (
        <Table inverted={inverted} compact="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Created</Table.HeaderCell>
              {showWorkLinks && (
                <Table.HeaderCell>Reference</Table.HeaderCell>
              )}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {state === STATE_LOADING && (
              <>
                {[...Array(numberOfPlaceholderRows)].map((x, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Placeholder inverted={inverted}>
                        <Placeholder.Paragraph>
                          <Placeholder.Line />
                        </Placeholder.Paragraph>
                      </Placeholder>
                    </Table.Cell>
                    <Table.Cell>
                      <Placeholder inverted={inverted}>
                        <Placeholder.Paragraph>
                          <Placeholder.Line />
                          <Placeholder.Line />
                        </Placeholder.Paragraph>
                      </Placeholder>
                    </Table.Cell>
                    {showWorkLinks && (
                      <Table.Cell>
                        <Placeholder inverted={inverted}>
                          <Placeholder.Paragraph>
                            <Placeholder.Line />
                          </Placeholder.Paragraph>
                        </Placeholder>
                      </Table.Cell>
                    )}
                  </Table.Row>
                )
                )}
              </>
            )}
            {state === STATE_LIST && (
              pagedNotes.map((note) => (
                <Table.Row key={note.id}>
                  <Table.Cell>
                    <ButtonLink onClick={() => onSelectNote(note)}>{note.title}</ButtonLink>
                  </Table.Cell>
                  <Table.Cell>
                    {moment(note.date_created).format("MMMM Do YYYY, h:mm:ss a")}
                    {' '}
                    (
                    {moment(note.date_created).fromNow()}
                    )
                  </Table.Cell>
                  {showWorkLinks && (
                    <Table.Cell>
                      {note.references && note.references.length > 0 && (
                        <a href={getUrlForReference(note.references[0])}>{getNoteReferenceDescription(note.references[0])}</a>
                      )}
                    </Table.Cell>
                  )}
                </Table.Row>
              ))
            )}
          </Table.Body>
          {state !== STATE_LOADING && (
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan={showWorkLinks ? '3' : '2'}>
                  {onCreateNewNote && (
                    <Button onClick={onCreateNewNote}>Create New Note</Button>
                  )}
                  <div className="paginator">
                    <Pagination className="paginator" onPageChange={onPageChange} inverted={inverted} defaultActivePage={activePage} totalPages={totalPages} />
                  </div>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          )}
        </Table>
      )}
    </>
  );
};

UserNotesTable.propTypes = {
  inverted: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  notes: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
  onCreateNewNote: PropTypes.func,
  onSelectNote: PropTypes.func.isRequired,
  showWorkLinks: PropTypes.bool,
  pageSize: PropTypes.number,
};

UserNotesTable.defaultProps = {
  inverted: false,
  isLoading: false,
  notes: null,
  showWorkLinks: false,
  onCreateNewNote: null,
  pageSize: 10,
};

export default UserNotesTable;

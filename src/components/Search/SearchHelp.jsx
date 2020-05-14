import React, { useState } from 'react';
import {
  Message, Accordion, Icon, Table,
} from 'semantic-ui-react';

function SearchHelp() {
  const preformattedStyle = {
    marginLeft: 32,
    fontFamily: 'monospace',
  };

  const exampleStyle = {
    marginTop: 10,
  };

  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  };

  return (
    <Accordion>
      <Accordion.Title
        active={activeIndex === 0}
        index={0}
        onClick={handleClick}
      >
        <Icon name="dropdown" />
        How do I search?
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        The search language used by TextCritical.net allows several operations.
        Here are some common ones:

        <div style={exampleStyle}>
          Search for verses with both ἱστορίας and νόμον:
          <div style={preformattedStyle}>ἱστορίας νόμον</div>
        </div>

        <div style={exampleStyle}>
          Search for verses with the phrase &quot;ἱστορίας νόμον&quot;:
          <div style={preformattedStyle}>&quot;ἱστορίας νόμον&quot;</div>
        </div>

        <div style={exampleStyle}>
          Search for verses with the word ἱστορίας or νόμον:
          <div style={preformattedStyle}>ἱστορίας OR νόμον</div>
        </div>

        <div style={exampleStyle}>
          Search for verses with the word συγγνώμην provided they do not include either ἱστορίας
          or νόμον:
          <div style={preformattedStyle}>συγγνώμην NOT (ἱστορίας OR νόμον)</div>
        </div>

        <div style={exampleStyle}>
          The search engine accepts beta-code representations of Greek words. Thus, a search for
          no/mon is equivalent to a search for νόμον:
          <div style={preformattedStyle}>no/mon</div>
        </div>
        <Message
          warning
          content="If you are searching using beta-code, make sure to put your search query in single quotes (e.g. 'no/mon')"
        />
      </Accordion.Content>

      <Accordion.Title
        active={activeIndex === 1}
        index={1}
        onClick={handleClick}
      >
        <Icon name="dropdown" />
        How do I search for related forms?
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 1}>
        Searching for related forms causes the search engine to look for all other variations of a
        word. For example, a search for ἀδελφός would also search for ἀδελφοί, ἀδελφοῦ, ἀδελφοί,
        etc.
        <Message
          warning
          content="Searching for related forms is considerably slower than searching for a particular form. "
        />
      </Accordion.Content>

      <Accordion.Title
        active={activeIndex === 2}
        index={2}
        onClick={handleClick}
      >
        <Icon name="dropdown" />
        What fields can be searched?
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 2}>
        Several fields exist that can be be searched. Just append the field name to the search
        with a colon to search it (e.g. work:new-testament). Below are the available fields:
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Field</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Example</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>work</Table.Cell>
              <Table.Cell>
                Search for items within a particular work (New Testament, Agammenon, etc.)
              </Table.Cell>
              <Table.Cell>work:&quot;New Testament&quot;</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>no_diacritics</Table.Cell>
              <Table.Cell>
                Search for words disregarding the diacritical marks. Searching for
                no_diacritics:και will match on καὶ and καῖ
              </Table.Cell>
              <Table.Cell>no_diacritics:ευαγγελιον</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>section</Table.Cell>
              <Table.Cell>
                Search for items within a section (chapter, division, book, etc.)
              </Table.Cell>
              <Table.Cell>section:&quot;Matthew 5&quot;</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>author</Table.Cell>
              <Table.Cell>
                Search for verses within works created by a particular author.
              </Table.Cell>
              <Table.Cell>author:&quot;Flavius Josephus&quot;</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Accordion.Content>
    </Accordion>
  );
}

export default SearchHelp;

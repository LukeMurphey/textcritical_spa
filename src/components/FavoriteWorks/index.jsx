import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Header, Button } from "semantic-ui-react";
import {
  getWorksLastRead,
  maxHistoryCount,
  clearWorksLastRead,
} from "../Settings";
import WorkCard from "./WorkCard";

const FavoriteWorks = ({ inverted }) => {
  const recentlyRead = getWorksLastRead();
  const [value, setValue] = useState(0); // Using an integer as a state

  return (
    <div>
      {recentlyRead && (
        <>
          <Header inverted={inverted} as="h3">
            Most Recently Read
            <Button
              floated="right"
              onClick={() => {
                clearWorksLastRead();
                setValue(value + 1);
              }}
            >
              Clear this list
            </Button>
          </Header>
          <Card.Group itemsPerRow={maxHistoryCount()}>
            {recentlyRead.map((work) => (
              <WorkCard
                key={work.workTitleSlug}
                inverted={inverted}
                work={work.workTitleSlug}
                divisions={work.divisions}
                divisionReference={work.divisionReference}
              />
            ))}
          </Card.Group>
        </>
      )}
    </div>
  );
};

FavoriteWorks.propTypes = {
  inverted: PropTypes.bool,
};

FavoriteWorks.defaultProps = {
  inverted: false,
};

export default FavoriteWorks;

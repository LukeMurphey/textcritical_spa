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
      {((recentlyRead && recentlyRead.length > 0) || value > 0) && (
        <>
          <Header inverted={inverted} as="h3">
            Most Recently Read
            {recentlyRead && recentlyRead.length > 0 && (
            <Button
              floated="right"
              onClick={() => {
                clearWorksLastRead();
                setValue(value + 1);
              }}
            >
              Clear this list
            </Button>
            )}
          </Header>
          {recentlyRead && recentlyRead.length > 0 && (
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
          )}
          {(!recentlyRead || recentlyRead.length === 0) && value > 0 && (
            <>No works in the list of recently read works</>
          )}
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

import React from "react";
import PropTypes from "prop-types";
import { Card, Header } from "semantic-ui-react";
import { getWorksLastRead, maxHistoryCount } from "../Settings";
import WorkCard from "./WorkCard";

const FavoriteWorks = ({ inverted }) => {
  const recentlyRead = getWorksLastRead();

  return (
    <div>
      <Header inverted={inverted} as="h3">
        Most Recently Read
      </Header>
      {recentlyRead && (
        <Card.Group itemsPerRow={maxHistoryCount()}>
          {recentlyRead.map((work) => (
            <WorkCard
              key={work.workTitleSlug}
              inverted={inverted}
              work={work.workTitleSlug}
              divisions={work.divisions}
              divisionTitle={work.divisionTitle}
            />
          ))}
        </Card.Group>
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

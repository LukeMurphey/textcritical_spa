import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Header, Button } from "semantic-ui-react";
import {
  getWorksLastRead,
  maxHistoryCount,
  clearWorksLastRead,
  getFavoriteWorks,
  clearFavorites,
  setFavoriteWork,
  removeFavoriteWork,
} from "../Settings/worksList";
import WorkCard from "./WorkCard";

const FavoriteWorks = ({ inverted }) => {
  const recentlyRead = getWorksLastRead();
  const favorites = getFavoriteWorks();
  const [value, setValue] = useState(0); // Using an integer as a state marker to get the view to rerender when necessary

  const onFavWork = work => {
    setFavoriteWork(work);
    setValue(value + 1)
  }

  const onUnFavWork = work => {
    removeFavoriteWork(work);
    setValue(value + 1)
  }

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
          <Card.Group style={{clear: 'both'}} itemsPerRow={maxHistoryCount()}>
            {recentlyRead.map((work) => (
              <WorkCard
                key={work.workTitleSlug}
                work={work.workTitleSlug}
                divisions={work.divisions}
                divisionReference={work.divisionReference}
                setFavoriteWork={onFavWork}
              />
            ))}
          </Card.Group>
          )}
          {(!recentlyRead || recentlyRead.length === 0) && value > 0 && (
            <>No works in the list of recently read works</>
          )}
        </>
      )}

      {((favorites && favorites.length > 0) || value > 0) && (
        <>
          <Header inverted={inverted} as="h3">
            Favorites
            {favorites && favorites.length > 0 && (
            <Button
              floated="right"
              onClick={() => {
                clearFavorites();
                setValue(value + 1);
              }}
            >
              Clear this list
            </Button>
            )}
          </Header>
          {favorites && favorites.length > 0 && (
          <Card.Group style={{clear: 'both'}} itemsPerRow={maxHistoryCount()}>
            {favorites.map((work) => (
              <WorkCard
                key={work.workTitleSlug}
                work={work.workTitleSlug}
                divisions={work.divisions}
                divisionReference={work.divisionReference}
                removeFavoriteWork={onUnFavWork}
              />
            ))}
          </Card.Group>
          )}
          {(!favorites || favorites.length === 0) && value > 0 && (
            <>No favorited works</>
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

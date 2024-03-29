import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Image, Button, Loader, Icon, Dropdown, Responsive } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { ENDPOINT_RESOLVE_REFERENCE, ENDPOINT_WORK_IMAGE } from "../Endpoints/urls";
import { MODE_LOADING, MODE_ERROR, MODE_DONE } from "../Constants";
import { READ_WORK } from "../URLs";
import { truncate } from "../Utils";

const WorkCard = ({
  inverted,
  work,
  divisions,
  divisionReference,
  history,
  setFavoriteWork,
  removeFavoriteWork,
}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const loadInfo = (titleSlug) => {
    fetch(ENDPOINT_RESOLVE_REFERENCE(titleSlug, divisionReference))
      .then((res) => res.json())
      .then((workData) => {
        setData(workData);
      })
      .catch((e) => {
        setError(e.toString());
      });
  };

  useEffect(() => {
    if (!data && !error) loadInfo(work);
  });

  const onLoadWork = () => {
    // Get the URL
    const workUrl = READ_WORK(work, null, ...divisions);
    history.push(workUrl);
  };

  // Determine the mode
  let mode = MODE_LOADING;

  if (error) {
    mode = MODE_ERROR;
  } else if (data) {
    mode = MODE_DONE;
  }

  // Determine the classname
  const className = inverted ? 'inverted' : '';

  // Determine if we have options
  const provideDropdown = removeFavoriteWork || setFavoriteWork;

  return (
    <Card className={className}>
      <Card.Content style={{cursor:'pointer'}} onClick={onLoadWork}>
        <Responsive minWidth={992}>
          <Image floated="right" size="mini" src={ENDPOINT_WORK_IMAGE(work)} />
        </Responsive>
        <Responsive maxWidth={992}>
          <Image size="small" src={ENDPOINT_WORK_IMAGE(work, 200)} />
        </Responsive>
        {mode === MODE_DONE && (
          <Responsive minWidth={992}>
            <Card.Header
              style={{
                lineHeight: "1.2em",
                maxHeight: "2.4em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: 'black',
                fontWeight: 'bold'
              }}
            >
              {truncate(data.work_title, 20)}
            </Card.Header>
            <Card.Meta>{data.division_title}</Card.Meta>
          </Responsive>
        )}
        {mode === MODE_LOADING && <Loader active />}
        {mode === MODE_ERROR && (
          <Icon color="red" name="attention" size="large" title={error} />
        )}
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          {provideDropdown && (
            <>
              <Button.Group fluid color='green'>
                <Responsive minWidth={992}>
                  <Button color='green' onClick={onLoadWork}>
                    Read
                  </Button>
                </Responsive>
                <Dropdown
                  style={{textAlign: 'center'}}
                  className='button icon'
                  floating
                  trigger={<></>}
                >
                  <Dropdown.Menu>
                    {setFavoriteWork && (
                      <Dropdown.Item icon='heart' data-testid="setFav" text='Set as favorite' onClick={() => setFavoriteWork(work)} />
                    )}
                    {removeFavoriteWork && (
                      <Dropdown.Item icon='remove' data-testid="removeFav" text='Remove from favorites' onClick={() => removeFavoriteWork(work)} />
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Button.Group>
            </>
          )}
          {!provideDropdown && (
          <Button basic color="green" onClick={onLoadWork}>
            Read
          </Button>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

WorkCard.propTypes = {
  inverted: PropTypes.bool,
  work: PropTypes.string.isRequired,
  divisionReference: PropTypes.string,
  divisions: PropTypes.arrayOf(PropTypes.string),
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  setFavoriteWork: PropTypes.func,
  removeFavoriteWork: PropTypes.func,
};

WorkCard.defaultProps = {
  inverted: false,
  divisionReference: null,
  divisions: [],
  setFavoriteWork: null,
  removeFavoriteWork: null,
};

export default withRouter(WorkCard);

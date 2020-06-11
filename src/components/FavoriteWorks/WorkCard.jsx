import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Image, Button, Loader, Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { ENDPOINT_RESOLVE_REFERENCE, ENDPOINT_WORK_IMAGE } from "../Endpoints";
import { READ_WORK } from "../URLs";
import { truncate } from "../Utils";

const MODE_LOADING = 0;
const MODE_ERROR = 1;
const MODE_DONE = 2;

const WorkCard = ({
  inverted,
  work,
  divisions,
  divisionReference,
  history,
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
    const workUrl = READ_WORK(work, ...divisions);
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

  return (
    <Card className={className}>
      <Card.Content>
        <Image floated="right" size="mini" src={ENDPOINT_WORK_IMAGE(work)} />
        {mode === MODE_DONE && (
          <>
            <Card.Header
              style={{
                lineHeight: "1.2em",
                maxHeight: "2.4em",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {truncate(data.work_title, 20)}
            </Card.Header>
            <Card.Meta>{data.division_title}</Card.Meta>
          </>
        )}
        {mode === MODE_LOADING && <Loader active />}
        {mode === MODE_ERROR && (
          <Icon color="red" name="attention" size="large" title={error} />
        )}
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <Button basic color="green" onClick={onLoadWork}>
            Read now
          </Button>
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
};

WorkCard.defaultProps = {
  inverted: false,
  divisionReference: null,
  divisions: [],
};

export default withRouter(WorkCard);

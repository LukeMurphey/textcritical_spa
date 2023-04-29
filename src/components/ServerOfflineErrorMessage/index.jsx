import React, { useState } from 'react';
import { Header, Segment, Button } from 'semantic-ui-react';
import { ENDPOINT_VERSION_INFO } from '../Endpoints/urls';

/**
 * This class renders the content of chapter of a work.
 */
function ServerOfflineErrorMessage() {
  const [online, setOnline] = useState(false);

  /**
   * Determine if the site is online.
   */
  const checkOnline = () => {
    fetch(ENDPOINT_VERSION_INFO())
      .then((res) => { setOnline(res.status !== 503); })
      .catch(() => {
        // The site is offline
        setOnline(false);
      });
  };

  /**
   * Refresh the page.
   */
  const openSite = () => {
    location.reload();
  };

  return (
    <Segment color="red">
      {!online && (
        <>
          <Header as="h3">Temporarily Unavailable</Header>
          TextCritical.net is not available right now.
          Please try again in a few moments.
          <div style={{ marginTop: 16 }}>
            <Button onClick={() => checkOnline()}>Check again</Button>
          </div>
        </>
      )}
      {online && (
        <>
          <Header as="h3">Disaster Averted!</Header>
          After a brief hiatus, TextCritical.net is back online.
          Sorry for the delay, we will try to make sure it does not happen again.
          <div style={{ marginTop: 16 }}>
            <Button onClick={() => openSite()}>Check again</Button>
          </div>
        </>
      )}
    </Segment>
  );
}

export default ServerOfflineErrorMessage;

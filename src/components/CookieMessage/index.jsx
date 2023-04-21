import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Message, Button } from 'semantic-ui-react';
import './index.scss';
import { getCookiesAccepted, setCookiesAccepted } from '../Settings/cookiesAccepted';

const CookieMessage = ({ inverted }) => {

  const [showMessage, setShowMessage] = useState(false);

  const onClickHide = () => {
    setCookiesAccepted();
    setShowMessage(false);
  };

  useEffect(() => {
    if(!getCookiesAccepted()){
      setShowMessage(true);
    }
  }, []);

  return (
    <>
    { showMessage && (
      <div className="cookie-message">
      <Message
        inverted={inverted}
        compact
      >
        <div className="text">This site uses cookies.</div>
        <div className="acknowledge"><Button onClick={onClickHide}>Ok</Button></div>
      </Message>
    </div>
    )}
    </>
  );
}


CookieMessage.propTypes = {
  inverted: PropTypes.bool,
};

CookieMessage.defaultProps = {
  inverted: true,
};

export default CookieMessage;

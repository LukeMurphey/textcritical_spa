import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Visibility, Image, Loader } from 'semantic-ui-react';

const LazyImage = ({size, children, src, style}) => {
  const [show, setShow] = useState(false);

  if (!show) {
    return (
      <Visibility as="span" onOnScreen={() => setShow(true)}>
        {children && children}
        {!children && <Loader data-testid="loader" active inline="centered" size={size} />}
      </Visibility>
    );
  }
  
  return <Image style={style} src={src} />;
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.string,
  children: PropTypes.element,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
};

LazyImage.defaultProps = {
  size: 'tiny',
  children: null,
  style: {},
};

export default LazyImage;

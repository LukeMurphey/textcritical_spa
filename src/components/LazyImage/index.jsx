import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Visibility, Image, Loader } from 'semantic-ui-react';

class LazyImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  showImage() {
    this.setState({
      show: true,
    });
  }

  render() {
    const { show } = this.state;
    const {
      size, children, src, style,
    } = this.props;

    if (!show) {
      return (
        <Visibility as="span" onOnScreen={() => this.showImage()}>
          {children && children}
          {!children && <Loader data-testid="loader" active inline="centered" size={size} />}
        </Visibility>
      );
    }
    return <Image style={style} src={src} />;
  }
}

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

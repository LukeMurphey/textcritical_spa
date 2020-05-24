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
    const { size, children, src } = this.props;
    if (!show) {
      return (
        <Visibility as="span" onOnScreen={() => this.showImage()}>
          {children && children}
          {!children && <Loader active inline="centered" size={size} />}
        </Visibility>
      );
    }
    return <Image src={src} />;
  }
}

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.string,
  children: PropTypes.element,
};

LazyImage.defaultProps = {
  size: 'tiny',
  children: null,
};

export default LazyImage;

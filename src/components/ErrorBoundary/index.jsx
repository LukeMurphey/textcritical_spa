import React from 'react';
import { Header, Segment, Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    const { errorInfo, error } = this.state;
    const { children, inverted } = this.props;

    if (errorInfo) {
      // Display the stack trace
      return (
        <Container style={{ marginTop: 32 }}>
          <Segment inverted={inverted} color="red">
            <Header as="h1">Something went wrong.</Header>
            An error happened and the view could not be rendered.
            <details style={{ whiteSpace: 'pre-wrap', marginTop: 24 }}>
              {error && error.toString()}
              <br />
              {errorInfo.componentStack}
            </details>
          </Segment>
        </Container>
      );
    }
    // Normally, just render children
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.element.isRequired,
  inverted: PropTypes.bool,
};

ErrorBoundary.defaultProps = {
  inverted: false,
};

export default ErrorBoundary;

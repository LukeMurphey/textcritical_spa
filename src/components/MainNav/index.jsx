import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import LibraryIcon from '../Icons/Library.svg';

const MainNav = ({ inverted, history, location }) => {
  // Setup state
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <Menu>
      <Menu.Item
        name="library"
        active={activeItem === 'library'}
        onClick={() => handleItemClick()}
      >
        <img src={LibraryIcon} alt="Library" />
      </Menu.Item>
    </Menu>
  );
};

MainNav.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.object.isRequired,
  inverted: PropTypes.bool,
};

MainNav.defaultProps = {
  inverted: false,
};

export default withRouter(MainNav);

import React from 'react';
import { Sidebar, Image, Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
  ENDPOINT_WORK_IMAGE,
} from "../Endpoints/urls";

const BookSidebar = ({ sidebarVisible, work, openWorkInfoModal, openDownloadModal, openSearch, setSidebarVisible }) => {
  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      style={{ width: 200, paddingTop: 50 }}
      inverted
      visible={sidebarVisible}
      onHide={() => setSidebarVisible(false)}
      vertical
      width="thin"
    >
      <Image src={ENDPOINT_WORK_IMAGE(work, 400)} />
      <Menu.Item as="a" onClick={() => openWorkInfoModal()}>
        Information
      </Menu.Item>
      <Menu.Item as="a" onClick={() => openDownloadModal()}>
        Download
      </Menu.Item>
      <Menu.Item as="a" onClick={() => openSearch()}>
        Search
      </Menu.Item>
    </Sidebar>
  )
}

BookSidebar.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  work: PropTypes.string.isRequired,
  openWorkInfoModal: PropTypes.func.isRequired,
  openDownloadModal: PropTypes.func.isRequired,
  openSearch: PropTypes.func.isRequired,
  setSidebarVisible: PropTypes.func.isRequired,
}

export default BookSidebar;

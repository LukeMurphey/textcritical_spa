import React, { useState } from 'react';
import {
  Sidebar, Image, Menu, Label, AccordionTitle, Icon,
  AccordionContent, Header,
  Accordion,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
  ENDPOINT_WORK_IMAGE,
} from "../../Endpoints/urls";
import ButtonLink from '../../ButtonLink';
import "./index.scss";

const ButtonLinkStyle = {
  display: 'block',
};

const BookSidebar = ({ sidebarVisible, data, openWorkInfoModal, openDownloadModal, openSearch, setSidebarVisible, openNotes, notesCount }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex);
  }

  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      icon="labeled"
      style={{ width: 400, paddingTop: 50 }}
      inverted
      visible={sidebarVisible}
      onHide={() => setSidebarVisible(false)}
      vertical
      width="thin"
    >
      <div class={'bookInfo'}>
        <Header inverted style={{background: '#1B1C1D'}} as='h3'>{data?.work ? data.work.title : 'Loading'}</Header>
        <div class={'bookImage'}>
          { data?.work ? <Image style={{ width: 64, padding: 0}} src={ENDPOINT_WORK_IMAGE(data.work.title_slug, 400)} /> : <p>Loading</p>}
        </div>
        <div class={'bookOptions'}>
          <ButtonLink style={ButtonLinkStyle} className={'verticalButton'} onClick={() => openWorkInfoModal()}>Information</ButtonLink>
          <ButtonLink style={ButtonLinkStyle} className={'verticalButton'} onClick={() => openDownloadModal()}>Download</ButtonLink>
          <ButtonLink style={ButtonLinkStyle} className={'verticalButton'} onClick={() => openSearch()}>Search</ButtonLink>
        </div>
      </div>
      <Accordion inverted className={'sidebarMenuAccordion'}>
        <AccordionTitle
          active={activeIndex === 0}
          index={0}
          onClick={handleClick}
        >
          <Icon name='dropdown' />
          Notes <Label as='a'>{notesCount}</Label>
        </AccordionTitle>
        <AccordionContent active={activeIndex === 0}>
          <p>
            Login to see notes
          </p>
        </AccordionContent>
      </Accordion>
    </Sidebar>
  )
}

BookSidebar.defaultProps = {
  openNotes: null,
  notesCount: null,
  data: null,
}

BookSidebar.propTypes = {
  sidebarVisible: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    work: PropTypes.shape({
      title: PropTypes.string,
      title_slug: PropTypes.string,
    }),
    divisions: PropTypes.arrayOf(PropTypes.shape({
      description: PropTypes.string,
      type: PropTypes.string,
      label: PropTypes.string,
    }))
  }),
  openWorkInfoModal: PropTypes.func.isRequired,
  openDownloadModal: PropTypes.func.isRequired,
  openSearch: PropTypes.func.isRequired,
  setSidebarVisible: PropTypes.func.isRequired,
  openNotes: PropTypes.func,
  notesCount: PropTypes.number,
}

export default BookSidebar;

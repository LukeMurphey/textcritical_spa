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
import Notes from './Notes';
import "./index.scss";

const ButtonLinkStyle = {
  display: 'block',
};


const SideBarStyle = {
  borderRight: '1px solid #666',
  width: 450,
  paddingTop: 50,
}

const BookSidebar = ({ sidebarVisible, data, openWorkInfoModal, openDownloadModal, openSearch, setSidebarVisible, openNotes, notesCount, inverted }) => {
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
      inverted
      visible={sidebarVisible}
      onHide={() => setSidebarVisible(false)}
      vertical
      width="thin"
      style={SideBarStyle}
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
          <Notes
            work={data.work.title_slug}
            division={data.chapter.full_descriptor.split('/')}
            inverted={inverted}
          />
        </AccordionContent>
      </Accordion>
    </Sidebar>
  )
}

BookSidebar.defaultProps = {
  openNotes: null,
  notesCount: null,
  data: null,
  inverted: false,
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
  inverted: PropTypes.bool,
}

export default BookSidebar;

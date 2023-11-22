import React from "react";
import styled from "styled-components";
import Button from "../Components/Button";
import { FaPen, FaRegEnvelope, FaUserFriends } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { BsSend } from "react-icons/bs";
import { useState } from "react";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`;

const SideBar = styled.div`
  width: 15%;
  height: 100vh;
  display: inline-block;
  text-align: center;
  align-items: baseline;
  justify-content: center;
  background-color: #3b3939;
  flex-direction: row;
  /* select all children to give margin */
  & > * {
    margin-top: 20px;
  }
`;

const MessageList= styled.div`
  width: 30%;
  height: 100vh;
  display: flex;
`;

const Message = styled.div`
  width: 55%;
  height: 100vh;
  display: flex;
`;

const Tile = styled.div`
  height: 5%;
  position: relative;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  display: flex;
  border: 1px solid transparent;
  background-color: transparent;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ffffff85;
  }
`;

const Notifications = () => {
  const [activeSection, setActiveSection] = useState("inbox");

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <Container>
      <SideBar>
        <Button size="lg" variant="primary">
          <FaPen />
          <p style={{ margin: "5px" }}>Compose</p>
        </Button>
        <Tile onClick={() => handleSectionClick('inbox')} active={activeSection === 'inbox'}>
          <IconContext.Provider value={{ color: "white" }}>
            <FaRegEnvelope />
          </IconContext.Provider>
          <p style={{ color: "white", margin: "5px" }}>Inbox</p>
        </Tile>
        <Tile onClick={() => handleSectionClick('sent')} active={activeSection === 'sent'}>
          <IconContext.Provider value={{ color: "white" }}>
            <BsSend />
          </IconContext.Provider>
          <p style={{ color: "white", margin: "5px" }}>Sent</p>
        </Tile>
        <Tile onClick={() => handleSectionClick('request')} active={activeSection === 'request'}>
          <IconContext.Provider value={{ color: "white" }}>
            <FaUserFriends />
          </IconContext.Provider>
          <p style={{ color: "white", margin: "5px" }}>Friend Request</p>
        </Tile>
      </SideBar>
      {(activeSection === 'inbox' || activeSection === 'sent') && <MessageList>test</MessageList>}
      {(activeSection === 'inbox' || activeSection === 'sent') && <Message>test</Message>}
    </Container>
  );
};

export default Notifications;

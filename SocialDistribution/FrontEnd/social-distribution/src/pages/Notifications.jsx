import React from "react";
import styled from "styled-components";
import Button from "../Components/Button";
import {
  FaPen,
  FaRegEnvelope,
  FaUserFriends,
  FaCheckCircle,
} from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { IconContext } from "react-icons/lib";
import { BsSend } from "react-icons/bs";
import { useState } from "react";
import ComposeModal from "../Components/Compose";

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

const MessageList = styled.div`
  width: 30%;
  height: 100vh;
  display: flex;
`;

const Message = styled.div`
  width: 55%;
  height: 100vh;
  display: flex;
`;

const Request = styled.div`
  width: 80vw;
  height: 9%;
  display: flex;
  border: 1px solid black;
  margin: 5px;
  border-radius: 5px;
  align-items: center;
  & > * {
    margin: 15px;
  }
`;
const Tile = styled.div`
  height: 5%;
  position: relative;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  display: flex;
  border: 1px solid transparent;
  background-color: ${(props) => (props.active ? "#ffffff85" : "transparent")};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ffffff85;
  }
`;

const AcceptDeclineCon = styled.div`
  display: flex;
  & > *{

    margin: auto;
  }
  @media screen {
   margin-left: 85%; 
  }
`

const RenderRequest = ({ requests }) => {
  // function to render request list
  return (
    <div>
      {requests.map((message, index) => (
        <Request key={index}>
          <p>{message}</p>
          <AcceptDeclineCon>
            <IconContext.Provider
              value={{
                color: "green",
                size: "2.5em",
              }}
            >
              <FaCheckCircle />
            </IconContext.Provider>
            <IconContext.Provider
              value={{
                color: "red",
                size: "2.5em",
              }}
            >
              <FaCircleXmark />
            </IconContext.Provider>
          </AcceptDeclineCon>
        </Request>
      ))}
    </div>
  );
};




const Notifications = () => {
  const requests = ["request1", "request2", "request3"];
  const [activeSection, setActiveSection] = useState("inbox");
  const [showComposeModal, setShowComposeModal] = useState(false);

  const handleComposeClick = () => {
    setShowComposeModal(true);
  };
  const handleCloseCompos = () => {
    setShowComposeModal(false);
  };
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <Container>
      <SideBar>
        <Button size="lg" variant="primary" onClick={handleComposeClick}>
          <FaPen />
          <p style={{ margin: "5px" }}>Compose</p>
        </Button>
        <Tile
          onClick={() => handleSectionClick("inbox")}
          active={activeSection === "inbox"}
        >
          <IconContext.Provider value={{ color: "white" }}>
            <FaRegEnvelope />
          </IconContext.Provider>
          <p style={{ color: "white", margin: "5px" }}>Inbox</p>
        </Tile>
        <Tile
          onClick={() => handleSectionClick("sent")}
          active={activeSection === "sent"}
        >
          <IconContext.Provider value={{ color: "white" }}>
            <BsSend />
          </IconContext.Provider>
          <p style={{ color: "white", margin: "5px" }}>Sent</p>
        </Tile>
        <Tile
          onClick={() => handleSectionClick("request")}
          active={activeSection === "request"}
        >
          <IconContext.Provider value={{ color: "white" }}>
            <FaUserFriends />
          </IconContext.Provider>
          <p style={{ color: "white", margin: "5px" }}>Friend Request</p>
        </Tile>
      </SideBar>
      {/* for inbox */}
      {activeSection === "inbox" && <MessageList>inbox message</MessageList>}
      {activeSection === "inbox" && <Message>inbox message</Message>}
      {/* for sent */}
      {activeSection === "sent" && <MessageList>sent message</MessageList>}
      {activeSection === "sent" && <Message>sent message</Message>}
      {/* for friend request */}
      {activeSection === "request" && <RenderRequest requests={requests} />}
      {/* render compose modal */}
      {showComposeModal && <ComposeModal onClose={handleCloseCompos} />}
    </Container>
  );
};

export default Notifications;

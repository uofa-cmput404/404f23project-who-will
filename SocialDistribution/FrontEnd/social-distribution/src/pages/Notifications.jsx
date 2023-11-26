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
import { useState, useEffect } from "react";
import ComposeModal from "../Components/Compose";
import axios from "axios";

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
  & > * {
    cursor: pointer;
    margin: 5px;
  }
  @media screen {
    margin-left: 85%;
  }
`;

const ProfileImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  & > img {
    width: auto;
    height: 100%;
  }
`;

const RenderRequest = ({ requests, onClick }) => {
  const [pendingStatus, setPendingStatus] = useState("");
  const handleClickPending = (event, choice) => {
    event.preventDefault();
    setPendingStatus(choice)
  };
  // function to render request list
  return (
    <div onClick={(e) => onClick(e)}>
      {requests.map((message, index) => (
        <Request key={index}>
          <ProfileImg>
            <img src="https://reactjs.org/logo-og.png" alt="Profile" />
          </ProfileImg>
          <p>{message["owner"]}</p>
          <AcceptDeclineCon>
            <IconContext.Provider
              value={{
                color: "green",
                size: "2.5em",
              }}
            >
              <button onClick={(e) => handleClickPending(e, "accept")} style={{ border: "transparent" }}>
                <FaCheckCircle />
              </button>
            </IconContext.Provider>
            <IconContext.Provider
              value={{
                color: "red",
                size: "2.5em",
              }}
            >
              <button onClick={(e) => handleClickPending(e,"deny")} style={{border: "transparent"}}>
                <FaCircleXmark />
              </button>
            </IconContext.Provider>
          </AcceptDeclineCon>
        </Request>
      ))}
    </div>
  );
};

const Notifications = () => {
  const [activeSection, setActiveSection] = useState("inbox");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [pendingUser, setPendingUser] = useState([]);
  const [clickStatus, setClickStatus] = useState(false);
  useEffect(() => {
    const currentId = localStorage.getItem("pk");
    const authToken = localStorage.getItem("authToken");
    // get requests list
    axios
      .get(`http://127.0.0.1:8000/api/profiles/${currentId}/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      })
      .then((res) => {
        // console.log(res);
        setRequestList(res.data["follow_requests"]);
      })
      .catch((err) => {
        console.log(err);
      });
    // get all requesting users
    axios
      .get(`http://127.0.0.1:8000/api/get_requesters/`, {
        params: {
          ids: `[${requestList}]`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setPendingUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [activeSection, clickStatus]);
  const handleComposeClick = () => {
    setShowComposeModal(true);
  };
  const handleCloseCompos = () => {
    setShowComposeModal(false);
  };
  const handleSectionClick = (section) => {
    setActiveSection(section);
  };
  const handleClickChoice = (event) => {
    event.preventDefault();
    setClickStatus(!clickStatus);
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
        {/* for sent messages */}
        {/* <Tile
          onClick={() => handleSectionClick("sent")}
          active={activeSection === "sent"}
        >
          <IconContext.Provider value={{ color: "white" }}>
            <BsSend />
          </IconContext.Provider>
          <p style={{ color: "white", margin: "5px" }}>Sent</p>
        </Tile> */}
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
      {/* {activeSection === "sent" && <MessageList>sent message</MessageList>}
      {activeSection === "sent" && <Message>sent message</Message>} */}
      {/* for friend request */}
      {activeSection === "request" && (
        <RenderRequest requests={pendingUser} onClick={handleClickChoice} />
      )}
      {/* render compose modal */}
      {showComposeModal && <ComposeModal onClose={handleCloseCompos} />}
    </Container>
  );
};

export default Notifications;

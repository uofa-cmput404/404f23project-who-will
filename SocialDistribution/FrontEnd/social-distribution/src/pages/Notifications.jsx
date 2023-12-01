import React, { useCallback } from "react";
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
import { toast } from "react-toastify";

// styled components
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
  flex-direction: column;
`;

const Message = styled.div`
  width: 55vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: baseline;
  border: 1px solid black;
  margin: 5px;
  border-radius: 5px;

  h3.messageTitle {
    text-align: center; 
    margin-bottom: 10px; 
  }
  p.messageContent {
    margin-left: 10px; 
    margin-right: 10px;
  }
`;

const MessageContainer = styled.div`
  display: flex;
  width: 85%;
  flex-direction: row;
  & > .message {
    margin: auto;
  }
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
    margin-left: 5px;
    margin-right: 5px;
  }
`;

const InboxMessage = styled.div`
  width: 25vw;
  height: 9%;
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  margin: 5px;
  border-radius: 5px;
  & > * {
    margin-left: 5px;
  }
  & > .title {
    margin-top: -5px;
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  & > img {
    width: auto;
    height: 100%;
  }
`;

const RenderRequest = ({ requests, onClick }) => {
  // function to render request list
  const handleClickPending = (event, choice, index) => {
    event.preventDefault();
    const currentID = localStorage.getItem("pk");
    const handleUser = requests[index];
    var data = {};
    var otherData = {};
    if (choice === "accept") {
      data = {
        add_follow_request: "None",
        delete_follow_request: "None",
        add_following: handleUser["profile_id"] + "",
        delete_following: "None",
      };
      otherData = {
        add_follow_request: currentID + "",
        delete_follow_request: "None",
        add_following: "None",
        delete_following: "None",
      };
    } else if (choice === "deny") {
      data = {
        add_follow_request: "None",
        delete_follow_request: handleUser["profile_id"] + "",
        add_following: "None",
        delete_following: handleUser["profile_id"] + "",
      };
    }
    // console.log(data);
    axios
      .put(`http://127.0.0.1:8000/api/profiles/${currentID}/`, data)
      .then((res) => {
        console.log(res);
        if (choice === "accept") {
          toast.success("You have followed back");
        } else if (choice === "deny") {
          toast.done("You have blocked the Follow");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .put(
        `http://127.0.0.1:8000/api/profiles/${handleUser["profile_id"]}/`,
        otherData
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [hover, setHover] = useState(new Array(requests.length).fill(false));
  const onHover = useCallback(
    (index) => {
      const updatedHoverStates = [...hover];
      updatedHoverStates[index] = true;
      setHover(updatedHoverStates);
    },
    [hover]
  );
  const onLeave = useCallback(
    (index) => {
      const updatedHoverStates = [...hover];
      updatedHoverStates[index] = false;
      setHover(updatedHoverStates);
    },
    [hover]
  );
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
              <button
                onMouseEnter={() => onHover(index)}
                onMouseLeave={() => onLeave(index)}
                onClick={(e) => handleClickPending(e, "accept", index)}
                style={{ border: "transparent" }}
              >
                {hover[index] ? "Follow Back" : <FaCheckCircle />}
              </button>
            </IconContext.Provider>
            <IconContext.Provider
              value={{
                color: "red",
                size: "2.5em",
              }}
            >
              <button
                onMouseEnter={() => onHover(index)}
                onMouseLeave={() => onLeave(index)}
                onClick={(e) => handleClickPending(e, "deny", index)}
                style={{ border: "transparent" }}
              >
                {hover[index] ? "Block Follow" : <FaCircleXmark />}
              </button>
            </IconContext.Provider>
          </AcceptDeclineCon>
        </Request>
      ))}
    </div>
  );
};

const RenderInBox = ({ inbox, onClick }) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const handleItemClick = (event, message) => {
    event.preventDefault();
    setSelectedMessage(message);
  };
  return (
    <MessageContainer>
      <MessageList>
        {inbox.map((message, index) => (
          <InboxMessage
            key={index}
            onClick={(e) => handleItemClick(e, message)}
          >
            <p>From: {message["author"]["displayName"]}</p>
            <p className="title">{message["title"]}</p>
          </InboxMessage>
        ))}
      </MessageList>
      {selectedMessage && (
        <div className="message">
          <RenderMessage message={selectedMessage}></RenderMessage>
        </div>
      )}
    </MessageContainer>
  );
};

const RenderMessage = ({ message }) => {
  console.log(message);
  return (
    <Message>
      <h3 className="messageTitle">{message["title"]}</h3>
      <hr />
      <p className="messageContent" >{message["content"]}</p>
      {message['unlisted'] && <img className="postImage" src={message['unlisted']} alt="image" />}
    </Message>
  );
};

const Notifications = () => {
  const [activeSection, setActiveSection] = useState("inbox");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [pendingUser, setPendingUser] = useState([]);
  const [clickStatus, setClickStatus] = useState(false);
  const [inbox, setInbox] = useState([]);
  // updating requesting list

  useEffect(() => {
    async function update() {
      const currentId = localStorage.getItem("pk");
      const authToken = localStorage.getItem("authToken");
      // get requests list
      await axios
        .get(`http://127.0.0.1:8000/api/profiles/${currentId}/`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        })
        .then((res) => {
          // console.log(res);
          setRequestList(res.data["follow_requests"]);
          setFollowingList(res.data["following"]);
        })
        .catch((err) => {
          console.log(err);
        });

      // get all requesting users
      var difference = requestList.filter(
        (item) => !followingList.includes(item)
      );
      await axios
        .get(`http://127.0.0.1:8000/api/get_requesters/?id=${currentId}`)
        .then((res) => {
          // console.log(res.data);
          setPendingUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      // get inbox messages
      const userName = localStorage.getItem("username");
      console.log(userName);
      axios
        .get(`http://127.0.0.1:8000/service/authors/${userName}/inbox`)
        .then((res) => {
          console.log(res.data["items"]);
          setInbox(res.data["items"]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // const intervalId = setInterval(() => {
    //   update();
    // }, 500);
    // return () => clearInterval(intervalId);
    update();
  }, [activeSection, clickStatus]);
  // handle functions
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

  console.log(inbox);
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
        {/* TODO: for sent messages */}
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
      {activeSection === "inbox" && <RenderInBox inbox={inbox} />}
      {/* {activeSection === "inbox" && <Message>inbox message</Message>} */}
      {/* for sent */}
      {/* {activeSection === "sent" && <MessageList>sent message</MessageList>}
      {activeSection === "sent" && <Message>sent message</Message>} */}
      {/* for friend request */}
      {activeSection === "request" && (
        <RenderRequest requests={pendingUser} onClick={handleClickChoice} />
      )}
      {/* render compose modal for private posts */}
      {showComposeModal && <ComposeModal onClose={handleCloseCompos} />}
    </Container>
  );
};

export default Notifications;

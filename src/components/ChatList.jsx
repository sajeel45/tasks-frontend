import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ListGroup, Badge, Spinner, Alert, Button } from "react-bootstrap";
import { FiPlus, FiSearch } from "react-icons/fi";
import {
  fetchUserConversations,
  setActiveConversation,
} from "../redux/pagesSlices/chatSlice";
import { getId, getFullName } from "../utils/gloabalFunctions";
import moment from "moment";

const ChatList = ({ activeConversation }) => {
  const dispatch = useDispatch();

  const {
    conversations = [],
    loadings = {},
    errors = {},
  } = useSelector((state) => state.chat);

  const isLoading = loadings.fetchUserConversations;
  const error = errors.fetchUserConversations;
  const [filteredConversations, setFilteredConversations] = React.useState(conversations);

  useEffect(() => {
    console.log("🔵 ChatList - Fetching conversations...");
    dispatch(fetchUserConversations({ limit: 100000 }));
  }, [dispatch]);

  useEffect(() => {
    console.log("🔵 ChatList - Updating filtered conversations");
    setFilteredConversations(conversations);
  }, [conversations]);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = conversations.filter((conversation) =>
      getFullName(conversation.otherUser).toLowerCase().includes(searchTerm)
    );
    setFilteredConversations(filtered);
  };

  const handleConversationSelect = (conversation) => {
    console.log("🔵 ChatList - Selecting conversation:", conversation);
    dispatch(setActiveConversation(conversation));
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return "";

    const messageTime = moment(timestamp);
    const now = moment();
    const diffDays = now.diff(messageTime, "days");

    if (diffDays === 0) {
      return messageTime.format("HH:mm");
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return messageTime.format("ddd");
    } else {
      return messageTime.format("MMM DD");
    }
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return "";
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  const renderConversationItem = (conversation) => {
    const isActive =
      activeConversation &&
      getId(activeConversation.otherUser) === getId(conversation.otherUser);

    return (
      <ListGroup.Item
        key={getId(conversation) || getId(conversation.otherUser)}
        action
        active={isActive}
        onClick={() => handleConversationSelect(conversation)}
        className="chart-box"
      >
        <div className="chart-flex-box">
          {/* Avatar */}
          <div className="avatar-box">
            {conversation.otherUser?.profileImage ? (
              <img
                src={conversation.otherUser.profileImage}
                alt={getFullName(conversation.otherUser)}
              />
            ) : (
              <div className="avatar-placeholder">
                <span className="initial-text">
                  {getFullName(conversation.otherUser).charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Online status indicator */}
            {conversation.otherUser?.isOnline && (
              <span className="online-status-indicator"></span>
            )}
          </div>

          {/* Conversation Info */}
          <div className="chat-info-content">
            <div className="chat-info-flex">
              <h6 className="text-truncate">
                {getFullName(conversation.otherUser)}
              </h6>
              <small className="text-muted">
                {formatLastMessageTime(
                  conversation.latestMessage?.createdAt ||
                    conversation.updatedAt
                )}
              </small>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0 text-muted text-truncate">
                {conversation.latestMessage ? (
                  <>
                    {conversation.latestMessage.messageType === "text" ? (
                      truncateMessage(conversation.latestMessage.message)
                    ) : (
                      <span className="text-muted">
                        📎 {conversation.latestMessage.messageType}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-muted">No messages yet</span>
                )}
              </p>

              {/* Unread count */}
              {conversation.unreadCount > 0 && (
                <Badge pill className="ms-2">
                  {conversation.unreadCount > 99
                    ? "99+"
                    : conversation.unreadCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </ListGroup.Item>
    );
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className="chat-list p-3">
        <div className="">
          <Spinner animation="border" size="sm" />
          <p className="mt-2 text-muted">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-list p-3">
        <Alert variant="danger">Error loading conversations: {error}</Alert>
      </div>
    );
  }

  if (!Array.isArray(conversations) || conversations.length === 0) {
    return (
      <div className="chat-list p-3">
        <div className="chat-sidebar-header">
          <h5 className="mb-0">Chat</h5>
          {/* <button 
          size="sm" 
          onClick={onNewChatClick}
          className="btn-style transparent"
        >
          <FiPlus />
        </button> */}
        </div>
        <div className="text-center text-muted">
          <h6>No conversations yet</h6>
          <p className="small">Start a new conversation to begin chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list">
      <div className="chat-sidebar-header">
        <h5 className="mb-0">Chat</h5>
        {/* <button 
          size="sm" 
          onClick={onNewChatClick}
          className="btn-style transparent"
        >
          <FiPlus />
        </button> */}
      </div>

      <div className="chat-search-bar search-bar-wrapper">
        <div className="form-group">
          <button>
            <FiSearch />
          </button>
          <input type="text" className="form-control" onChange={handleSearchChange} placeholder="Search..." />
        </div>
      </div>

      <ListGroup variant="flush" className="chat-list-items">
        {filteredConversations.map(renderConversationItem)}
      </ListGroup>

      {isLoading && conversations.length > 0 && (
        <div className="text-center p-2">
          <Spinner animation="border" size="sm" />
        </div>
      )}
    </div>
  );
};

export default ChatList;

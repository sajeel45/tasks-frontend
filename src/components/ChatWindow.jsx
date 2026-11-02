import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { FiSend, FiPaperclip, FiPhone, FiVideo, FiMoreHorizontal } from 'react-icons/fi';
import { 
  fetchChatMessages, 
  markChatAsRead
} from '../redux/pagesSlices/chatSlice';
import { socketService } from '../service/socketService';
import { getId, getFullName } from '../utils/gloabalFunctions';
import moment from 'moment';
import 'moment-timezone';

const ChatWindow = ({ activeConversation }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const prevScrollHeight = useRef(0);

  const currentUserId = getId(currentUser);
  const receiverId = getId(activeConversation?.otherUser);

  const {
    messages = {},
    loadings = {},
    errors = {},
    pagination = {}
  } = useSelector((state) => state.chat);
  
  const currentMessages = useMemo(() => {
    const msgs = messages[receiverId] || [];
    console.log('🔍 ChatWindow - receiverId:', receiverId);
    console.log('🔍 ChatWindow - all messages keys:', Object.keys(messages));
    console.log('🔍 ChatWindow - messages for this receiver:', msgs);
    return msgs;
  }, [messages, receiverId]);

  // Get pagination info for current conversation
  const currentPagination = useMemo(() => 
    pagination[receiverId] || { page: 1, hasMore: true }, 
    [pagination, receiverId]
  );

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const messageDate = new Date(message.createdAt);
      const today = moment();
      const yesterday = moment().subtract(1, 'day');
      const msgMoment = moment(messageDate);
      
      let dateKey;
      if (msgMoment.isSame(today, 'day')) {
        dateKey = 'Today';
      } else if (msgMoment.isSame(yesterday, 'day')) {
        dateKey = 'Yesterday';
      } else {
        dateKey = moment.utc(messageDate).tz(moment.tz.guess()).format("MMM D, YYYY");
      }
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(message);
      return acc;
    }, {});
  };

  const sortDateKeys = (dateKeys, ascending = true) => {
    return dateKeys.sort((a, b) => {
      // Handle special cases for Today and Yesterday
      if (a === 'Today') return ascending ? 1 : -1;
      if (b === 'Today') return ascending ? -1 : 1;
      if (a === 'Yesterday') return ascending ? 1 : -1;
      if (b === 'Yesterday') return ascending ? -1 : 1;
      
      // For actual dates, parse and compare
      const dateA = moment(a, "MMM D, YYYY").toDate();
      const dateB = moment(b, "MMM D, YYYY").toDate();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  };

  const grouped = groupMessagesByDate(currentMessages);
  const dateKeys = sortDateKeys(Object.keys(grouped), true);
  const isLoading = loadings.fetchChatMessages || loadings.sendChatMessage;
  
  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Handle scroll for pagination
  const handleScroll = useCallback((e) => {
    const container = e.target;
    const { scrollTop, scrollHeight } = container;
    
    // Check if scrolled to top (with small threshold for mobile)
    if (scrollTop <= 100 && currentPagination.hasMore && !isLoadingMore && !loadings.fetchChatMessages) {
      setIsLoadingMore(true);
      prevScrollHeight.current = scrollHeight;
      
      const nextPage = currentPagination.page + 1;
      console.log('📄 Loading more messages - page:', nextPage);
      
      dispatch(fetchChatMessages({ 
        receiverId, 
        page: nextPage, 
        limit: 50
      })).then(() => {
        setIsLoadingMore(false);
        
        // Maintain scroll position after loading new messages
        setTimeout(() => {
          if (messagesContainerRef.current) {
            const newScrollHeight = messagesContainerRef.current.scrollHeight;
            const scrollDiff = newScrollHeight - prevScrollHeight.current;
            messagesContainerRef.current.scrollTop = scrollTop + scrollDiff;
          }
        }, 50);
      }).catch(() => {
        setIsLoadingMore(false);
      });
    }
  }, [receiverId, currentPagination, isLoadingMore, loadings.fetchChatMessages, dispatch]);

  // Reset pagination when conversation changes
  useEffect(() => {
    setIsLoadingMore(false);
  }, [receiverId]);
  
  // Join chat room when conversation changes
  useEffect(() => {
    if (receiverId) {
      console.log('🚪 Joining chat with:', receiverId);
      socketService.joinChat(currentUserId, receiverId);
      
      // Fetch initial message history (page 1)
      dispatch(fetchChatMessages({ receiverId, page: 1, limit: 50 }));
      
      // Mark messages as read
      dispatch(markChatAsRead({ receiverId }));
      socketService.markAsRead(currentUserId, receiverId);
    }
    
    return () => {
      if (receiverId) {
        console.log('🚪 Leaving chat with:', receiverId);
        socketService.leaveChat(currentUserId, receiverId);
      }
    };
  }, [receiverId, currentUserId, dispatch]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !receiverId) return;
    
    const messageData = {
      receiver: receiverId,
      message: newMessage.trim(),
      messageType: 'text'
    };
    
    // Send via socket - message will appear when received back from server
    socketService.sendMessage(currentUserId, {...messageData, receiverId});
    
    // Also send via API for persistence
    // dispatch(sendChatMessage(messageData));
    
    // Clear input
    setNewMessage('');
  };
  
  const handleFileUpload = () => {
    // TODO: Implement file upload
    fileInputRef.current?.click();
  };
  
  const formatMessageTime = (timestamp) => {
    return moment(timestamp).format('HH:mm');
  };

  const SentMessage = ({ message }) => (
    <div className="message own-message">
      <div className="message-content">
        {message.message}
      </div>
      <div className="message-meta">
        <small className="text-muted">
          {formatMessageTime(message.createdAt)}
          <span className="ms-1">
            {message.isRead ? '✓✓' : '✓'}
          </span>
        </small>
      </div>
    </div>
  );

  const ReceivedMessage = ({ message }) => (
    <div className="message other-message">
      <div className="message-content">
        {message.message}
      </div>
      <div className="message-meta">
        <small className="text-muted">
          {formatMessageTime(message.createdAt)}
        </small>
      </div>
    </div>
  );
  
  if (!activeConversation) {
    return (
      <div className="chat-window bg-white d-flex align-items-center justify-content-center h-100">
        <div className="text-center text-muted">
          <h5>Select a conversation to start chatting</h5>
          <p>Choose a contact from the list to begin messaging</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="chat-window d-flex flex-column h-100">
      {/* Chat Header */}
      <div className="chat-header p-3 bg-white">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="avatar me-3">
              {activeConversation.otherUser?.profileImage ? (
                <img 
                  src={activeConversation.otherUser.profileImage} 
                  alt={getFullName(activeConversation.otherUser)}
                  className="rounded-circle"
                  width="40"
                  height="40"
                />
              ) : (
                <div className="avatar-placeholder" >
                  <span>
                  {getFullName(activeConversation.otherUser).charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h6 className="mb-0">{getFullName(activeConversation.otherUser)}</h6>
              <small className="text-muted">
                {activeConversation.otherUser?.isOnline ? (
                  <span className="text-success">● Online</span>
                ) : (
                  `Last seen ${moment(activeConversation.otherUser?.lastSeen).fromNow()}`
                )}
              </small>
            </div>
          </div>
          
          {/* <div className="chat-actions d-flex">
            <Button variant="outline-secondary" size="sm" className="me-2">
              <FiPhone />
            </Button>
            <Button variant="outline-secondary" size="sm" className="me-2">
              <FiVideo />
            </Button>
            <Button variant="outline-secondary" size="sm">
              <FiMoreHorizontal />
            </Button>
          </div> */}
        </div>
      </div>
      
      {/* Chat Messages */}
      <div 
        className="chat-messages flex-grow-1 p-3 overflow-auto"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {/* Loading indicator for pagination */}
        {isLoadingMore && (
          <div className="text-center mb-3">
            <Spinner animation="border" size="sm" />
            <p className="mt-2 text-muted">Loading more messages...</p>
          </div>
        )}
        
        {errors.fetchChatMessages && (
          <Alert variant="danger" className="mb-3">
            Error loading messages: {errors.fetchChatMessages}
          </Alert>
        )}
        
        {isLoading && currentMessages.length === 0 ? (
          <div className="text-center">
            <Spinner animation="border" size="sm" />
            <p className="mt-2 text-muted">Loading messages...</p>
          </div>
        ) : currentMessages.length === 0 ? (
          <div className="text-center text-muted">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          dateKeys.map((dateKey, index) => {
            const dateMessages = grouped[dateKey];
            return (
              <div key={dateKey}>
                <div
                  className={`date-separator text-center ${
                    index !== 0 && "mt-4"
                  } mb-4`}
                >
                  <span className="text-muted px-2 py-1 rounded bg-white">
                    {dateKey}
                  </span>
                </div>

                {dateMessages
                  .sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                  )
                  .map((message, msgIndex) => {
                    const isUser = (getId(message.sender) || message.sender) === currentUserId;

                    return (
                      <div
                        key={message.id || getId(message) || msgIndex}
                        className={`mb-3 ${
                          isUser ? "d-flex justify-content-end" : ""
                        }`}
                      >
                        {isUser ? (
                          <SentMessage message={message} />
                        ) : (
                          <ReceivedMessage message={message} />
                        )}
                      </div>
                    );
                  })}
              </div>
            );
          })
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="chat-input">
        <Form onSubmit={handleSendMessage}>
          <InputGroup>
            {/* <button 
              className="upload-btn"
              onClick={handleFileUpload}
              disabled={isLoading}
            >
              <FiPaperclip />
            </button> */}
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn-style"
              disabled={!newMessage.trim() || isLoading}
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <FiSend />
              )}
            </button>
          </InputGroup>
        </Form>
        
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => {
            // TODO: Handle file upload
            console.log('File selected:', e.target.files[0]);
          }}
        />
      </div>
    </div>
  );
};

export default ChatWindow;

import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { ApiRequests } from '../../service/ApiRequests';
import {
  catchAsync,
  handleLoadingErrorParamsForAsycThunk,
  reduxToolKitCaseBuilder,
} from '../../helpers/detectError.js';
import { getId } from '../../utils/gloabalFunctions.js';

// Async thunks for API calls
export const fetchUserConversations = createAsyncThunk(
  'chat/fetchUserConversations',
  catchAsync(async (params = {}) => {
    console.log('🔵 fetchUserConversations called with params:', params);
    const response = await ApiRequests.getUserConversations(params);
    console.log('🔵 fetchUserConversations response:', response);
    return response.data;
  })
);

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchChatMessages',
  catchAsync(async ({ receiverId, page = 1, limit = 50 }) => {
    const response = await ApiRequests.getChatMessages(receiverId, { page, limit });
    return { 
      receiverId, 
      messages: response.data.results, 
      hasMore: response.data.page < response.data.totalPages,
      page: response.data.page,
      totalPages: response.data.totalPages
    };
  })
);

export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  catchAsync(async ({ receiver, message, messageType = 'text', fileUrl, fileName, fileSize }) => {
    const response = await ApiRequests.sendChatMessage({ 
      receiver, 
      message, 
      messageType,
      fileUrl,
      fileName,
      fileSize
    });
    return response.data;
  })
);

export const markChatAsRead = createAsyncThunk(
  'chat/markChatAsRead',
  catchAsync(async ({ receiverId }) => {
    const response = await ApiRequests.markChatAsRead(receiverId);
    return { receiverId, data: response.data };
  })
);

export const getChatStats = createAsyncThunk(
  'chat/getChatStats',
  catchAsync(async () => {
    const response = await ApiRequests.getChatStats();
    return response.data;
  })
);

const initialState = {
  // chat states
  conversations: [],
  activeConversation: null,
  messages: {},
  typingUsers: {},
  pagination: {},
  socketConnected: false,
  
  // manager states (consistent with other slices)
  errors: {},
  loadings: {},
  errorMessages: {},
  errorCodes: {},
  paramsForThunk: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
      // Clear typing users for this conversation
      if (action.payload?.id) {
        delete state.typingUsers[action.payload.id];
      }
    },
    clearActiveConversation: (state) => {
      state.activeConversation = null;
      // Clear all typing users when conversation is cleared
      state.typingUsers = {};
      // Optionally clear messages if needed
      state.messages = {};
      state.pagination = {};
    },
    addMessage: (state, action) => {
      const { senderId, message, currentUserId } = action.payload;
      
      // Use provided currentUserId or fallback to localStorage
      const currentUser = currentUserId || getId(JSON.parse(localStorage.getItem('user') || '{}'));
      
      // Determine the conversation partner ID
      // For received messages: use the sender
      // For sent messages: use the receiver
      const conversationPartnerId = senderId === currentUser ? message.receiver : senderId;
      
      if (!state.messages[conversationPartnerId]) {
        state.messages[conversationPartnerId] = [];
      }
      
      console.log('🔵 Adding message to conversation:', conversationPartnerId);
      console.log('🔵 Current user ID:', currentUser);
      console.log('🔵 Message sender:', message.sender);
      console.log('🔵 Message receiver:', message.receiver);
      console.log('🔵 SenderId from action:', senderId);
      console.log('🔵 Current messages for this conversation:', state.messages[conversationPartnerId]?.length || 0);
      
      // Check if message already exists to avoid duplicates
      const existingMessage = state.messages[conversationPartnerId].find(m => {
        return getId(m) === getId(message);
      });
      
      if (!existingMessage) {
        // Add new message
        state.messages[conversationPartnerId].unshift(message);
        console.log('➕ Added new message to conversation');
        console.log('➕ Total messages now:', state.messages[conversationPartnerId].length);
        
        // Update last message in conversations list
        if (Array.isArray(state.conversations)) {
          const conversationIndex = state.conversations.findIndex(conv => 
            getId(conv.otherUser) === conversationPartnerId
          );
          if (conversationIndex !== -1) {
            state.conversations[conversationIndex].latestMessage = message;
            state.conversations[conversationIndex].updatedAt = message.createdAt;
            
            // Move conversation to top
            const conversation = state.conversations.splice(conversationIndex, 1)[0];
            state.conversations.unshift(conversation);
          }
        }
      } else {
        console.log('⚠️ Message already exists, skipping');
      }
    },
    updateMessageStatus: (state, action) => {
      const { receiverId, status } = action.payload;
      if (state.messages[receiverId]) {
        // Mark messages as read
        state.messages[receiverId].forEach(message => {
          message.isRead = true;
          message.readAt = status.readAt || new Date();
        });
      }
    },
    setTypingUser: (state, action) => {
      const { receiverId, userId, isTyping } = action.payload;
      if (!state.typingUsers[receiverId]) {
        state.typingUsers[receiverId] = {};
      }
      
      if (isTyping) {
        state.typingUsers[receiverId][userId] = true;
      } else {
        delete state.typingUsers[receiverId][userId];
        if (Object.keys(state.typingUsers[receiverId]).length === 0) {
          delete state.typingUsers[receiverId];
        }
      }
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    setUserTyping: (state, action) => {
      const { userId, isTyping } = action.payload;
      if (isTyping) {
        state.typingUsers[userId] = true;
      } else {
        delete state.typingUsers[userId];
      }
    },
    setUserStoppedTyping: (state, action) => {
      const { userId } = action.payload;
      delete state.typingUsers[userId];
    },
    updateMessageReadStatus: (state, action) => {
      const { chatRoom, readAt } = action.payload;
      // Find and update message across all conversations
      Object.keys(state.messages).forEach(receiverId => {
        const messageIndex = state.messages[receiverId].findIndex(m => m.chatRoom === chatRoom);
        if (messageIndex !== -1) {
          state.messages[receiverId][messageIndex].isRead = true;
          state.messages[receiverId][messageIndex].readAt = readAt;
        }
      });
    },
    setUserOnlineStatus: (state, action) => {
      const { userId, isOnline, lastSeen } = action.payload;
      // Update user status in conversations
      if (Array.isArray(state.conversations)) {
        const conversationIndex = state.conversations.findIndex(conv => 
          conv.otherUser?.id === userId
        );
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].otherUser.isOnline = isOnline;
          state.conversations[conversationIndex].otherUser.lastSeen = lastSeen;
        }
      }
    },
    updateConversation: (state, action) => {
      const { userId, latestMessage, unreadCount } = action.payload;
      if (Array.isArray(state.conversations)) {
        const conversationIndex = state.conversations.findIndex(conv => 
          conv.otherUser?.id === userId
        );
        if (conversationIndex !== -1) {
          // Update existing conversation
          state.conversations[conversationIndex].latestMessage = latestMessage;
          state.conversations[conversationIndex].updatedAt = latestMessage.createdAt;
          if (unreadCount) {
            state.conversations[conversationIndex].unreadCount = 
              (state.conversations[conversationIndex].unreadCount || 0) + unreadCount;
          }
          
          // Move to top
          const conversation = state.conversations.splice(conversationIndex, 1)[0];
          state.conversations.unshift(conversation);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchUserConversations.fulfilled, (state, action) => {
        const conversationsData = action.payload;
        console.log('🔵 ChatSlice - fetchUserConversations.fulfilled:', conversationsData);
        state.conversations = Array.isArray(conversationsData) ? conversationsData : [];
        console.log('🔵 ChatSlice - state.conversations after update:', state.conversations);
      })
      
      // Fetch chat messages
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        const { receiverId, messages, totalPages, page } = action.payload;
        const hasMore = page < totalPages;
        if (!state.messages[receiverId]) {
          state.messages[receiverId] = [];
        }
        
        // For pagination, prepend older messages (page > 1) or replace messages (page = 1)
        if (page === 1) {
          // First page - replace all messages
          state.messages[receiverId] = messages;
        } else {
          // Subsequent pages - prepend older messages and remove duplicates
          state.messages[receiverId] = [...messages, ...state.messages[receiverId]].filter((msg, index, self) =>
              index === self.findIndex((m) => getId(m) === getId(msg))
          );
        }
        
        // Update pagination info
        state.pagination[receiverId] = { hasMore, page };
      })
      
      // Send message - handled via socket events to avoid duplicates
      .addCase(sendChatMessage.fulfilled, () => {
        // Message will be added via socket event to avoid duplicates
      })
      
      // Mark messages as read
      .addCase(markChatAsRead.fulfilled, (state, action) => {
        const { receiverId } = action.payload;
        if (state.messages[receiverId]) {
          state.messages[receiverId].forEach(message => {
            if (!message.isRead) {
              message.isRead = true;
              message.readAt = new Date().toISOString();
            }
          });
        }
        console.log('🚀 ~ chatSlice.js:298 ~ .addCase ~ state.conversations1:', state.conversations);
        state.conversations = state.conversations.map(conv => {
          if (getId(conv.otherUser) === receiverId) {
            return {
              ...conv,
              unreadCount: 0, // Reset unread count
              updatedAt: new Date().toISOString() // Update timestamp
            };
          }
          return conv;
        });
        console.log('🚀 ~ chatSlice.js:298 ~ .addCase ~ state.conversations:', state.conversations);

      })
      
      // Get chat stats
      .addCase(getChatStats.fulfilled, (state, action) => {
        // Handle chat stats if needed
        state.stats = action.payload;
      })

      // Use addMatcher to manage the asyncthunks method actions like fulfilled, pending, rejected
      // and also to manage the errors, loading, error messages and async params
      .addMatcher(
        isAnyOf(
          ...reduxToolKitCaseBuilder([
            fetchUserConversations,
            fetchChatMessages,
            sendChatMessage,
            markChatAsRead,
            getChatStats
          ])
        ),
        handleLoadingErrorParamsForAsycThunk
      );
  }
});

export const {
  setActiveConversation,
  clearActiveConversation,
  addMessage,
  updateMessageStatus,
  setTypingUser,
  setSocketConnected,
  setUserTyping,
  setUserStoppedTyping,
  updateMessageReadStatus,
  setUserOnlineStatus,
  updateConversation
} = chatSlice.actions;

export default chatSlice.reducer;

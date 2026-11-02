import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socketService } from '../service/socketService';
import {
  addMessage,
  setSocketConnected,
  updateMessageReadStatus,
  setUserOnlineStatus,
  updateConversation,
  fetchUserConversations
} from '../redux/pagesSlices/chatSlice';
import { getId } from '../utils/gloabalFunctions';
import { toast } from 'react-toastify';

// Global flag to prevent multiple socket initializations
let globalSocketInitialized = false;

export const useSocket = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const currentUser = getId(user);
  const listenersRef = useRef({});
  const socketInitializedRef = useRef(false);

  console.log('🔍 useSocket - user from auth:', user);
  console.log('🔍 useSocket - currentUser ID:', currentUser);
  console.log('🔍 useSocket - socket already initialized:', socketInitializedRef.current);

  // Setup socket event listeners
  const setupListeners = useCallback(() => {
    // Clean up existing listeners
    Object.entries(listenersRef.current).forEach(([event, callback]) => {
      socketService.off(event, callback);
    });

    // Connection events
    const onConnect = (data) => {
      console.log('🔌 Socket connected in hook:', data);
      dispatch(setSocketConnected(true));
    };

    const onDisconnect = (data) => {
      console.log('🔌 Socket disconnected in hook:', data);
      dispatch(setSocketConnected(false));
    };

    const onConnectError = (data) => {
      console.error('❌ Socket connection error in hook:', data);
      dispatch(setSocketConnected(false));
    };

    // Chat events
    const onNewMessage = (messageData) => {
      console.log('📨 New message received in hook:', messageData);
      console.log('📨 Current user ID:', currentUser);
      console.log('📨 Message sender:', messageData.sender);
      console.log('📨 Message receiver:', messageData.receiver);
      toast.info(`New message from ${(messageData.sender.firstName + ' ' + messageData.sender.lastName).trim() || 'Unknown'}`);

      // Add message to store with current user context
      dispatch(addMessage({
        senderId: getId(messageData.sender),
        message: messageData,
        currentUserId: currentUser
      }));

      // Update conversation list
      dispatch(updateConversation({
        userId: getId(messageData.sender),
        latestMessage: messageData,
        unreadCount: 1
      }));
    };

    const onReceiveMessage = (messageData) => {
      console.log('📨 Receive message event in hook:', messageData);

      // Handle both single message and array of messages
      const messages = Array.isArray(messageData) ? messageData : [messageData];

      messages.forEach(msg => {
        console.log('📨 Processing message:', msg);
        console.log('📨 Current user ID:', currentUser);
        console.log('📨 Message senderId:', msg.senderId);
        console.log('📨 Message receiverId:', msg.receiverId);

        // Add message to store with current user context
        dispatch(addMessage({
          senderId: msg.senderId,
          message: {
            ...msg,
            sender: msg.senderId,
            receiver: msg.receiverId
          },
          currentUserId: currentUser
        }));

        if (messageData.isNewRoom) {
          dispatch(fetchUserConversations());
          return;
        }
        // Update conversation list
        dispatch(updateConversation({
          userId: msg.senderId,
          latestMessage: msg,
          unreadCount: 1
        }));
      });
    };

    const onMessageRead = (data) => {
      console.log('👁️ Message read in hook:', data);
      dispatch(updateMessageReadStatus({
        readBy: data.userId,
        chatRoom: data.chatRoom,
        readAt: data.readAt || new Date().toISOString()
      }));
    };

    const onUserOnline = (data) => {
      console.log('🟢 User online in hook:', data);
      dispatch(setUserOnlineStatus({
        userId: data.userId,
        isOnline: true,
        lastSeen: data.lastSeen
      }));
    };

    const onUserOffline = (data) => {
      console.log('🔴 User offline in hook:', data);
      dispatch(setUserOnlineStatus({
        userId: data.userId,
        isOnline: false,
        lastSeen: data.lastSeen || new Date().toISOString()
      }));
    };

    // Register listeners
    const listeners = {
      connect: onConnect,
      disconnect: onDisconnect,
      connect_error: onConnectError,
      new_message: onNewMessage,
      receive_message: onReceiveMessage,
      message_read_all: onMessageRead,
      user_online: onUserOnline,
      user_offline: onUserOffline
    };

    // Add listeners to socket service
    Object.entries(listeners).forEach(([event, callback]) => {
      socketService.on(event, callback);
    });

    // Store reference for cleanup
    listenersRef.current = listeners;
  }, [dispatch, currentUser]);

  // Initialize socket connection
  useEffect(() => {
    if (!currentUser) {
      console.log('⏳ Waiting for user ID to initialize socket');
      return;
    }

    // Prevent multiple socket connections using global flag
    if (globalSocketInitialized) {
      console.log('⚠️ Socket already initialized globally, skipping...');
      return;
    }

    console.log('🚀 Initializing socket for user:', currentUser);

    // Check if socket is already connected
    if (socketService.isConnected()) {
      console.log('✅ Socket already connected, just setting up listeners');
      setupListeners();
      globalSocketInitialized = true;
      socketInitializedRef.current = true;
      return;
    }

    // Connect socket with user ID
    const socket = socketService.connect(currentUser);

    if (socket) {
      // Setup event listeners
      setupListeners();
      globalSocketInitialized = true;
      socketInitializedRef.current = true;
    }

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up socket listeners');
      Object.entries(listenersRef.current).forEach(([event, callback]) => {
        socketService.off(event, callback);
      });
      // Reset the flag when component unmounts
      globalSocketInitialized = false;
      socketInitializedRef.current = false;
    };
  }, [currentUser, setupListeners]);

  // Chat actions
  const joinChat = useCallback((receiverId) => {
    console.log('🚪 Joining chat with:', receiverId);
    socketService.joinChat(currentUser, receiverId);
  }, [currentUser]);

  const leaveChat = useCallback((receiverId) => {
    console.log('🚪 Leaving chat with:', receiverId);
    socketService.leaveChat(currentUser, receiverId);
  }, [currentUser]);

  const sendMessage = useCallback((messageData) => {
    console.log('📤 Sending message via hook:', messageData);
    socketService.sendMessage(currentUser, messageData);
  }, [currentUser]);

  const markAsRead = useCallback((receiverId, messageId) => {
    console.log('👁️ Marking as read via hook:', { receiverId, messageId });
    socketService.markAsRead(currentUser, receiverId, messageId);
  }, [currentUser]);

  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting socket via hook');
    socketService.disconnect();
    dispatch(setSocketConnected(false));
  }, [dispatch]);

  return {
    socket: socketService.getSocket(),
    isConnected: socketService.isConnected(),
    joinChat,
    leaveChat,
    sendMessage,
    markAsRead,
    disconnect
  };
};

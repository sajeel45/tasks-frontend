import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }  connect(userId, serverPath = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080') {
    if (this.socket && this.connected) {
      console.log('✅ Socket already connected, reusing existing connection');
      return this.socket;
    }

    if (this.socket && this.socket.connected) {
      console.log('✅ Socket instance exists and is connected, reusing...');
      this.connected = true;
      return this.socket;
    }

    if (!userId) {
      console.error('❌ Cannot connect socket: User ID not provided');
      return null;
    }

    console.log('🔌 Creating new socket connection to:', serverPath, 'for user:', userId);
    console.log('🔌 Environment variable VITE_SOCKET_URL:', import.meta.env.VITE_SOCKET_URL);

    // Clean up any existing socket before creating new one
    if (this.socket) {
      console.log('🧹 Cleaning up existing socket before creating new one');
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }

    // Get authentication token from localStorage
  const token = JSON.parse(localStorage.getItem("doctor-access-token"));
    console.log('🔑 Using token:', token ? 'Token available' : 'No token found');

    this.socket = io(serverPath, {
      auth: {
        userId: userId,
        token: token
      },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true
    });

    console.log('🔌 Socket instance created:', this.socket);
    this.setupDefaultListeners();
    return this.socket;
  }

  setupDefaultListeners() {
    if (!this.socket) return;

    console.log('🎧 Setting up socket listeners...');

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      console.log('✅ Socket transport:', this.socket.io.engine.transport.name);
      this.connected = true;
      this.triggerListener('connect', { socketId: this.socket.id });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.connected = false;
      this.triggerListener('disconnect', { reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      if (error.message && error.message.includes('Authentication error')) {
        console.error('🔐 Authentication failed - check token validity');
      }
      this.triggerListener('connect_error', { error });
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Socket reconnection attempt:', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Socket reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed');
    });

    // Chat events
    this.socket.on('new_message', (data) => {
      console.log('📨 New message received:', data);
      this.triggerListener('new_message', data);
    });

    this.socket.on('receive_message', (data) => {
      console.log('📨 Receive message event:', data);
      this.triggerListener('receive_message', data);
    });

    this.socket.on('new_message_notification', (data) => {
      console.log('📨 new message notification event:', data);
      this.triggerListener('new_message_notification', data);
    });

    this.socket.on('message_read_all', (data) => {
      console.log('👁️ Message read:', data);
      this.triggerListener('message_read_all', data);
    });

    this.socket.on('user_typing', (data) => {
      console.log('⌨️ User typing:', data);
      this.triggerListener('user_typing', data);
    });

    this.socket.on('user_stopped_typing', (data) => {
      console.log('✋ User stopped typing:', data);
      this.triggerListener('user_stopped_typing', data);
    });

    this.socket.on('user_online', (data) => {
      console.log('🟢 User online:', data);
      this.triggerListener('user_online', data);
    });

    this.socket.on('user_offline', (data) => {
      console.log('🔴 User offline:', data);
      this.triggerListener('user_offline', data);
    });

    // Debug: Log all events
    this.socket.onAny((event, ...args) => {
      console.log('🔔 Socket event received:', event, args);
    });

    console.log('🎧 Socket listeners setup complete');
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    // Check if callback already exists to prevent duplicates
    const callbacks = this.listeners.get(event);
    if (!callbacks.includes(callback)) {
      callbacks.push(callback);
      console.log(`➕ Added listener for ${event}, total: ${callbacks.length}`);
    } else {
      console.log(`⚠️ Listener for ${event} already exists, skipping duplicate`);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
        console.log(`➖ Removed listener for ${event}, remaining: ${callbacks.length}`);
      }
    }
  }

  triggerListener(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Chat actions
  joinChat(userId, receiverId) {
    if (!this.socket || !this.connected) {
      console.error('Socket not connected');
      return;
    }

    const chatRoom = this.generateChatRoom(userId, receiverId);

    console.log(`🚪 Joining chat room: ${chatRoom}`);
    this.socket.emit('join_chat', {
      chatRoom,
      userId,
      receiverId
    });
  }

  leaveChat(userId, receiverId) {
    if (!this.socket || !this.connected) {
      console.error('Socket not connected');
      return;
    }

    const chatRoom = this.generateChatRoom(userId, receiverId);

    console.log(`🚪 Leaving chat room: ${chatRoom}`);
    this.socket.emit('leave_chat', {
      chatRoom,
      userId,
      receiverId
    });
  }

  sendMessage(userId, messageData) {
    if (!this.socket || !this.connected) {
      console.error('Socket not connected');
      return;
    }

    const payload = {
      ...messageData,
      sender: userId,
      timestamp: new Date().toISOString()
    };

    console.log('📤 Sending message:', payload);
    this.socket.emit('send_message', payload);
  }

  markAsRead(userId, receiverId) {
    if (!this.socket || !this.connected) {
      console.error('Socket not connected');
      return;
    }

    console.log(`👁️ Marking as read - receiver: ${receiverId}`);
    this.socket.emit('mark_as_read_all', {
      receiverId,
    });
  }

  sendTyping(userId, receiverId) {
    if (!this.socket || !this.connected) return;

    this.socket.emit('typing', {
      receiverId,
      userId
    });
  }

  sendStoppedTyping(userId, receiverId) {
    if (!this.socket || !this.connected) return;

    this.socket.emit('stopped_typing', {
      receiverId,
      userId
    });
  }

  // Utility functions
  generateChatRoom(userId1, userId2) {
    return [userId1, userId2].sort().join('_');
  }

  isConnected() {
    return this.connected && this.socket && this.socket.connected;
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.listeners.clear();
    }
  }

  reset() {
    // Method to reset socket state (useful for debugging)
    console.log('🔄 Resetting socket service');
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }
    this.socket = null;
    this.connected = false;
    this.listeners.clear();
  }

  getSocket() {
    return this.socket;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;

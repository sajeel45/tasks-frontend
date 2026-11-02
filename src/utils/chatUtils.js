import { getId } from "./gloabalFunctions";

// Chat utility functions
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatChatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString();
  }
};

export const formatDateSeparator = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

export const formatLastMessage = (message) => {
  if (!message) return 'No messages yet';
  if (message.messageType === 'image') return '📷 Image';
  if (message.messageType === 'file') return '📎 File';
  return message.content;
};

export const shouldShowDateSeparator = (currentMessage, previousMessage) => {
  if (!previousMessage) return true;
  
  const currentDate = new Date(currentMessage.createdAt).toDateString();
  const previousDate = new Date(previousMessage.createdAt).toDateString();
  
  return currentDate !== previousDate;
};

export const generateChatId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

export const isOwnMessage = (message, currentUserId) => {
  return (getId(message.senderId)|| message.senderId) === currentUserId
};

export const getOtherParticipant = (chat, currentUserId) => {
  if (!chat.participants) return null;

  return chat.participants.find(participant =>
    getId(participant.userId) !== currentUserId && participant.userId !== currentUserId
  );
};

export const validateMessageContent = (content, messageType = 'text') => {
  if (messageType === 'text') {
    return content && content.trim().length > 0 && content.trim().length <= 1000;
  }
  return true; // For other message types, we assume they're already validated
};

export const createMessageObject = (chatId, content, messageType = 'text', senderId) => {
  return {
    chatId,
    content: content.trim(),
    messageType,
    senderId,
    createdAt: new Date().toISOString(),
    isRead: false,
    isEdited: false,
    isDeleted: false
  };
};

export const createNotificationObject = (type, title, message, data = {}) => {
  return {
    type,
    title,
    message,
    data,
    isRead: false,
    priority: 'medium',
    createdAt: new Date().toISOString()
  };
};
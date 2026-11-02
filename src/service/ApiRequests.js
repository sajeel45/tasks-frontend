import { APIurls } from "./constants.js";
import apiService from "./index.js";
import multipart from "./multipart.js";

export const ApiRequests = {
  //user Authentication
  login: async (data) => await apiService.post(APIurls.login, data),
  googleLogin: async () => await apiService.get(APIurls.googleLogin),
  logout: async (data) => await apiService.post(APIurls.logout, data),
  register: async (data) => await apiService.post(APIurls.register, data),
  authenticate: async () => await apiService.get(APIurls.authenticate),
  refreshTokens: async (data) => await apiService.post(APIurls.refreshTokens, data),
  revokeToken: async (data) => await apiService.post(APIurls.revokeToken, data),
  updateUser: async (data) => await apiService.patch(APIurls.updateUser, data),
  updateProfile : async (data) => await multipart.patch(APIurls.updateProfile ,data),
  // properties requests

  // doctor requests
  createDoctor: async (data) => await multipart.post(APIurls.doctor, data),
  getDoctors: async (params) => await apiService.get(APIurls.doctor, { params }),
  getDoctorById: async (id) => await apiService.get(APIurls.doctor + `/${id}`),
  deleteDoctor: async (id) => await apiService.delete(APIurls.doctor + `/${id}`),
  updateDoctor : async (id,data) => await multipart.patch(APIurls.doctor + `/${id}`,data),
  getAnalytics: async () => await apiService.get(APIurls.doctor + "/analytics"),
  getOngoingJobs: async (params) => await apiService.get(APIurls.doctor + "/ongoing-jobs", { params }),
  
  // doctor requests
  createPatient: async (data) => await multipart.post(APIurls.patient, data),
  getPatients: async (params) => await apiService.get(APIurls.patient, { params }),
  getPatientById: async (id) => await apiService.get(APIurls.patient + `/${id}`),
  deletePatient: async (id) => await apiService.delete(APIurls.patient + `/${id}`),
  updatePatient : async (id,data) => await multipart.patch(APIurls.patient + `/${id}`,data),

  // jobs requests
  createJob :  async (data) => await  apiService.post(APIurls.job,data),
  getJobs : async (params) =>  await apiService.get(APIurls.job,{params}),
  getAvailableJobs : async (params) =>  await apiService.get(APIurls.job + "/available",{params}),
  getJobById : async (id) => await apiService.get(APIurls.job + `/${id}`),
  updateJobById :  async (id, data) => await apiService.patch(APIurls.job + `/${id}`,data),
  deleteJob : async (id) =>  await apiService.delete(APIurls.job + `/${id}`),

  // application requests
  createApplication :  async (data) => await  apiService.post(APIurls.application, data),
  getApplications : async (params) => await apiService.get(APIurls.application, {params}),
  getContracts : async (params) => await apiService.get(APIurls.application + "/contracts", {params}),
  acceptApplication : async (id) => await apiService.patch(`${APIurls.application}/${id}/accept-application`),
  rejectApplication : async (id) => await apiService.delete(`${APIurls.application}/${id}/reject`),
  withdrawApplication : async (id) => await apiService.patch(`${APIurls.application}/${id}/withdraw`),
  
  // application requests
  
  // chat requests
  createChat: async (data) => await apiService.post(APIurls.chat, data),
  getChats: async (params) => await apiService.get(APIurls.chat, {params}),
  getChatById: async (chatId) => await apiService.get(`${APIurls.chat}/${chatId}`),
  getChatMessages: async (receiverId, params) => await apiService.get(`${APIurls.chat}/messages/${receiverId}`, {params}),
  sendMessage: async (chatId, data) => await apiService.post(`${APIurls.chat}/${chatId}/messages`, data),
  markMessagesAsRead: async (chatId) => await apiService.put(`${APIurls.chat}/${chatId}/read`),
  deleteMessage: async (messageId) => await apiService.delete(`${APIurls.chat}/messages/${messageId}`),
  getUnreadMessageCount: async () => await apiService.get(`${APIurls.chat}/unread-count`),
  // New methods needed by patient chat components
  sendChatMessage: async (data) => await apiService.post(`${APIurls.chat}/send`, data),
  getUserConversations: async (params) => await apiService.get(`${APIurls.chat}/conversations`, {params}),
  markChatAsRead: async (receiverId) => await apiService.patch(`${APIurls.chat}/read/${receiverId}`),
  getChatStats: async () => await apiService.get(`${APIurls.chat}/stats`),
  sendBackendMessage: async (data) => await apiService.post(`${APIurls.chat}/backend/send`, data),
  // chat requests

  // notification requests  
  getNotifications: async (params) => await apiService.get(APIurls.notifications, {params}),
  createNotification: async (data) => await apiService.post(APIurls.notifications, data),
  markNotificationAsRead: async (notificationId) => await apiService.put(`${APIurls.notifications}/${notificationId}/read`),
  markAllNotificationsAsRead: async () => await apiService.put(`${APIurls.notifications}/mark-all-read`),
  deleteNotification: async (notificationId) => await apiService.delete(`${APIurls.notifications}/${notificationId}`),
  getUnreadNotificationCount: async () => await apiService.get(`${APIurls.notifications}/unread-count`),
  // notification requests

  // invitations requests
  createInvitation: async (data) => await apiService.post(APIurls.invitation, data),
  getInvitations: async (params) => await apiService.get(APIurls.invitation, {params}),
  getInvitationById: async (id) => await apiService.get(`${APIurls.invitation}/${id}`),
  updateInvitationById: async (id, data) => await apiService.patch(`${APIurls.invitation}/${id}`, data),
  deleteInvitation: async (id) => await apiService.delete(`${APIurls.invitation}/${id}`),
  cancelInvitation: async (id) => await apiService.patch(`${APIurls.invitation}/${id}/cancel`),
  acceptInvitation: async (id) => await apiService.patch(`${APIurls.invitation}/${id}/accept`),
  rejectInvitation: async (id) => await apiService.patch(`${APIurls.invitation}/${id}/reject`),
  // payment requests
  checkoutPayment: async (data) => await apiService.post(`${APIurls.payment}/checkout`, data),
};



export const basePath = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080")+'/api';

export const APIurls = {
  login: "auth/login",
  googleLogin: "auth/google",
  refreshTokens: "auth/refresh-tokens",
  register: "auth/register",
  logout: "auth/logout",
  authenticate: "auth/authenticate",
  revokeToken: "auth/customToken/revoke",
  updateUser: "users/profile",
  updateProfile: 'auth/update/profile',
  properties: "property",
  patient: '/patient',
  job: '/job',
  application: '/application',
  chat: '/chat',
  notifications: '/notifications',
  invitation: '/invitation',
  doctor : '/doctor',
  payment : '/payment',
};


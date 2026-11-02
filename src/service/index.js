import axios from "axios";
import { basePath } from "./constants.js";
import { getId } from "../utils/gloabalFunctions.js";
const apiService = axios.create();
apiService.defaults.baseURL = basePath;
apiService.defaults.timeout = 350000;


// Add request interceptor
apiService.interceptors.request.use(
  async (config) => {
    let token = JSON.parse(localStorage.getItem("doctor-access-token"));
    let doctor = localStorage.getItem("doctor");
    if (doctor && doctor !== "undefined" && doctor !== "null") {
      try {
        doctor = JSON.parse(doctor);
      } catch (e) {
        console.error("error from services index.js", e);
      }
    } else {
      doctor = null;
    }

    console.log('🚀 ~ index.js:12 ~ token:', token);


    // Set headers with token
    config.headers = {
      Accept: "application/json, text/plain, */*",
      Authorization: token ? `Bearer ${token}` : "",
      "doctor-id": getId(doctor),
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "access-control-allow-headers": "*",
      "access-control-allow-methods": "*",
      "access-control-allow-origin": "*",
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
// apiService.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Refresh the token
//         const newToken = await refreshToken();

//         // Update token in local storage
//         localStorage.setItem("access-token", newToken);

//         // Set the new token in the request headers
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;

//         // Retry the original request
//         return apiService(originalRequest);
//       } catch (error) {
//         // Handle error while refreshing token
//         console.error("Error refreshing token:", error);
//         return Promise.reject(error);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default apiService;

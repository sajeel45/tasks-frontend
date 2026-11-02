import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ import this
import { store } from "./redux/store";

// import './index.css'
import App from "./App.jsx";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <BrowserRouter basename="/caregiver">
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

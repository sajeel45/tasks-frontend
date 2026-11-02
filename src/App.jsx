import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Link,
  useSearchParams,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

import LoginPage from "./pages/LoginPage";
import SIgnUpPage from "./pages/SIgnUpPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import JobPostPage from "./pages/JobPostPage";
import FindJobs from "./pages/FindJobs";
import MyContracts from "./pages/Dashboard/MyContracts";
import InvitationsPage from "./pages/Dashboard/InvitationsPage";
import MyJobsPage from "./pages/Dashboard/MyJobsPage";
import JobOffers from "./pages/Dashboard/JobOffers";
import ChatPage from "./pages/Dashboard/ChatPage";
import Jobdetail from "./pages/Dashboard/Jobdetail";
import Authenticated from "./layouts/authenticated";
import UnAuthenticated from "./layouts/UnAutheticated";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authenticateAsyncThunk } from "./redux/pagesSlices/authSlice";
import GlobalModals from "./components/GlobalModals";
import ProfilePage from "./pages/Dashboard/Profilepage";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";

function App() {
  const { user } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const tokensString = searchParams.get("tokens");
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      if (tokensString) {
        const tokens = JSON.parse(tokensString);
        localStorage.setItem(
          "doctor-access-token",
          JSON.stringify(tokens?.access?.token)
        );
        localStorage.setItem(
          "doctor-refresh-token",
          JSON.stringify(tokens?.refresh?.token)
        );
      }
      dispatch(authenticateAsyncThunk());
    }
  }, [dispatch, user, tokensString]);
  return (
    <>
      <Routes>
        <Route path="/home" element={<UnAuthenticated element={<Home />} />} />
        <Route path="/" element={<UnAuthenticated element={<LoginPage />} />} />
        <Route
          path="/sign-up"
          element={<UnAuthenticated element={<SIgnUpPage />} />}
        />
        <Route
          path="/onboarding"
          element={<Authenticated element={<Onboarding />} />}
        />
        <Route path="/callback" element={<GoogleAuthCallback />} />

        <Route
          path="/dashboard"
          element={<Authenticated element={<Dashboard />} />}
        >
          <Route index path="" element={<DashboardHome />} />
        </Route>
        {/* <Route path="*" element={<NoFound />} /> */}
      </Routes>
      <GlobalModals />

    </>
  );
}

export default App;

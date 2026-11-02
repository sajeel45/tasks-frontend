import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import LoadingComponent from "../components/LoadingComponent";
import { SocketProvider } from "../contexts/SocketContext";

export default function Authenticated({ element }) {
  const { user, loadings, profile } = useSelector((s) => s?.auth);
  console.log("🚀 ~ Authenticated ~ user:", user)
  console.log("userdsfdsfd", profile);

  const location = useLocation();
  if (
    !Object.keys(loadings)?.includes("authenticateAsyncThunk") ||
    loadings?.authenticateAsyncThunk
  ) {
    return <LoadingComponent />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (profile?.steps < 5 && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" />;
  }
  if (profile?.steps >= 5 && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" />;
  }

  return (
    <SocketProvider>
      {element}
    </SocketProvider>
  );
}

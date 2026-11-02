import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  authenticateAsyncThunk,
  userLogoutAsyncThunk,
} from "../redux/pagesSlices/authSlice";
import Spinner from "react-bootstrap/Spinner";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function GoogleAuthCallback() {
  const dispatch = useDispatch();
  const { loadings } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthentication = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenValue = queryParams.get("access_token");
    const refreshTokenValue = queryParams.get("refresh_token");
    const brandId = queryParams.get("brandId");
    if (tokenValue && refreshTokenValue) {
      const refreshToken = localStorage.getItem("refresh-token");
      if (refreshToken) {
        await dispatch(userLogoutAsyncThunk());
      }
      localStorage.setItem("doctor-access-token", tokenValue);
      localStorage.setItem("doctor-refresh-token", refreshTokenValue);
      localStorage.setItem("space", JSON.stringify({ id: brandId }));
      await dispatch(authenticateAsyncThunk()).then((action) => {
        const user = action?.payload?.user;
        if (user?.role !== "brand" && location.pathname !== "/restricted") {
          return navigate("/restricted");
        }
        navigate("/dashboard");
      });
    }
  };

  useEffect(() => {
    handleAuthentication();
  }, [dispatch]);

  return (
    <div className="d-flex justify-content-center">
      <Spinner
        animation="border"
        role="status"
        hidden={!loadings?.authenticateAsyncThunk}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

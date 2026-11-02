import React from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/icons/web-logo.png";
import googleIcon from "../assets/images/icons/google-icon.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { userRegisterAsyncThunk } from "../redux/pagesSlices/authSlice";
import { Spinner } from "react-bootstrap";
import { basePath } from "../service/constants";

export default function SIgnUpPage() {
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First Name is required")
      .min(3, "First Name must be at least 3 characters long")
      .max(30, "First Name must be at most 30 characters long"),
    lastName: Yup.string()
      .required("Last Name is required")
      .min(3, "Last Name must be at least 3 characters long")
      .max(30, "Last Name must be at most 30 characters long"),
    userName: Yup.string()
      .required("User Name is required")
      .min(3, "User Name must be at least 3 characters long")
      .max(30, "User Name must be at most 30 characters long"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long"),
    phoneNumber: Yup.string().required("Phone Number is required"),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((s) => s?.auth?.loadings?.userRegisterAsyncThunk);
  const handleSubmit = async () => {
    console.log("formik.values>>>", formik.values);

    const { firstName, lastName, userName, email, password, phoneNumber } =
      formik.values;
    const response = await dispatch(
      userRegisterAsyncThunk({
        firstName,
        lastName,
        userName,
        email,
        password,
        role: "doctor",
        phoneNumber,
      })
    );
    console.log("response>>>", response);
    if (response?.meta?.requestStatus === "fulfilled") {
      navigate("/onboarding");
    }
  };
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleAuthWithGoogle = () => {
    window.open(
      `${basePath + "/auth/google/doctor"}`,
      "_self"
    );
  };

  return (
    <div className="login-page sign-up-page">
      {/* <Header /> */}
      <div className="inner-page-wrapper">
        <div className="container">
          <div className="page-content-wrapper">
            <h3>Sign Up</h3>
            <form onSubmit={formik.handleSubmit} className="form">
              <div className="logo-wrapper">
                <img src={logo} alt="logo" />
                <strong>Where Quality Homecare Meets Peace of Mind.</strong>
              </div>
              <div className="field-wrapper">
                <div className="form-wrapper">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <div className="formik-error">
                      {formik.errors.firstName}
                    </div>
                  )}
                </div>
              </div>
              <div className="field-wrapper">
                <div className="form-wrapper">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name "
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <div className="formik-error">{formik.errors.lastName}</div>
                  )}
                </div>
              </div>
              <div className="field-wrapper">
                <div className="form-wrapper">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="User Name  "
                    name="userName"
                    value={formik.values.userName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.userName && formik.errors.userName && (
                    <div className="formik-error">{formik.errors.userName}</div>
                  )}
                </div>
              </div>
              <div className="field-wrapper">
                <div className="form-wrapper">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Email  "
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="formik-error">{formik.errors.email}</div>
                  )}
                </div>
              </div>
              <div className="field-wrapper">
                <div className="form-wrapper">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="formik-error">{formik.errors.password}</div>
                  )}
                </div>
              </div>
              <div className="field-wrapper">
                <div className="form-wrapper">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Password"
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <div className="formik-error">
                      {formik.errors.phoneNumber}
                    </div>
                  )}
                </div>
              </div>

              <div className="btn-wrapper">
                <button type="submit" className="btn-style">
                  {loading ? <Spinner size="sm" /> : "Create Account"}
                </button>
                <button onClick={handleAuthWithGoogle} type="button" className="google-login-btn btn-style transparent">
                  {" "}
                  <img src={googleIcon} alt="googleIcon" /> Google Login
                </button>
              </div>
            </form>
            <div className="bottom-text">
              <span className="black">
                Already have an account? <Link to="/">Login</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

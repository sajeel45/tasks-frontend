import React from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/icons/web-logo.png"
import googleIcon from "../assets/images/icons/google-icon.svg"
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { userLoginAsyncThunk } from "../redux/pagesSlices/authSlice";
import { Spinner } from "react-bootstrap";
import { basePath } from "../service/constants";

export default function LoginPage() {
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = () => {
        console.log("formik.values>>>", formik.values);

        dispatch(userLoginAsyncThunk({
            email: formik.values.email,
            password: formik.values.password,
            role: "doctor",
            router: () => navigate('/dashboard')
        }));
    };
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: handleLogin,
        validationSchema,
    });
    console.log("🚀 ~ LoginPage ~ formik:", formik?.errors)
    const loading = useSelector((s) => s?.auth?.loadings?.userLoginAsyncThunk)

    const handleAuthWithGoogle = () => {
    window.open(
      `${basePath + "/auth/google/doctor"}`,
      "_self"
    );
  };

    return (
        <div className="login-page">
            {/* <Header /> */}
            <div className="inner-page-wrapper">
                <div className="container">
                    <div className="page-content-wrapper">
                        <h3>Login</h3>
                        <form onSubmit={formik.handleSubmit} className="form">
                            <div className="logo-wrapper">
                                <img src={logo} alt="logo" />
                                <strong>
                                    Where Quality Homecare Meets Peace of Mind.
                                </strong>
                            </div>
                            <div className="field-wrapper">
                                <div className="form-wrapper">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="form-control"
                                        placeholder="Enter Email"
                                    />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <div className="formik-error">{formik.errors?.email}</div>
                                )}
                            </div>
                            <div className="field-wrapper">
                                <div className="form-wrapper">
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={formik.handleChange}
                                        value={formik.values.password}
                                        onBlur={formik.handleBlur}
                                        className="form-control"
                                        placeholder="Password"
                                    />
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <div className="formik-error">{formik.errors?.password}</div>
                                )}
                            </div>
                            <div className="bottom-text">
                                <Link to="/forgot-password" className="black">Forgot password?</Link>
                            </div>
                            <div className="btn-wrapper">
                                <button type="submit" className="btn-style">
                                    {loading ? <Spinner size="sm" /> : "Login"}
                                </button>
                                <button onClick={handleAuthWithGoogle} type="button" className="google-login-btn btn-style transparent"> <img src={googleIcon} alt="googleIcon" /> Google Login</button>
                            </div>
                        </form>

                        <div className="bottom-text">
                            <span className="black">Don't have an Account? Sign up here <Link to="/sign-up">Sign Up</Link></span>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}
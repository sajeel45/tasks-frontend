import React from "react";


import { FiSearch } from "react-icons/fi";
import { FaBell } from "react-icons/fa";

import { FaRegBell } from "react-icons/fa";


import profileImg from '../assets/images/doctor-profile-img.jpg'

import logo from '../assets/images/icons/web-logo.png'
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="header">
            <div className="">
                <div className="row">
                    <div className="col-md-3 align-self-center">
                        <div className="logo-wrapper">
                            <Link to="/dashboard">
                                <img src={logo} alt="logo" />
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-6 align-self-center">
                        <div className="menu-wrapper">
                            <ul className="menu">
                                <li><a href="#" className="active">Home</a></li>
                                <li><a href="#">About</a></li>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Help</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-3 align-self-center">
                        <div className="right-menu-wrapper">
                            
                            <div className="notifications-wrapper">
                                <div className="notification-icon">
                                    <FaRegBell />
                                    <span className="notifications">6</span>
                                </div>
                            </div>
                            <div className="user-info">
                                <div className="avatar-wrapper">
                                    <img src={profileImg} alt="profileImg" />
                                </div>
                                <div className="name">
                                    <strong className="white">Admin</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

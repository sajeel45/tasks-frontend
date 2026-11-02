import React, { useState, useRef } from "react";

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Link, useLocation, useNavigate } from "react-router-dom";

import logo from '../assets/images/icons/web-logo.png'

import { FiSearch } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import { IoChatboxEllipses } from "react-icons/io5";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { BsEnvelopeArrowDown } from "react-icons/bs";
import { RiExchangeDollarFill } from "react-icons/ri";
import { HiOutlinePaperAirplane } from "react-icons/hi";

import { FaRegUserCircle } from "react-icons/fa";
import { GoGear } from "react-icons/go";
import { BiLogOut } from "react-icons/bi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

import { menuItems } from "../utils/constants";

import profileImg from '../assets/images/doctor-profile-img.jpg'
import NotificationComponent from "./NotificationsComponent";
import Settingmodel from "../Modals/Settingmodel";
import { useDispatch, useSelector } from "react-redux";
import { userLogoutAsyncThunk } from "../redux/pagesSlices/authSlice";
import { parseImagePath } from "../utils/gloabalFunctions";

export default function DashboardHeader() {
  const { profile } = useSelector((state) => state.auth);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const navigate = useNavigate();
  const [hasNotification, setHasNotification] = useState(true);
  const [showNotification, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();

  const showNotificationsHandler = () => {
    setShowNotifications(true);
  };
  const hideNotificationsHandler = () => {
    setShowNotifications(false);
  };

  const handleShowInviteModal = () => setShowInviteModal(true);
  const handleCloseInviteModal = () => setShowInviteModal(false);

  const handleLogout = () => {
    dispatch(
      userLogoutAsyncThunk({
        router: () => navigate('/')
      })
    )
  }

  return (
    <>

      <div className="dashboard-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 align-self-center">
              <div onClick={() => navigate("/dashboard")} className="logo-wrapper">
                <a href="#">
                  <img src={logo} alt="logo" />
                </a>
                <div className="text-wrapper">
                  <h6>AllCareMatch</h6>
                  <p>Homecare Marketplace</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 align-self-center">
              <div className="menu-wrapper">
                <ul className="menu">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={
                          location.pathname === item.path ? "active" : ""
                        }
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-3 align-self-center">
              <div className="right-menu-wrapper">
                <ul className="menu">
                  <li><a href="#" onClick={showNotificationsHandler}>
                    <IoMdNotificationsOutline />
                    {/* <span className="notifications">6</span> */}
                  </a></li>
                  <li>
                    <Link to="/dashboard/chat">
                      <IoChatbubbleEllipsesOutline />
                      {/* <span className="notifications">2</span> */}
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/invitations">
                      <HiOutlinePaperAirplane style={{ transform: "rotate(140deg)" }} />
                      {/* <span className="notifications">8</span> */}
                    </Link>
                  </li>
                  <li >
                    <div className="user-info">
                      <div className="avatar-wrapper">
                        <img src={profile?.avatar ? parseImagePath(profile?.avatar) : profileImg} alt="profileImg" />
                      </div>
                      <div className="name">
                        <DropdownButton
                          id={`dropdown-button-drop-down`}
                          drop={'down'}
                          variant="secondary"
                          title={`${profile?.firstName}`}
                        >
                          <Link to="/dashboard/profile" className="dropdown-item"><FaRegUserCircle /> Profile </Link>
                          {/* <Dropdown.Item onClick={handleShowInviteModal}><GoGear /> Settings</Dropdown.Item> */}
                          {/* <Dropdown.Item eventKey="3"><RiExchangeDollarFill /> Subscription</Dropdown.Item> */}
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={handleLogout} eventKey="4" className="red"><BiLogOut /> Logout</Dropdown.Item>
                        </DropdownButton>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NotificationComponent
        hasNotification={hasNotification}
        showNotification={showNotification}
        hideNotificationsHandler={hideNotificationsHandler}
        notificationRef={notificationRef}
      />
      <Settingmodel show={showInviteModal} handleClose={handleCloseInviteModal} />


    </>
  )
}

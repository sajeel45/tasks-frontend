import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";

import { Spinner } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import settingIcon from "../assets/images/icons/settings-light-icon.svg";
import xIcon from "../assets/images/icons/x-icon.svg";
import NoNotificationComponent from "./NoNotificationComponent";

import avatarIcon from '../assets/images/doctor-profile-img.jpg'

export default function NotificationComponent({
  notifications,
  showNotification,
  hideNotificationsHandler,
  notificationRef,
}) {
  return (
    <div
      className={`notification-main-wrapper ${showNotification ? "show" : ""}`}
      ref={notificationRef}
    >
      <div className="title-wrapper">
        <div className="title">
          <strong className="dark large medium-bold">Notifications</strong>
        </div>
        <ul className="list">
          <li>
            <Link to="/dashboard/settings" onClick={hideNotificationsHandler}>
              <img src={settingIcon} alt="settingIcon" />
            </Link>
          </li>
          <li>
            <a href="#" onClick={hideNotificationsHandler}>
              <img src={xIcon} alt="xIcon" />
            </a>
          </li>
        </ul>
      </div>
      <div className="notification-list-wrapper">
        <div className="notifications-wrapper">
          <div className="inner-wrapper">
            <div className="notification-list-title-wrapper">
              <span>TODAY</span>
              <div className="right-menu-wrapper">
                <span className="small">Show only unread</span>
                <div className="custom-toggle-switch-wrapper">
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                </div>
                <a href="#" className="blue">
                  Mark all as read
                </a>
              </div>
            </div>
            <div className="all-listings-wrapper">
              <div
                className={`notification-wrapper  notifications `}
              >
                <div className="avatar-icon">
                  <a href="#">
                    <img
                      src={avatarIcon}
                      alt="avatarIcon"
                    />
                  </a>
                </div>
                <div className="text-wrapper">
                  <strong className="dark">
                    Name
                  </strong>
                  <span className="time">
                    Just now
                  </span>
                </div>
              </div>
            </div>
            <div className="notification-list-title-wrapper">
              <span>OLDER</span>
            </div>
            <div className="all-listings-wrapper">
              <div
                className={`notification-wrapper notifications`}
              >
                <div className="avatar-icon">
                  <a href="#">
                    <img
                      src={avatarIcon  }
                      alt="avatarIcon"
                    />
                  </a>
                </div>
                <div className="text-wrapper">
                  <strong className="dark">
                    Name
                  </strong>
                  <span className="time">
                    Just now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="view-all-notifications-btn-wrapper">
          <button className="view-all-notification-btn">
            View all notifications
          </button>
        </div>
        {/* <NoNotificationComponent /> */}
      </div>
    </div>

  );
}

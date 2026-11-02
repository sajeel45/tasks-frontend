import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { Button, Spinner } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import { HiArrowRight } from "react-icons/hi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { GiProgression } from "react-icons/gi";

import { FaArrowRight } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { MdOutlineSort } from "react-icons/md";

import doctorIimg from "../../assets/images/doctor-profile-img.jpg";
import userPinkIcon from "../../assets/images/icons/user-pink-icon.svg";
import doctorImg from "../../assets/images/doctor-profile-img.jpg";
import { BsCurrencyExchange } from "react-icons/bs";
import { MdLibraryAddCheck } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getAnalyticsAsyncThunk,
  getOngoingJobsAsyncThunk,
} from "../../redux/pagesSlices/doctorSlice";
import NoDataFound from "../../components/Common/NoDataFound";
import {
  getFullName,
  getUserLevel,
  parseImagePath,
} from "../../utils/gloabalFunctions";
import { FaHospitalUser } from "react-icons/fa6";
import doctorprofile from "../../assets/images/doctor-profile-img.jpg";
import moment from "moment";
import { fetchUserConversations } from "../../redux/pagesSlices/chatSlice";

export default function DashboardHome() {
  const { analytics, ongoingJobs, loadings } = useSelector(
    (state) => state?.doctor
  );
  const { profile } = useSelector((state) => state?.auth);
  console.log("Doctor Data:", profile);
  const conversations = useSelector((state) => state.chat.conversations);
  const chatLoading = useSelector(
    (state) => state.chat.loadings.fetchUserConversations
  );
  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return "";

    const messageTime = moment(timestamp);
    const now = moment();
    const diffDays = now.diff(messageTime, "days");

    if (diffDays === 0) {
      return messageTime.format("HH:mm");
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return messageTime.format("ddd");
    } else {
      return messageTime.format("MMM DD");
    }
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return "";
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserConversations({ limit: 10 }));
    dispatch(getAnalyticsAsyncThunk({}));
    dispatch(getOngoingJobsAsyncThunk({}));
  }, [dispatch]);
  return (
    <div className="dashboard-inner-main">
      <div className="dashboard-pages">
        <div className="dashboard-home-page">
          <div className="inner-page-wrapper">
            <div className="container-fluid">
              <div className="dashboard-cards-wrapper">
                <div className="row">
                  <div className="col-md-3">
                    <div className="card-wrapper">
                      <div className="main-wrapper">
                        <div className="text-wrapper">
                          <span>Ongoing Jobs</span>
                          <h4>{analytics?.ongoingJobsCount || 0}</h4>
                        </div>
                        <div className="icon-wrapper pink-bg">
                          <img src={userPinkIcon} alt="userPinkIcon" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card-wrapper">
                      <div className="main-wrapper">
                        <div className="text-wrapper">
                          <span>Applied jobs count</span>
                          <h4>{analytics?.totalApplications || 0}</h4>
                        </div>
                        <div className="icon-wrapper orange-bg">
                          <MdLibraryAddCheck />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card-wrapper">
                      <div className="main-wrapper">
                        <div className="text-wrapper">
                          <span>Revenue Generated</span>
                          <h4>$ {analytics?.amountReceived || 0}</h4>
                        </div>
                        <div className="icon-wrapper green-bg">
                          <BsCurrencyExchange />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card-wrapper">
                      <div className="main-wrapper">
                        <div className="text-wrapper">
                          <span>Success Percentage </span>
                          <h4>{analytics?.successPercentage || 0}%</h4>
                        </div>
                        <div className="icon-wrapper light-brown">
                          <GiProgression />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dashboard-content-wrapper">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="card-section-wrapper">
                      <div className="doctor-profile-card ">
                        <div className="profile-section">
                          <div className="profile-avatar">
                            <img
                              src={
                                profile?.avatar
                                  ? parseImagePath(profile?.avatar)
                                  : doctorprofile
                              }
                              alt="profile"
                            />
                          </div>
                          <h6 className="semibold">{getFullName(profile)}</h6>
                          <p>{profile?.professionalTitle}</p>
                          {/* <button className="btn-style full">
                            View Profile
                          </button> */}
                        </div>

                        <div className="total-patient-box">
                          <div className="box-wrapper">
                            <div className="icon-wrapper">
                              <FaHospitalUser />
                            </div>
                            <h5>{analytics?.acceptedApplications}</h5>
                            <p>Total Patients</p>
                          </div>
                        </div>
                        <div className="overview-section">
                          <div className="overview-heading">
                            <h6>Level overview</h6>
                          </div>
                          <div className="overview-section-box">
                            <div className="flex-box">
                              <p>My level</p>
                              <span className="status">
                                {getUserLevel(analytics)}
                              </span>
                            </div>
                            <div className="flex-box">
                              <p>Rating</p>
                              <span>
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    color={
                                      i <
                                      Math.floor(analytics?.averageRating || 0)
                                        ? "#FFD700"
                                        : "#e4e5e9"
                                    }
                                  />
                                ))}
                              </span>
                            </div>
                            <div className="flex-box">
                              <p>Success Percentage</p>
                              <span>{analytics?.successPercentage || 0}%</span>
                            </div>
                          </div>
                          {/* <div className="btn-style full mt-3">
                            View profile
                          </div> */}
                        </div>
                        <div className="overview-section">
                          <div className="overview-heading">
                            <h6>Earnings</h6>
                          </div>
                          <div className="overview-section-box">
                            <div className="flex-box">
                              <p>Total earnings</p>
                              <span>${analytics?.amountReceived}</span>
                            </div>
                            <div className="flex-box">
                              <p>Ongoing jobs</p>
                              <span>$ {analytics?.earningFromOngoingJobs}</span>
                            </div>
                            <div className="flex-box">
                              <p>Completed jobs</p>
                              <span>$ {analytics?.amountReceived}</span>
                            </div>
                          </div>
                          <div className="btn-style fuck-designers full mt-3">
                            <Link
                              className="text-white"
                              to="/dashboard/profile"
                            >
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="dashboard-chart-main-wrapper">
                      <div className="ongoing-jobs-section">
                        <div className="title-wrapper">
                          <h4>Ongoing Jobs</h4>
                        </div>
                        {loadings?.myongoingsJobsThunk ? (
                          <div className="d-flex justify-content-center p-4">
                            <Spinner animation="border" variant="primary" />
                          </div>
                        ) : ongoingJobs?.length === 0 ? (
                          <NoDataFound />
                        ) : (
                          <div className="listings-wrapper">
                            {ongoingJobs?.map((job, index) => (
                              <div
                                key={job?.id || index}
                                className="job-wrapper"
                              >
                                <div className="job-info">
                                  <div className="img-wrapper">
                                    <img
                                      src={
                                        job?.patientId?.image
                                          ? parseImagePath(
                                              job?.patientId?.image
                                            )
                                          : doctorImg
                                      }
                                      alt="jobImg"
                                    />
                                  </div>
                                  <div className="text-wrapper">
                                    <strong>
                                      {getFullName(job?.patientId) ||
                                        "Patient Name"}
                                    </strong>
                                    <ul className="list">
                                      <li>
                                        <IoLocationSharp />{" "}
                                        {job?.jobId?.location || "Location"}
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="job-title-wrapper">
                                  Job:{" "}
                                  <strong>{job?.jobId?.title || "N/A"}</strong>
                                </div>
                                <div className="budget-wrapper">
                                  Budget: <span>${job?.budget || 0}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div class="appointments-section-main-wrapper">
                      <div class="messages-section">
                        <div class="section-header">
                          <h6>Recent Messages</h6>
                          <button className="btn-style">View All</button>
                        </div>
                        {chatLoading ? (
                          <div className="d-flex justify-content-center p-4">
                            <Spinner animation="border" variant="primary" />
                          </div>
                        ) : conversations.length === 0 ? (
                          <NoDataFound />
                        ) : (
                          (conversations.length >3 ? conversations.slice(3): conversations).map((conversation, index) => (
                            <div className="message-card" key={index}>
                              <div className="avatar">
                                <img
                                  src={
                                    parseImagePath(
                                      conversation.otherUser?.avatar || conversation?.profile?.image
                                    ) || doctorprofile
                                  }
                                  alt="proflie"
                                />
                              </div>
                              <div className="message-info">
                                <h6>
                                  {conversation.otherUser.firstName +
                                    " " +
                                    conversation.otherUser.lastName}
                                </h6>
                                <p>
                                  {" "}
                                  {conversation.latestMessage ? (
                                    <>
                                      {conversation.latestMessage
                                        .messageType === "text" ? (
                                        truncateMessage(
                                          conversation.latestMessage.message
                                        )
                                      ) : (
                                        <span className="text-muted">
                                          📎{" "}
                                          {
                                            conversation.latestMessage
                                              .messageType
                                          }
                                        </span>
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-muted">
                                      No messages yet
                                    </span>
                                  )}
                                </p>
                              </div>
                              <span className="time">
                                {formatLastMessageTime(
                                  conversation.latestMessage?.createdAt ||
                                    conversation.updatedAt
                                )}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="ongoing-jobs-section">
                <div className="title-wrapper">
                  <h4>Ongoing Jobs</h4>
                </div>
                {loadings?.myongoingsJobsThunk ? (
                  <div className="d-flex justify-content-center p-4">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : ongoingJobs?.length === 0 ? (
                  <NoDataFound />
                ) : (
                  <div className="listings-wrapper">
                    {ongoingJobs?.map((job, index) => (
                      <div key={job?.id || index} className="job-wrapper">
                        <div className="job-info">
                          <div className="img-wrapper">
                            <img src={job?.patientId?.image ? parseImagePath(job?.patientId?.image) : doctorImg} alt="jobImg" />
                          </div>
                          <div className="text-wrapper">
                            <strong>{getFullName(job?.patientId) || "Patient Name"}</strong>
                            <ul className="list">
                              <li>
                                <IoLocationSharp /> {job?.jobId?.location || "Location"}
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="job-title-wrapper">
                          Job: <strong>{job?.jobId?.title || "N/A"}</strong>
                        </div>
                        <div className="budget-wrapper">
                          Budget: <span>${job?.budget || 0}</span>
                        </div>
                       
                      </div>
                    ))}
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

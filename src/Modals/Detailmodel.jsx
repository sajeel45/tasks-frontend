import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoLocationSharp } from "react-icons/io5";
import { FaClock } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import { BiDollar } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux';
import { handleModel } from "../redux/layoutSlices/modelSlice";
import { dateFormat, getId, timeFormat } from "../utils/gloabalFunctions";
import { createApplicationAsyncThunk } from '../redux/pagesSlices/applicationSlice';
import { getJobByIdAsyncThunk } from '../redux/pagesSlices/jobSlice';
import { FaRegCalendarAlt } from "react-icons/fa";


const DetailSidebar = ({
  show,
  modelKey = "jobDetailModal",
  jobDetail = {},
}) => {
  const dispatch = useDispatch();
  const { job } = useSelector((state) => state.jobs);
  const { loadings } = useSelector((state) => state.application);
  console.log("🚀 ~dsd job:", job)

  useEffect(() => {
    if (getId(jobDetail)) {
      dispatch(
        getJobByIdAsyncThunk(getId(jobDetail))
      );
    }
  }, [jobDetail, dispatch]);


  const handleClose = () => {
    dispatch(
      handleModel({
        model: modelKey,
        state: false,
        args: {
          jobDetail: {},
        },
      })
    );
  };

  const handleApplyNow = () => {
    const data = {
      jobId: getId(jobDetail),
      patientId: getId(job?.postedBy),
      budget: jobDetail?.budget,
      location: jobDetail?.location,
      schedule: jobDetail?.schedule,
    };
    dispatch(createApplicationAsyncThunk({
      data,
      callBack: () => {
        handleClose();
      }
    }));
  };

  return (
    <>
      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${show ? 'show' : ''}`} onClick={handleClose}></div>
      
      {/* Detail Sidebar */}
      <div className={`detail-sidebar ${show ? 'show' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <button className="close-btn" onClick={handleClose}>
            <IoClose />
          </button>
          <h2>Job Details</h2>
          {/* <Link 
            to={`/dashboard/job-detail/${getId(jobDetail)}`}
            className="view-details-link"
            onClick={handleClose}
          >
            View Full Details
          </Link> */}
        </div>

        {/* Sidebar Body */}
        <div className="sidebar-body">
          <div className="short-info-wrapper">
            <h3>Short Info</h3>
            <div className="text-wrapper">
              <div className="text">
                <div className="icon">
                  <BiDollar />
                </div>
                <strong>Budget</strong>
              </div>
              <span>${jobDetail?.budget}</span>
            </div>
            <div className="text-wrapper">
              <div className="text">
                <div className="icon">
                  <IoLocationSharp />
                </div>
                <strong>Location</strong>
              </div>
              <span>{jobDetail?.location}</span>
            </div>
            <div className="text-wrapper">
              <div className="text">
                <div className="icon">
                  <FaRegCalendarAlt />
                </div>
                <strong>From</strong>
              </div>
              <span>{dateFormat(jobDetail?.from)}</span>
            </div>
            <div className="text-wrapper">
              <div className="text">
                <div className="icon">
                  <FaRegCalendarAlt />
                </div>
                <strong>To</strong>
              </div>
              <span>{dateFormat(jobDetail?.to)}</span>
            </div>
            <div className="text-wrapper">
              <div className="text">
                <div className="icon">
                  <FaClock />
                </div>
                <strong>Time</strong>
              </div>
              <span>{timeFormat(jobDetail?.time)}</span>
            </div>
          </div>
          
          <div className="job-description-wrapper">
            <h3>Job Detail</h3>
            <div className="detail-wrapper">
              <strong>Job Description</strong>
              <p>{jobDetail?.description}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button className="btn-style transparent" onClick={handleClose}>
            Close
          </button>
          <button 
            className='btn-style' 
            disabled={loadings?.createApplicationAsyncThunk || job?.application} 
            onClick={handleApplyNow}
          >
            {loadings?.createApplicationAsyncThunk
              ? "Applying..."
              : !job?.application
                ? "Apply Now"
                : "Already Applied"
            }
          </button>
        </div>
      </div>
    </>
  );
};

export default DetailSidebar;

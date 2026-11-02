import React from "react";

import { Link } from "react-router-dom";

import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

import Header from "../components/Header";
import { FaHeart } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { MdOutlineSort } from "react-icons/md";

import doctorIimg from "../assets/images/doctor-profile-img.jpg";

const jobCards = [
  {
    id: 1,
    name: "Dr. Paul Abramson MD",
    specialty: "Neurologist",
    rating: 4.8,
    fee: "$10",
    experience: "2+ Years",
    successRate: "9%",
    status: "pending",
    specializations: ["Epilepsy", "Stroke", "Multiple Sclerosis"],
  },
  {
    id: 2,
    name: "Dr. Emily Watson",
    specialty: "Cardiologist",
    rating: 4.9,
    fee: "$15",
    experience: "5+ Years",
    successRate: "95%",
    status: "active",
    specializations: ["Heart Failure", "Arrhythmia", "Coronary Artery Disease"],
  },
  {
    id: 3,
    name: "Dr. Raj Patel",
    specialty: "Dermatologist",
    rating: 4.6,
    fee: "$12",
    experience: "3+ Years",
    successRate: "88%",
    status: "on hold",
    specializations: ["Acne", "Eczema", "Skin Cancer"],
  },
  {
    id: 4,
    name: "Dr. Anna Lopez",
    specialty: "Pediatrician",
    rating: 4.7,
    fee: "$8",
    experience: "4+ Years",
    successRate: "92%",
    status: "pending",
    specializations: [
      "Child Nutrition",
      "Immunization",
      "Developmental Disorders",
    ],
  },
  {
    id: 5,
    name: "Dr. Michael Chan",
    specialty: "Psychiatrist",
    rating: 4.5,
    fee: "$20",
    experience: "6+ Years",
    successRate: "85%",
    status: "active",
    specializations: ["Depression", "Anxiety", "Bipolar Disorder"],
  },
  {
    id: 6,
    name: "Dr. Susan Wright",
    specialty: "Orthopedic Surgeon",
    rating: 4.9,
    fee: "$25",
    experience: "10+ Years",
    successRate: "98%",
    status: "available",
    specializations: ["Joint Replacement", "Spine Surgery", "Sports Injuries"],
  },
];

export default function Home() {
  return (
    <div className="home-page">
      <Header />
      <div className="inner-page-wrapper">
        <div className="tabs-and-filter-bar-main-wrapper">
          <div className={`container`}>
            <div className="row">
              <div className="col-xl-7 col-md-5 align-self-center mb-4 mb-md-0">
                <div className="nav-tabs-main-wrapper">
                  <ul className="tabs-wrapper">
                    <li className="active">
                      <a href="#">Hired</a>
                    </li>
                    <li>
                      <a href="#">In Progress</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-5 col-md-7 align-self-center">
                <div className="right-menu-wrapper">
                  <div className="search-bar-wrapper">
                    <FiSearch className="search-icon" />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                    />
                  </div>
                  <div className="filter-and-view-wrapper">
                    <div className="sort-by-wrapper">
                      <strong>
                        <MdOutlineSort /> Sort by:{" "}
                      </strong>
                      <DropdownButton
                        id={`dropdown-button-drop-down`}
                        drop={"down"}
                        variant="secondary"
                        title={"Neurologist"}
                        className="extra-left-space"
                      >
                        <Dropdown.Item eventKey="createdAt:desc">
                          Neurologist
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="createdAt:asc">
                          {" "}
                          Oldest First
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="jobTitle:asc">
                          A-Z
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="jobTitle:desc">
                          Z-A
                        </Dropdown.Item>
                      </DropdownButton>
                      {/* <img src={filterIcon} alt="filterIcon" className="filter-icon" /> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {jobCards.map((job) => (
              <div className="col-md-4 mb-4" key={job.id}>
                <div className="job-card-main-wrapper">
                  <div className="job-img-wrapper">
                    <Link to="#">
                      <img src={doctorIimg} alt="jobImg" className="job-img" />
                    </Link>
                  </div>
                  <div className="job-content-wrapper">
                    <div className="brand-top-info">
                      <div className="platforms-wrapper">
                        <div className="platform light-gray-bg">
                          <FaHeart />
                          <span>{job.specialty}</span>
                        </div>
                      </div>
                      <div className="job-status">
                        <span className="status">{job.status}</span>
                      </div>
                    </div>
                    <div className="job-title-wrapper">
                      <strong className="dark">
                        <Link to="#">{job.name}</Link>
                      </strong>
                    </div>
                    <div className="short-info">
                      <div className="specializations">
                        {job.specializations.map((spec, index) => (
                          <span
                            key={index}
                            style={{
                              display: "inline-block",
                              backgroundColor: "#f1f1f1",
                              padding: "4px 8px",
                              margin: "2px",
                              borderRadius: "12px",
                              fontSize: "12px",
                            }}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="short-description-wrapper">
                      <div className="text">
                        <span>Ratings</span>
                        <strong className="small">
                          <FaStar style={{ color: "#FEDA74" }} /> {job.rating}
                        </strong>
                      </div>
                      <div className="text">
                        <span>Rate / hr</span>
                        <strong className="small">{job.fee}</strong>
                      </div>
                      <div className="text">
                        <span>Experience</span>
                        <strong className="small">{job.experience}</strong>
                      </div>
                      <div className="text">
                        <span>Success Rate</span>
                        <strong className="small">{job.successRate}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="apply-now-btn">
                    <Link to="#" className="btn-style full">
                      View details
                      <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

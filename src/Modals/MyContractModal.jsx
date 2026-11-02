import React from "react";
import { Modal, Button } from "react-bootstrap";
import doctorImg from '../assets/images/doctor-profile-img.jpg'
import { IoLocation } from "react-icons/io5";
import { BsCurrencyDollar } from "react-icons/bs";
import { LuClock4 } from "react-icons/lu";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useDispatch } from "react-redux"; 
import { handleModel } from "../redux/layoutSlices/modelSlice"; 

const MyContractModal = ({
  show,
  modelKey = "myContractModal",
}) => {
  const dispatch = useDispatch(); 

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
  return (
    <Modal show={show} onHide={handleClose} centered className="invitation-modal-updated contract-modal">
      {/* Modal Header */}
      <Modal.Header closeButton>
        <Modal.Title><strong ><a href="#">Contract Details</a></strong></Modal.Title>
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body>
        <div className="modal-body-wrapper">
          <div class="task-card">
            <div class="task-status">
              <span class="badge pending">Pending</span>
              <span class="start-date">Started: Dec 10, 2023</span>
            </div>
            <button class="mark-complete-btn"><IoMdCheckmarkCircleOutline/> Mark as Complete
            </button>
          </div>

          <div className="main-info-wrapper" >
            <h6>Doctor Details</h6>
            <div className="user-info">
              <div className="img-wrapper">
                <img src={doctorImg} alt="doctorImg" />
              </div>
              <div className="text-wrapper">
                <strong>Dr. Paul Abramson MD </strong>
                <p>Cardiology</p>
                <span>2+ Years</span>
              </div>
            </div>
            <div className="features-wrapper">
              <div className="info-row">
                <strong>Rating</strong>
                <span> 4.8</span>
              </div>
              <div className="info-row">
                <strong>Success Rate</strong>
                <span className="green medium_weight">95%</span>
              </div>
              <div className="info-row">
                <strong>Hourly Rate</strong>
                <span>$150/hour</span>
              </div>
            </div>
          </div>

          <div className="main-info-wrapper">
            <h6>Job Details</h6>
            <div className="user-info">

              <div className="text-wrapper">
                <strong className="mb-0">Senior Cardiologist Position </strong>
                <span className="small">Full-time cardiology position with competitive benefits and flexible scheduling.</span>
              </div>
            </div>
            <div className="features-wrapper">
              <div className="info-row">
                <strong className="location"><div className="icon-wrapper"><IoLocation /></div> Location</strong>
                <span>New York Medical Center</span>
              </div>
              <div className="info-row">
                <strong className="location"><div className="icon-wrapper"><BsCurrencyDollar /></div>Budget</strong>
                <span>$10k</span>
              </div>
              <div className="info-row">
                <strong className="location"><div className="icon-wrapper"><LuClock4 /></div>Type</strong>
                <span>Full-time</span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      {/* Modal Footer */}
      <Modal.Footer>
        <Button className="btn-style" onClick={handleClose}>
          Close
        </Button>
        {/* <Button className="btn-style rounded" onClick={handleClose}>
          Send Invite
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};
export default MyContractModal;

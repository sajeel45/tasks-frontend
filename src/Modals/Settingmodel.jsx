import { Modal, Button } from 'react-bootstrap'; // Assuming you're using react-bootstrap for Modal and Button
import Dropdown from 'react-bootstrap/Dropdown';
import { HiOutlineUpload } from "react-icons/hi";
import doctorIimg from "../assets/images/doctor-profile-img.jpg";

export default function Settingmodel({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} centered className='invite-model'>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="form">
            <div className="row gy-3">
              <div className="col-md-12">
                <div className="account-profile">
                  <img
                    src={doctorIimg}
                    alt="Profile"
                  />

                  <div className="accounts-wrapper">
                    <span>Profile Picture</span>
                    <div className="account-btn">
                      <div className="btn-upload">
                        <label htmlFor="upload">
                          <HiOutlineUpload /> Upload image
                          <input
                            id="upload"
                            type="file"
                            style={{
                              display: "none",
                            }}
                          />
                        </label>
                      </div>
                      <button className="remove">
                        Remove
                      </button>
                    </div>
                    <p className="small">
                      *.png,*.jpeg files up to 10MB at least 400px by 400px
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" placeholder="Enter your First name" className="form-control" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" placeholder="Enter your Last name" className="form-control" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="Enter your Email" className="form-control" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={handleClose}>
          Cancel
        </button>
        <button className='btn-style rounded' onClick={handleClose}>
          Save
        </button>
      </Modal.Footer>
    </Modal>
  )
}
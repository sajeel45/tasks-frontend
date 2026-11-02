import moment from "moment";
import React, { useState } from "react";

import { DropdownButton } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';


export default function ProfessionalInfoStep({ formik }) {
    const [experienceTitle, setExperienceTitle] = useState("Select Experience");
    const handleExperienceSelect = (eventKey, event) => {
        formik.setFieldValue("experience", eventKey);
        setExperienceTitle(event.target.innerText);
    };
    return (
        <div className="professional-info-step-wrapper">
            <div className="main-title-wrapper">
                <h3>Experience & Role Details</h3>
                <p>
                    Enter your professional title and select your experience level. <br />
                    Also, provide your age to complete your profile.</p>
            </div>
            <div className="step-content-section">
                <form action="#" className="form">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <label htmlFor="#">Professional title,</label>
                                    <input className="form-control"
                                        name="professionalTitle"
                                        type="text"
                                        placeholder="Title Here ... "
                                        value={formik.values.professionalTitle}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                {formik.touched.professionalTitle && formik.errors.professionalTitle && (
                                    <span className="error-msg">{formik.errors.professionalTitle}</span>
                                )}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <label htmlFor="#">Experience</label>
                                    <div className="dropdown-wrapper">
                                        <DropdownButton
                                            drop={'direction'}
                                            variant="secondary"
                                            title={formik.values.experience || experienceTitle}
                                            id="experience"
                                            name="experience"
                                            onSelect={handleExperienceSelect}
                                            className='form-dropdown '
                                        >
                                            <Dropdown.Item eventKey="1">1 year</Dropdown.Item>
                                            <Dropdown.Item eventKey="2">2 years</Dropdown.Item>
                                            <Dropdown.Item eventKey="3">3 years</Dropdown.Item>
                                            <Dropdown.Item eventKey="4">4 years</Dropdown.Item>
                                            <Dropdown.Item eventKey="5+">5+ years</Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                </div>
                                {formik.touched.experience && formik.errors.experience && (
                                    <span className="error-msg">{formik.errors.experience}</span>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <label htmlFor="#">Date of Birth</label>
                                    <input className="form-control"
                                        name="dateOfBirth"
                                        type="date"
                                        placeholder="Date of Birth"
                                        value={formik.values.dateOfBirth || ""}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        min={moment().subtract(100, 'years').format('YYYY-MM-DD')}
                                        max={moment().subtract(1, 'days').format('YYYY-MM-DD')}
                                    />
                                </div>
                                {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                                    <span className="error-msg">{formik.errors.dateOfBirth}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
import React, { useState, useEffect } from "react";
import { DropdownButton } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';

import doctorImg from '../../assets/images/doctor-profile-img.jpg'
import { genderOptions } from "../../utils/constants";
import { toTitleCase } from "../../utils/gloabalFunctions";

export default function ProfileDetailStep({ formik }) {
    const [availabilityTitle, setAvailabilityTitle] = useState(formik.values.availability || "Select Availability");
    const [languageTitle, setLanguageTitle] = useState(formik.values.language || "Select Language");
    const [typeTitle, setTypeTitle] = useState(formik.values.type === "agency" ? "Caregiver Agency" : "Individual Caregiver");
    const [imagePreview, setImagePreview] = useState(formik.values.avatar?.previewUrl || doctorImg);
    const [imageName, setImageName] = useState(formik.values.avatar?.name || "");

    const handleImageUpload = (e) => {
        const file = e.currentTarget.files[0];
        if (!file) return;

        const fileReader = new FileReader();
        fileReader.onload = () => {
            setImagePreview(fileReader.result);
            setImageName(file.name);

            formik.setFieldValue('avatar', {
                file,
                previewUrl: fileReader.result,
                name: file.name
            });
        };
        fileReader.readAsDataURL(file);
    };

    const handleAvailabilitySelect = (eventKey, event) => {
        const value = event.target.innerText;
        setAvailabilityTitle(value);
        formik.setFieldValue('availability', eventKey);
    };

    const handleLanguageSelect = (eventKey, event) => {
        const value = event.target.innerText;
        setLanguageTitle(value);
        formik.setFieldValue('language', value);
    };

    const handleTypeSelect = (eventKey, event) => {
        const value = event.target.innerText;
        setTypeTitle(value);
        formik.setFieldValue('type', value === "Caregiver Agency" ? "agency" : "individual");
    };

    const handleGenderSelect = (eventKey, event) => {        
        formik.setFieldValue('gender', eventKey);
    };
    
    // Initialize state based on formik values when they change
    useEffect(() => {
        if (formik.values.availability) {
            setAvailabilityTitle(formik.values.availability);
        }
        if (formik.values.language) {
            setLanguageTitle(formik.values.language);
        }
        if (formik.values.type) {
            setTypeTitle(formik.values.type === "agency" ? "Caregiver Agency" : "Individual Caregiver");
        }
        if (formik.values.avatar?.previewUrl) {
            setImagePreview(formik.values.avatar.previewUrl);
            setImageName(formik.values.avatar.name || "");
        }
    }, [formik.values]);
    return (
        <div className="profile-detail-step-wrapper">
            <div className="main-title-wrapper">
                <h3>Profile Details</h3>
                <p>
                    Write a short bio and upload a profile image. <br />
                    Add your availability, location, languages, and caregiver type. </p>
            </div>
            <div className="step-content-section">
                <form className="form" onSubmit={formik.handleSubmit}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <div className="enter-brand-logo-wrapper" style={{ maxWidth: '350px', marginInline: 'auto' }} >
                                        <label htmlFor="logo">profile image</label>
                                        <div
                                            className={`upload-brand-logo-wrapper`}
                                        >
                                            <label className="label" htmlFor="upload-brand">
                                                <input
                                                    type="file"
                                                    id="upload-brand"
                                                    className="visibility-hidden"
                                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                                    onChange={handleImageUpload}
                                                />
                                                <div className="img-wrapper">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Upload profile image"
                                                        className="upload-icon"
                                                        style={imagePreview !== doctorImg ? { maxHeight: '100%', objectFit: 'contain' } : {}}
                                                    />
                                                </div>
                                                <div className="text-wrapper">
                                                    {!imageName ? (
                                                        <>
                                                            <p className="dark_text">
                                                                Drop your image here, or
                                                                <span className="blue"> browse</span>
                                                            </p>
                                                            <span className="ex-small">Supports: PNG, JPG, JPEG, WEBP</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="m-0">
                                                                <span className="blue image-name">
                                                                    {imageName}
                                                                </span>
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                            {formik.touched.avatar && formik.errors.avatar && (
                                                <span className="error-msg">{formik.errors.avatar}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <label htmlFor="availability">Availability</label>
                                    <div className="dropdown-wrapper">
                                        <DropdownButton
                                            drop={'direction'}
                                            variant="secondary"
                                            title={availabilityTitle}
                                            className='form-dropdown'
                                            id="availability"
                                            name="availability"
                                            onSelect={handleAvailabilitySelect}
                                        >
                                            <Dropdown.Item eventKey="morning">Morning</Dropdown.Item>
                                            <Dropdown.Item eventKey="evening">Evening</Dropdown.Item>
                                            <Dropdown.Item eventKey="night">Night</Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                </div>
                                {formik.touched.availability && formik.errors.availability && (
                                    <span className="error-msg">{formik.errors.availability}</span>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        className="form-control"
                                        id="location"
                                        name="location"
                                        value={formik.values.location || ""}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Location Here ... "
                                    />
                                </div>
                                {formik.touched.location && formik.errors.location && (
                                    <span className="error-msg">{formik.errors.location}</span>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <label htmlFor="language">Languages</label>
                                    <div className="dropdown-wrapper">
                                        <DropdownButton
                                            drop={'direction'}
                                            variant="secondary"
                                            title={languageTitle}
                                            className='form-dropdown'
                                            id="language"
                                            name="language"
                                            onSelect={handleLanguageSelect}
                                        >
                                            <Dropdown.Item eventKey="English">English</Dropdown.Item>
                                            <Dropdown.Item eventKey="Urdu">Urdu</Dropdown.Item>
                                            <Dropdown.Item eventKey="Spanish">Spanish</Dropdown.Item>
                                            <Dropdown.Item eventKey="Japanese">Japanese</Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                </div>
                                {formik.touched.language && formik.errors.language && (
                                    <span className="error-msg">{formik.errors.language}</span>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <label htmlFor="type">Type</label>
                                    <div className="dropdown-wrapper">
                                        <DropdownButton
                                            drop={'direction'}
                                            variant="secondary"
                                            title={typeTitle}
                                            className='form-dropdown'
                                            id="type"
                                            name="type"
                                            onSelect={handleTypeSelect}
                                        >
                                            <Dropdown.Item eventKey="individual">Individual Caregiver</Dropdown.Item>
                                            <Dropdown.Item eventKey="agency">Caregiver Agency</Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                </div>
                                {formik.touched.type && formik.errors.type && (
                                    <span className="error-msg">{formik.errors.type}</span>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <div className="dropdown-wrapper">
                                        <DropdownButton
                                            drop={'direction'}
                                            variant="secondary"
                                            title={formik.values.gender ? toTitleCase(formik.values.gender) : "Please select"}
                                            className='form-dropdown'
                                            id="gender"
                                            name="gender"
                                            onSelect={handleGenderSelect}
                                        >
                                            {genderOptions.map((item, index) => (
                                                <Dropdown.Item key={index} eventKey={item}>
                                                    {toTitleCase(item)}
                                                </Dropdown.Item>
                                            ))}
                                        </DropdownButton>
                                    </div>
                                </div>
                                {formik.touched.gender && formik.errors.gender && (
                                    <span className="error-msg">{formik.errors.gender}</span>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <label htmlFor="hourlyRate">Hourly rate</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="hourlyRate"
                                        name="hourlyRate"
                                        value={formik.values.hourlyRate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter Rate Here ... "
                                    />
                                </div>
                                {formik.touched.hourlyRate && formik.errors.hourlyRate && (
                                    <span className="error-msg">{formik.errors.hourlyRate}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
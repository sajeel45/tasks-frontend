import React, { useState } from "react";
import { DropdownButton } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import Select from "react-select";
import { specificSpecializationOptions, typeOfCareOptions } from "../../utils/constants";
import { toTitleCase } from "../../utils/gloabalFunctions";

export default function PersonalInfoStep({ formik }) {
    const [selectedService, setSelectedService] = useState(formik.values.serviceType || "Service");

    const handleServiceSelect = (eventKey, event) => {
        const serviceName = event.target.innerText;
        setSelectedService(eventKey);
        formik.setFieldValue("serviceType", eventKey);
    };

    return (
        <div className="personal-info-step-wrapper">
            <div className="main-title-wrapper">
                <h3>Verify Identity & Services</h3>
                <p>Upload your CNIC and professional license. <br />
                    Select your services: Personal care, companionship, or nursing.</p>
            </div>
            <div className="step-content-section">
                <form action="#" className="form">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <label htmlFor="cnic">SSN</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="cnic"
                                        name="cnic"
                                        value={formik.values.cnic}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter your cnic" />
                                </div>
                                {formik.touched.cnic && formik.errors.cnic && (
                                    <span className="error-msg">{formik.errors.cnic}</span>
                                )}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <label htmlFor="professionalLicense">Professional License</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="professionalLicense"
                                        name="license"
                                        value={formik.values.license || ""}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Enter your professional license number"
                                    />
                                </div>
                                {formik.touched.license && formik.errors.license && (
                                    <span className="error-msg">{formik.errors.license}</span>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <label htmlFor="service">Service</label>
                                    <div className="dropdown-wrapper">
                                        <DropdownButton
                                            drop={'direction'}
                                            variant="secondary"
                                            title={typeOfCareOptions ? toTitleCase(typeOfCareOptions.find(option => option.key === selectedService)?.label || "Service") : "Service"}
                                            className='form-dropdown'
                                            id="service"
                                            name="serviceType"
                                            onSelect={handleServiceSelect}
                                        >
                                            {typeOfCareOptions?.map((service) => (
                                                <Dropdown.Item
                                                    key={service.key}
                                                    eventKey={service.key}
                                                    active={selectedService === service.key}
                                                >
                                                    {toTitleCase(service.label)}
                                                </Dropdown.Item>
                                            ))}
                                        </DropdownButton>
                                    </div>
                                </div>
                                {formik.touched.serviceType && formik.errors.serviceType && (
                                    <span className="error-msg">{formik.errors.serviceType}</span>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="field-wrapper">
                                <div className="form-group">
                                    <label htmlFor="service">Service</label>
                                    <div className="dropdown-wrapper">
                                        <Select
                                            styles={{ backgroundColor: "orange" }}
                                            id="types"
                                            name="types"
                                            isMulti
                                            className="form-select shadow-none select-package"
                                            options={specificSpecializationOptions.map((specialization) => ({
                                                label: toTitleCase(specialization),
                                                value: specialization,
                                            }))}
                                            value={formik.values.specializations.map((specializations) => ({
                                                label: toTitleCase(specializations),
                                                value: specializations,
                                            }))}
                                            onChange={(selectedOptions) => {
                                                const selectedValues = selectedOptions
                                                    ? selectedOptions.map((option) => option.value)
                                                    : [];
                                                formik.setFieldValue("specializations", selectedValues);
                                            }}
                                            onBlur={() => {
                                                formik.setFieldValue("specializations", formik.values.specializations); // Ensure Formik registers the field as touched
                                                formik.setFieldTouched("specializations", true); // Mark the field as touched for validation
                                            }}
                                            classNamePrefix="react-select"
                                        />
                                    </div>
                                </div>
                                {formik.touched.specializations && formik.errors.specializations && (
                                    <span className="error-msg">{formik.errors.specializations}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
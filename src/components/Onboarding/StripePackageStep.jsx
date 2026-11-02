import React, { useState, useEffect, use } from "react";
import { DropdownButton, Spinner } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import { FiCheck, FiClock } from 'react-icons/fi';

import doctorImg from '../../assets/images/doctor-profile-img.jpg'
import { genderOptions, subscriptionPackages } from "../../utils/constants";
import { returnArray, toTitleCase } from "../../utils/gloabalFunctions";
import { useDispatch, useSelector } from "react-redux";
import { checkoutPaymentAsyncThunk } from "../../redux/pagesSlices/paymentSlice";
import { updateProfileAsyncThunk } from "../../redux/pagesSlices/authSlice";

export default function StripePackageStep({ formik }) {
    const { profile } = useSelector((s) => s?.auth);
    const { loadings } = useSelector((s) => s?.payment);
    const dispatch = useDispatch();
    const [selectedPackage, setSelectedPackage] = useState(formik.values.selectedPackage || null);
    const [skipSubscription, setSkipSubscription] = useState(formik.values.skipSubscription || false);

    // Filter packages based on doctor type
    const filteredPackages = returnArray(subscriptionPackages).filter(pkg => {
        if (profile?.type === "individual") {
            return pkg.type === "individual";
        } else if (profile?.type === "agency") {
            return pkg.type === "agency";
        }
        // If no profile type specified, show all packages
        return true;
    });

    const handlePackageSelect = async (packageId) => {
        setSelectedPackage(packageId);
        setSkipSubscription(false);
        formik.setFieldValue('selectedPackage', packageId);
        formik.setFieldValue('skipSubscription', false);
        const data = await dispatch(checkoutPaymentAsyncThunk({
            data: {}
        })).unwrap()
        if (data?.url) {
            window.location.href = data?.url;
        }
    };

    const handleSkipSubscription = () => {
        if (loadings?.checkoutPaymentAsyncThunk) return;
        setSkipSubscription(true);
        setSelectedPackage(null);
        formik.setFieldValue('skipSubscription', true);
        formik.setFieldValue('selectedPackage', null);
        dispatch(
            updateProfileAsyncThunk({
                data: {
                    isSubscriptionSkipped: true,
                    steps: 5
                },
                callBack: () => {
                },
            })
        );
    };

    // Initialize state based on formik values when they change
    useEffect(() => {
        if (formik.values.selectedPackage) {
            setSelectedPackage(formik.values.selectedPackage);
        }
        if (formik.values.skipSubscription) {
            setSkipSubscription(formik.values.skipSubscription);
        }
    }, [formik.values]);

    return (
        <div className="profile-detail-step-wrapper">
            <div className="main-title-wrapper mt-4">
                <h3>Choose Your Subscription Plan</h3>
                <p>Select a plan that best fits your practice needs</p>
            </div>

            {/* Subscription Packages Section */}
            <div className="subscription-packages-section mb-5">
                {loadings?.checkoutPaymentAsyncThunk ?
                    <div className="text-center">
                        <Spinner className="text-center mt-5" animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <div className="row justify-content-center">
                        {filteredPackages.map((pkg) => (
                            <div key={pkg.id} className="col-lg-5 col-md-6 mb-4">
                                <div
                                    className={`subscription-card h-100 ${selectedPackage === pkg.id ? 'selected' : ''} ${pkg.popular ? 'popular' : ''}`}
                                    onClick={() => handlePackageSelect(pkg.id)}
                                    style={{
                                        border: selectedPackage === pkg.id ? '2px solid #007bff' : '1px solid #e9ecef',
                                        borderRadius: '12px',
                                        padding: '25px 20px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        backgroundColor: selectedPackage === pkg.id ? '#f8f9fa' : '#fff',
                                        transition: 'all 0.3s ease',
                                        boxShadow: selectedPackage === pkg.id ? '0 8px 25px rgba(0, 123, 255, 0.15)' : '0 2px 10px rgba(0, 0, 0, 0.08)'
                                    }}
                                >
                                    {pkg.popular && (
                                        <div
                                            className="popular-badge"
                                            style={{
                                                position: 'absolute',
                                                top: '-12px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                backgroundColor: '#28a745',
                                                color: 'white',
                                                padding: '3px 15px',
                                                borderRadius: '20px',
                                                fontSize: '9px',
                                                fontWeight: '600',
                                                letterSpacing: '0.5px'
                                            }}
                                        >
                                            MOST POPULAR
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <h5 className="package-name mb-3" style={{
                                            fontWeight: '600',
                                            color: pkg.popular ? '#28a745' : '#333',
                                            fontSize: '1.25rem'
                                        }}>
                                            {pkg.name}
                                        </h5>

                                        <div className="package-price mb-4">
                                            <span style={{
                                                fontSize: '2.5rem',
                                                fontWeight: '700',
                                                color: '#007bff'
                                            }}>
                                                ${pkg.price}
                                            </span>
                                            <span style={{
                                                color: '#6c757d',
                                                fontSize: '1rem',
                                                fontWeight: '500'
                                            }}>
                                                /{pkg.period}
                                            </span>
                                        </div>

                                        <ul style={{
                                            listStyle: 'none',
                                            padding: 0,
                                            textAlign: 'left',
                                            marginBottom: '0'
                                        }}>
                                            {pkg.features.map((feature, index) => (
                                                <li key={index} style={{
                                                    padding: '8px 0',
                                                    fontSize: '14px',
                                                    color: '#495057',
                                                    display: 'flex',
                                                    alignItems: 'flex-start'
                                                }}>
                                                    <span style={{
                                                        color: '#28a745',
                                                        marginRight: '10px',
                                                        fontWeight: 'bold',
                                                        fontSize: '16px',
                                                        lineHeight: '1'
                                                    }}>
                                                        ✓
                                                    </span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {selectedPackage === pkg.id && (
                                        <div
                                            className="selected-indicator"
                                            style={{
                                                position: 'absolute',
                                                top: '15px',
                                                right: '15px',
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ✓
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                }

                {/* Skip Subscription Option */}
                <div className="text-center mt-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-4">
                            <div
                                className={`skip-subscription-card`}
                                style={{
                                    // border: skipSubscription ? '2px solid #6c757d' : '2px solid #e9ecef',
                                    borderRadius: '16px',
                                    padding: '10px 10px',
                                    backgroundColor: '#fff',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    transform: skipSubscription ? 'translateY(-2px)' : 'translateY(0)',
                                    background: skipSubscription
                                        ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                                        : '#fff'
                                }}
                                onClick={handleSkipSubscription}
                                onMouseEnter={(e) => {
                                    if (!skipSubscription) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!skipSubscription) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
                                    }
                                }}

                            >
                                <div className="d-flex align-items-center justify-content-center rounded py-1 ">
                                    <h5 className="mb-0" style={{
                                        fontWeight: '600',
                                        color: skipSubscription ? '#495057' : '#343a40',
                                        fontSize: '1.2rem'
                                    }}>
                                        Skip for Now
                                    </h5>
                                </div>
                                <style jsx>{`
                                    @keyframes pulse {
                                        0% {
                                            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
                                        }
                                        50% {
                                            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.6);
                                        }
                                        100% {
                                            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
                                        }
                                    }
                                `}</style>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
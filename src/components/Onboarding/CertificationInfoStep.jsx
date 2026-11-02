import React, { useEffect, useState } from "react";
import doctorImg from '../../assets/images/doctor-profile-img.jpg';

// Helper function to check if a file is an image
const isImageFile = (file) => {
    if (!file) return false;
    const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    return imageTypes.includes(file.type);
};

// Helper function to get a generic file icon based on file type
const getFileIcon = (fileName) => {
    if (!fileName) return doctorImg;
    
    const extension = fileName.split('.').pop().toLowerCase();
    console.log("🚀 ~ getFileIcon ~ extension:", extension)
    
    // Return appropriate icon based on file extension
    if (['pdf'].includes(extension)) {
        return 'https://cdn-icons-png.flaticon.com/512/3997/3997593.png';
    } else if (['doc', 'docx'].includes(extension)) {
        return 'https://cdn-icons-png.flaticon.com/512/888/888883.png';
    } else {
        return 'https://cdn-icons-png.flaticon.com/512/2246/2246713.png';
    }
};

export default function CertificationInfoStep({ formik }) {
    console.log("🚀 ~ CertificationInfoStep ~ formik:", formik.errors)
    // Initialize documents array if needed
    useEffect(() => {
        if (!formik.values.documents) {
            formik.setFieldValue('documents', []);
        }
    }, []);

    // Document types from your schema
    const documentTypes = [
        { id: 'resume', label: 'Resume', required: false },
        { id: 'certification', label: 'CPR/ First aid certification', required: true },
        { id: 'license', label: 'State license', required: true },
        { id: 'other', label: 'Other documents', required: false }
    ];

    // Function to handle file changes
    const handleFileChange = (event, documentType) => {
        const file = event.currentTarget.files[0];
        if (!file) return;
        
        // Create a preview URL only if it's an image file
        const filePreviewUrl = isImageFile(file) ? URL.createObjectURL(file) : null;
        
        // Find if document of this type already exists in the array
        const documents = [...(formik.values.documents || [])];
        const existingIndex = documents.findIndex(doc => doc.documentType === documentType);
        
        if (existingIndex >= 0) {
            // Update existing document
            documents[existingIndex] = {
                ...documents[existingIndex],
                file,
                fileType: file.type,
                previewUrl: filePreviewUrl,
                name: file.name
            };
        } else {
            // Add new document
            documents.push({
                documentType,
                file,
                fileType: file.type,
                previewUrl: filePreviewUrl,
                name: file.name,
                url: "" // This will be filled in by the backend after upload
            });
        }
        
        formik.setFieldValue('documents', documents);
        
        // Mark this field as touched
        formik.setFieldTouched(`documents[${existingIndex >= 0 ? existingIndex : documents.length - 1}].file`, true);
    };
    
    // Function to determine if a document of a specific type exists
    const getDocumentByType = (documentType) => {
        if (!formik.values.documents) return null;
        return formik.values.documents.find(doc => doc.documentType === documentType);
    };
    
    // Function to check if there's an error for a specific document type
    const hasErrorForType = (documentType) => {
        if (!formik.errors.documents || !formik.touched.documents) return false;
        
        // Find if there are any errors for documents with this type
        const documentsArray = formik.values.documents || [];
        const index = documentsArray.findIndex(doc => doc.documentType === documentType);
        
        if (index === -1) return false;
        
        return formik.touched.documents?.[index] && 
               formik.errors.documents?.[index]?.file &&
               !documentsArray[index]?.url; // Don't show error if there's a URL (existing document)
    };
    
    // Function to remove a document
    const handleRemoveDocument = (documentType) => {
        const documents = [...(formik.values.documents || [])];
        const updatedDocuments = documents.filter(doc => doc.documentType !== documentType);
        formik.setFieldValue('documents', updatedDocuments);
    };

    return (
        <div className="certification-info-wrapper">
            <div className="main-title-wrapper">
                <h3>Certifications & Qualifications</h3>
                <p>
                    List any caregiving-related qualifications. <br />
                    Showcase your formal education and training. </p>
                <p className="text-danger">
                    <small><strong>Note:</strong> CPR/First aid certification and State license are required documents.</small>
                </p>
            </div>
            <div className="step-content-section">
                <form action="#" className="form">
                    <div className="row">
                        {documentTypes.map((docType, index) => {
                            const document = getDocumentByType(docType.id);
                            const hasError = hasErrorForType(docType.id);
                            
                            return (
                                <div className="col-md-6" key={docType.id}>
                                    <div className="field-wrapper">
                                        <div className="form-group">
                                            <div className="enter-brand-logo-wrapper">
                                                <label htmlFor={`upload-${docType.id}`}>
                                                    {docType.label} 
                                                    {docType.required && <span style={{ color: 'red', marginLeft: '3px' }}>*</span>}
                                                </label>
                                                <div
                                                    className={`upload-brand-logo-wrapper ${hasError ? 'has-error' : ''}`}
                                                >
                                                    <label className="label" htmlFor={`upload-${docType.id}`}>
                                                        <input
                                                            type="file"
                                                            id={`upload-${docType.id}`}
                                                            className="visibility-hidden"
                                                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                                                            onChange={(e) => handleFileChange(e, docType.id)}
                                                            onBlur={formik.handleBlur}
                                                        />
                                                        <div className="img-wrapper">
                                                            <img
                                                                src={
                                                                    document?.previewUrl || // Show preview if available (only for images)
                                                                    document?.url || // Show URL if available (from backend)
                                                                    (document?.name ? getFileIcon(document.name) : doctorImg) // Show appropriate icon based on file type
                                                                }
                                                                alt={`${docType.label} upload`}
                                                                className="upload-icon"
                                                                style={(document?.previewUrl || document?.url) ? { maxHeight: '100%', objectFit: 'contain' } : {}}
                                                            />
                                                        </div>
                                                        <div className="text-wrapper">
                                                            {!document?.name && !document?.url ? (
                                                                <>
                                                                    <p className="dark_text">
                                                                        Drop your file here, or{" "}
                                                                        <span className="blue"> browse</span>
                                                                    </p>
                                                                    <span className="ex-small">Supports: PDF, DOC, PNG, JPG, JPEG, WEBP</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <p className="m-0 d-flex align-items-center justify-content-between">
                                                                        <span className="blue image-name" style={{textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '70%'}}>
                                                                            {document.name || (document.url ? document.url.split('/').pop() : '')}
                                                                        </span>
                                                                        <button 
                                                                            type="button" 
                                                                            className="btn btn-sm btn-danger ml-2"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                handleRemoveDocument(docType.id);
                                                                            }}
                                                                            style={{ fontSize: '12px', padding: '2px 8px' }}
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </p>
                                                                    <span className="ex-small text-success">
                                                                        {document.file && isImageFile(document.file) 
                                                                            ? 'Image file selected' 
                                                                            : document.url 
                                                                                ? 'File already uploaded'
                                                                                : `${(document.name || '').split('.').pop().toUpperCase()} file selected`}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </label>
                                                    {hasError && (
                                                        <span className="error-msg">
                                                            Please upload a valid {docType.label.toLowerCase()} file
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {formik.errors.documents && typeof formik.errors.documents === 'string' && (
                        <div className="row mt-2">
                            <div className="col-12">
                                <div className="alert alert-danger">
                                    {formik.errors.documents}
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
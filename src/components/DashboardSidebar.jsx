import React, { useState } from "react";
import { FiChevronRight, FiSearch } from "react-icons/fi";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import {
    hourlyRateOptions,
    languageOptions,
    ratings,
    specificSpecializationOptions,
    typeOfCareOptions,
    locations,
    prices,
    genderOptions
} from "../utils/constants";
import { FaAnglesRight } from "react-icons/fa6";
import { FaAnglesLeft } from "react-icons/fa6";
import { toTitleCase } from "../utils/gloabalFunctions";

export default function DashboardSidebar({
    selectedFilters = {}, // { filterName: [selectedValues] or single value }
    onFilterChange = () => { },
    filterConfig = {}, // { filterName: { multi: true/false } }
    onSearch = null, // Optional callback for parent component to handle search
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openFilters, setOpenFilters] = useState({
        rating: true,
        language: true,
        hourlyRates: true,
        typeOfCare: true,
        specialization: true,
        gender: true,
        location: true,
        price: true,
    });

    const toggleFilter = (filter) => {
        setOpenFilters((prev) => ({
            ...prev,
            [filter]: !prev[filter],
        }));
    };

    // Handle checkbox change
    const handleCheckboxChange = (filter, value) => {
        const isMulti = filterConfig[filter]?.multi;
        let updated;
        if (isMulti) {
            const prev = Array.isArray(selectedFilters[filter]) ? selectedFilters[filter] : [];
            if (prev.includes(value)) {
                updated = prev.filter((v) => v !== value);
            } else {
                updated = [...prev, value];
            }
        } else {
            updated = selectedFilters[filter] === value ? null : value;
        }
        onFilterChange({ ...selectedFilters, [filter]: updated });
    };
    
    // Handle search input change
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        // If parent component provided a search handler, call it
        if (onSearch) {
            onSearch(value);
        }
    };
    
 

    return (
        <div className={`dashboard-sidebar-wrapper ${sidebarOpen ? "" : "closed"}`}>
            <div className="top-bar">
                <div className="search-bar-wrapper">
                    <FiSearch className="search-icon" />
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search filters" 
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {/* <span>Filters</span> */}
                    <FaAnglesRight />
                    <FaAnglesLeft />
                </button>
            </div>
            <div className="main-menu-wrapper">
                <div className="listing-wrapper">
                    <ul className="listings listing-category-titles">
                        {/* <li className={`${openFilters.location ? 'active' : ''}`} >
                            <span onClick={() => toggleFilter("location")}>Location</span>
                            <ul className="sub-menu-list">
                                {locations?.map((location, index) => (
                                    <li key={index}>
                                        <div className="filter-category">
                                            <div className="custom-checkbox-wrapper category-checkbox">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            filterConfig.location?.multi
                                                                ? (selectedFilters.location || []).includes(location)
                                                                : selectedFilters.location === location
                                                        }
                                                        onChange={() => handleCheckboxChange("location", location)}
                                                    />
                                                    <span className="checkmark"></span>
                                                    <span className="sub-category-name">{location}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li> */}
                        <li className={`${openFilters.price ? 'active' : ''}`} >
                            <span onClick={() => toggleFilter("price")}>Price</span>
                            <ul className="sub-menu-list">
                                {prices?.map((price, index) => (
                                    <li key={index}>
                                        <div className="filter-category">
                                            <div className="custom-checkbox-wrapper category-checkbox">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            filterConfig.price?.multi
                                                                ? (selectedFilters.price || []).includes(price.key)
                                                                : selectedFilters.price === price.key
                                                        }
                                                        onChange={() => handleCheckboxChange("price", price.key)}
                                                    />
                                                    <span className="checkmark"></span>
                                                    <span className="sub-category-name">{price.label}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className={`${openFilters.typeOfCare ? 'active' : ''}`} >
                            <span onClick={() => toggleFilter("typeOfCare")}>Type of care</span>
                            <ul className="sub-menu-list">
                                {typeOfCareOptions?.map((typeOfCare, index) => (
                                    <li key={index}>
                                        <div className="filter-category">
                                            <div className="custom-checkbox-wrapper category-checkbox">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            filterConfig.typeOfCare?.multi
                                                                ? (selectedFilters.typeOfCare || []).includes(typeOfCare.key)
                                                                : selectedFilters.typeOfCare === typeOfCare.key
                                                        }
                                                        onChange={() => handleCheckboxChange("typeOfCare", typeOfCare.key)}
                                                    />
                                                    <span className="checkmark"></span>
                                                    <span className="sub-category-name">{typeOfCare.label}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className={`${openFilters.gender ? 'active' : ''}`} >
                            <span onClick={() => toggleFilter("gender")}>Gender</span>
                            <ul className="sub-menu-list">
                                {genderOptions?.map((gender, index) => (
                                    <li key={index}>
                                        <div className="filter-category">
                                            <div className="custom-checkbox-wrapper category-checkbox">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            filterConfig.gender?.multi
                                                                ? (selectedFilters.gender || []).includes(gender)
                                                                : selectedFilters.gender === gender
                                                        }
                                                        onChange={() => handleCheckboxChange("gender", gender)}
                                                    />
                                                    <span className="checkmark"></span>
                                                    <span className="sub-category-name">{toTitleCase(gender)}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className={`${openFilters.specialization ? 'active' : ''}`} >
                            <span onClick={() => toggleFilter("specialization")}>Specialization</span>
                            <ul className="sub-menu-list">
                                {specificSpecializationOptions?.map((specialization, index) => (
                                    <li key={index}>
                                        <div className="filter-category">
                                            <div className="custom-checkbox-wrapper category-checkbox">
                                                <label className="checkbox-label">
                                                    <input type="checkbox"
                                                        checked={
                                                            filterConfig.specialization?.multi
                                                                ? (selectedFilters.specialization || []).includes(specialization)
                                                                : selectedFilters.specialization === specialization
                                                        }
                                                        onChange={() => handleCheckboxChange("specialization", specialization)}
                                                    />
                                                    <span className="checkmark"></span>
                                                    <span className="sub-category-name">{specialization}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className={`${openFilters.language ? 'active' : ''}`} >
                            <span onClick={() => toggleFilter("language")}>Languages</span>
                            <ul className="sub-menu-list">
                                {languageOptions?.map((language, index) => (
                                    <li key={index}>
                                        <div className="filter-category">
                                            <div className="custom-checkbox-wrapper category-checkbox">
                                                <label className="checkbox-label">
                                                    <input type="checkbox"
                                                        checked={
                                                            filterConfig.language?.multi
                                                                ? (selectedFilters.language || []).includes(language)
                                                                : selectedFilters.language === language
                                                        }
                                                        onChange={() => handleCheckboxChange("language", language)}
                                                    />
                                                    <span className="checkmark"></span>
                                                    <span className="sub-category-name">{language}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </div>

            </div>

        </div>
    );
}

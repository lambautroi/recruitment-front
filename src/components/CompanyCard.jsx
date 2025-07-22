import React from "react";
import { Link } from "react-router-dom";

const CompanyCard = ({ company }) => (
    <Link to={`/companies/${company._id}`} className="company-card-link">
        <div className="company-card">
            <div className="company-logo-container">
                <img
                    src={company.logo || "/employer-logo.png"}
                    alt={`${company.name} Logo`}
                    className="company-logo"
                    onError={(e) => {
                        e.target.src = "/employer-logo.png";
                    }}
                />
            </div>
            <div className="company-info">
                <h3 title={company.name}>{company.name}</h3>
                <p className="company-industry">{company.industry}</p>
                <p className="company-location">📍 {company.location_name}</p>
                <span className="job-count">
                    {company.jobCount} {company.jobCount === 1 ? 'Job' : 'Jobs'} Open
                </span>
            </div>
        </div>
    </Link>
);

export default CompanyCard;
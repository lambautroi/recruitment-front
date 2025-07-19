const CompanyCard = ({ company }) => (
    <div className="company-card">
        <div className="company-logo-container">
            <img
                src={company.logo || "employer-logo.png"}
                alt="Company Logo"
                className="company-logo"
            />
        </div>
        <div className="company-info">
            <h3>{company.name}</h3>
            <p className="company-industry">{company.industry}</p>
            <p className="company-location">📍 {company.location_name}</p>
            <span className="job-count">{company.jobCount} Jobs Open</span>
        </div>
    </div>
);

export default CompanyCard;

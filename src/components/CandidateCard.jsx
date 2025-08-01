import React from "react";
import { Link } from "react-router-dom";

const CandidateCard = ({ candidate }) => {
    return (
        <div className="candidate-card">
            <div className="candidate-card-header">
                <div className="candidate-avatar">
                    <img
                        src={candidate.profile_picture || "logo.png"}
                        alt={candidate.name}
                        onError={(e) => {
                            e.target.src = "logo.png";
                        }}
                    />
                </div>
                <div className="candidate-info">
                    <h3 className="candidate-name">
                        <Link to={`/candidates/${candidate._id}`}>
                            {candidate.name}
                        </Link>
                    </h3>
                    <p className="candidate-position">
                        {candidate.position_name}
                    </p>
                    <div className="candidate-basic-details">
                        <div className="detail-item-can">
                            <span className="detail-label">Giới tính:</span>
                            <span className="detail-value">
                                {candidate.gender}
                            </span>
                        </div>
                        <div className="detail-item-can">
                            <span className="detail-label">Học vấn:</span>
                            <span className="detail-value">
                                {candidate.education_level}
                            </span>
                        </div>
                        <div className="detail-item-can">
                            <span className="detail-label">Kinh nghiệm:</span>
                            <span className="detail-value">
                                {candidate.experience_level}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="candidate-skills">
                {candidate.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="skill-tag">
                        {skill}
                    </span>
                ))}
                {candidate.skills.length > 4 && (
                    <span className="skill-more">
                        +{candidate.skills.length - 4} khác
                    </span>
                )}
            </div>

            <div className="candidate-footer">
                <span className="candidate-location">
                    📍 {candidate.location_name}
                </span>
                <span className="candidate-salary">
                    💰 {candidate.salary_expectation}
                </span>
            </div>
        </div>
    );
};

export default CandidateCard;

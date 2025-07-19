const CandidateCard = ({ candidate }) => (
    <div className="candidate-card">
        <div className="candidate-header">
            <div className="candidate-avatar">
                <img
                    src={candidate.profile_picture || "https://via.placeholder.com/80x80/4A90E2/FFFFFF?text=👤"}
                    alt="Candidate Avatar"
                    className="candidate-photo"
                />
            </div>
            <div className="candidate-basic-info">
                <h3 className="candidate-name">{candidate.name}</h3>
                <p className="candidate-position">{candidate.position_name}</p>
                <div className="candidate-details">
                    <span className="gender">Giới tính: {candidate.gender}</span>
                    <span className="education">Học vấn: {candidate.education_level}</span>
                    <span className="experience">Kinh nghiệm: {candidate.experience_level}</span>
                </div>
            </div>
        </div>
        
        <div className="candidate-skills">
            {candidate.skills && candidate.skills.length > 0 && 
                candidate.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                ))
            }
        </div>
        
        <div className="candidate-footer">
            <div className="candidate-location">
                📍 {candidate.location_name}
            </div>
            <div className="candidate-salary">
                💰 {candidate.salary_expectation}
            </div>
        </div>
    </div>
);

export default CandidateCard;

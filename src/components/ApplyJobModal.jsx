import React, { useState } from "react";
import "../styles/ApplyJobModal.css";

const ApplyJobModal = ({ isOpen, onClose, job, candidateInfo, onApply }) => {
    const [coverLetter, setCoverLetter] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onApply({
                job_id: job._id,
                cover_letter: coverLetter.trim() || null,
            });

            // Reset form
            setCoverLetter("");
            onClose();
        } catch (error) {
            console.error("Error submitting application:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="apply-modal-overlay" onClick={handleBackdropClick}>
            <div className="apply-modal-content">
                <div className="apply-modal-header">
                    <h2>Ứng tuyển công việc</h2>
                    <button
                        className="close-button"
                        onClick={onClose}
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                <div className="apply-modal-body">
                    {/* Job Information */}
                    <div className="job-info-section">
                        <h3>Thông tin công việc</h3>
                        <div className="job-info-card">
                            <div className="job-info-header">
                                <div className="company-logo-mini">
                                    <img
                                        src={
                                            job.employer?.logo ||
                                            "/default-company.png"
                                        }
                                        alt={job.employer?.name}
                                        onError={(e) => {
                                            e.target.src =
                                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzMzNzNkYyIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJBcmlhbCI+QzwvdGV4dD4KPHN2Zz4K";
                                        }}
                                    />
                                </div>
                                <div className="job-info-details">
                                    <h4 className="job-title-modal">
                                        {job.title}
                                    </h4>
                                    <p className="company-name-modal">
                                        {job.employer?.name}
                                    </p>
                                    <div className="job-meta-modal">
                                        <span>📍 {job.location_name}</span>
                                        <span>• {job.form_name}</span>
                                        <span>
                                            • {job.salary_range || "Thỏa thuận"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Candidate Information */}
                    <div className="candidate-info-section">
                        <h3>Thông tin ứng viên</h3>
                        <div className="candidate-info-card">
                            <div className="candidate-info-row">
                                <div className="candidate-avatar">
                                    <img
                                        src={
                                            candidateInfo.profile_picture ||
                                            "/default-avatar.png"
                                        }
                                        alt={candidateInfo.full_name}
                                        onError={(e) => {
                                            e.target.src =
                                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNlMGU3ZmYiLz4KPGNpcmNsZSBjeD0iMzAiIGN5PSIyNCIgcj0iMTAiIGZpbGw9IiM2MzY2ZjEiLz4KPHBhdGggZD0ibTEwIDUwYzAtMTEuMDQ1IDguOTU1LTIwIDIwLTIwczIwIDguOTU1IDIwIDIwIiBmaWxsPSIjNjM2NmYxIi8+Cjwvc3ZnPgo=";
                                        }}
                                    />
                                </div>
                                <div className="candidate-details">
                                    <h4>
                                        {candidateInfo.full_name ||
                                            "Chưa cập nhật"}
                                    </h4>
                                    <p className="candidate-email">
                                        {candidateInfo.email}
                                    </p>
                                    <div className="candidate-meta">
                                        <span>
                                            📞{" "}
                                            {candidateInfo.phone ||
                                                "Chưa cập nhật"}
                                        </span>
                                        <span>
                                            📍{" "}
                                            {candidateInfo.location_id
                                                ?.location_name ||
                                                "Chưa cập nhật"}
                                        </span>
                                    </div>
                                    <div className="candidate-skills">
                                        <span>
                                            💼{" "}
                                            {candidateInfo.position_id
                                                ?.position_name ||
                                                "Chưa cập nhật"}
                                        </span>
                                        <span>
                                            🎓{" "}
                                            {candidateInfo.education
                                                ?.education_level ||
                                                "Chưa cập nhật"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* CV Status */}
                            <div className="cv-status">
                                {candidateInfo.resume_file ? (
                                    <div className="cv-available">
                                        <span className="cv-icon">📄</span>
                                        <span>CV đã được tải lên</span>
                                        <span className="cv-status-success">
                                            ✓
                                        </span>
                                    </div>
                                ) : (
                                    <div className="cv-missing">
                                        <span className="cv-icon">⚠️</span>
                                        <span>
                                            Chưa có CV. Vui lòng cập nhật hồ sơ
                                            cá nhân.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cover Letter */}
                    <form onSubmit={handleSubmit}>
                        <div className="cover-letter-section">
                            <h3>Thư giới thiệu</h3>
                            <textarea
                                className="cover-letter-input"
                                placeholder="Viết giới thiệu ngắn gọn về bản thân (điểm mạnh, điểm yếu) và nêu rõ mong muốn, lý do bạn muốn ứng tuyển cho vị trí này..."
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                rows={6}
                                maxLength={1000}
                            />
                            <div className="character-count">
                                {coverLetter.length}/1000 ký tự
                            </div>
                        </div>

                        <div className="apply-modal-footer">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="btn-apply"
                                disabled={
                                    isSubmitting || !candidateInfo.resume_file
                                }
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Đang nộp hồ sơ...
                                    </>
                                ) : (
                                    <> Nộp hồ sơ</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplyJobModal;

import React, { useState, useEffect } from "react";
import Navbar from "../components/homePage/Navbar";
import "../styles/JobListPage.css";
import { Link } from "react-router-dom";

export default function JobListPage() {
    return (
        <div>
            <Navbar />
            <div className="job-list-banner">
                <div className="job-list-banner-content">
                    <h1 className="banner-title">Danh sách tuyển dụng</h1>
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link> &gt; Danh sách tuyển dụng
                    </div>
                </div>
            </div>

            <div className="job-list-content">
                <h2>Danh sách công việc sẽ hiển thị ở đây</h2>
            </div>
        </div>
    );
}

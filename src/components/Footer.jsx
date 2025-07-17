import "../styles/Footer.css";
import React, { useState } from "react";

export default function Footer() {
    const [email, setEmail] = useState("");

    const handleSubscribe = () => {
        if (email) {
            alert(`Đăng ký nhận bản tin với email: ${email}`);
            setEmail("");
        } else {
            alert("Vui lòng nhập email");
        }
    };

    return (
        <footer className="footer">
            <div className="newsletter">
                <h2>Subscribe our newsletter</h2>
                <div className="newsletter-form">
                    <input
                        type="email"
                        placeholder="Enter your email here"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleSubscribe}>Subscribe</button>
                </div>
            </div>

            <div className="footer-main">
                <div className="footer-left">
                    <div className="footer-logo">
                        <img src="logo.png" alt="Logo" />{" "}
                    </div>
                    <p>
                        Connecting the design community with job opportunities.
                    </p>
                </div>

                <div className="footer-right">
                    <div className="footer-links">
                        <div className="footer-column">
                            <h3>Resources</h3>
                            <ul>
                                <li>
                                    <a href="#">About Us</a>
                                </li>
                                <li>
                                    <a href="#">Our Team</a>
                                </li>
                                <li>
                                    <a href="#">Products</a>
                                </li>
                                <li>
                                    <a href="#">Contact</a>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3>Community</h3>
                            <ul>
                                <li>
                                    <a href="#">Feature</a>
                                </li>
                                <li>
                                    <a href="#">Pricing</a>
                                </li>
                                <li>
                                    <a href="#">Credit</a>
                                </li>
                                <li>
                                    <a href="#">FAQ</a>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3>Quick Links</h3>
                            <ul>
                                <li>
                                    <a href="#">iOS</a>
                                </li>
                                <li>
                                    <a href="#">Android</a>
                                </li>
                                <li>
                                    <a href="#">Microsoft</a>
                                </li>
                                <li>
                                    <a href="#">Desktop</a>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h3>More</h3>
                            <ul>
                                <li>
                                    <a href="#">Privacy</a>
                                </li>
                                <li>
                                    <a href="#">Help</a>
                                </li>
                                <li>
                                    <a href="#">Terms</a>
                                </li>
                                <li>
                                    <a href="#">FAQ</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Mạng xã hội */}
                <div className="footer-social">
                    <a
                        href="https://www.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        FB
                    </a>
                    <a
                        href="https://www.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        X
                    </a>
                    <a
                        href="https://www.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
}

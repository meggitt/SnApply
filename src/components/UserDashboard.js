import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to access state
import '../css/UserDashboard.css';

const UserDashboard = () => {
    const location = useLocation();
    const { username } = location.state || { username: "User" }; // Default to "User" if no username is provided

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome, {username}!</h1>
            </header>
            <main className="dashboard-main">
                <section className="dashboard-section">
                    <h2>Your Applications</h2>
                    <ul>
                        <li>Application for Software Engineer - Status: Interview Scheduled</li>
                        <li>Application for Data Analyst - Status: Under Review</li>
                        <li>Application for Frontend Developer - Status: Application Received</li>
                    </ul>
                </section>
                <section className="dashboard-section">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><a href="/profile">View Profile</a></li>
                        <li><a href="/applications">View All Applications</a></li>
                        <li><a href="/settings">Account Settings</a></li>
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default UserDashboard;

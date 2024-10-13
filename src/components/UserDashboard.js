import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; 
import '../css/UserDashboard.css';
import { FaMicrophone } from 'react-icons/fa'; 

const UserDashboard = () => {
    const location = useLocation();
    const { username } = location.state || { username: "User" }; 
    const [notes, setNotes] = useState([]); // State to store notes
    const [listening, setListening] = useState(false); // Track if the mic is listening
    const [isSpeaking, setIsSpeaking] = useState(false); // Track if it's speaking the prompt

    // Text-to-Speech for a welcome message
    const handleVoice = () => {
        const speech = new SpeechSynthesisUtterance();
        speech.text = "Welcome to your dashboard! Here you can view your applications and manage your account settings.";
        speech.rate = 1; // Adjust the rate of speech if needed
        window.speechSynthesis.speak(speech);
    };

    // Function to capture speech input and save it as notes
    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'en-US';
        recognition.interimResults = false; // Capture only final results
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setListening(true); // Start listening
        };

        recognition.onend = () => {
            setListening(false); // Stop listening when done
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setNotes((prevNotes) => [...prevNotes, transcript]); // Add spoken text to notes array
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setListening(false);
        };

        recognition.start();
    };

    // Function to first say a prompt and then start taking notes
    const handlePromptAndStartVoiceInput = () => {
        const speech = new SpeechSynthesisUtterance();
        speech.text = "Please start speaking after the beep. Your voice will be saved as notes.";
        speech.rate = 1; // Adjust the rate of speech if needed

        // Set a flag to indicate the app is speaking
        setIsSpeaking(true);

        // When the speech is finished, start recognizing voice input
        speech.onend = () => {
            setIsSpeaking(false);
            handleVoiceInput(); // Start taking voice input
        };

        window.speechSynthesis.speak(speech);
    };

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

                {/* Section for displaying voice-captured notes */}
                <section className="dashboard-section">
                    <h2>Your Notes</h2>
                    <ul>
                        {notes.map((note, index) => (
                            <li key={index}>{note}</li>
                        ))}
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

            {/* Mic Button for Text-to-Speech */}
            <div className="mic-container" onClick={handleVoice}>
                <FaMicrophone className="mic-icon" />
            </div>

            {/* Mic Button for Speech-to-Text Notes */}
            <div className="mic-container" onClick={handlePromptAndStartVoiceInput}>
                <FaMicrophone className={`mic-icon ${listening || isSpeaking ? 'listening' : ''}`} />
            </div>

            {/* Show listening feedback */}
            {listening && <p className="listening-message">Listening...</p>}
            {isSpeaking && <p className="listening-message">Speaking prompt...</p>}
        </div>
    );
};

export default UserDashboard;

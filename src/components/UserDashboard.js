import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const UserDashboard = () => {
    const location = useLocation();
    const { user } = location.state; // user data passed via router
    const [userResponses, setUserResponses] = useState({}); // Store user responses
    const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode

    // Function to initialize the user responses
    const initializeResponses = () => {
        const initialResponses = {};
        Object.keys(user.questions).forEach((key) => {
            initialResponses[key] = user.questions[key].answer || ''; // Pre-fill answers if available
        });
        setUserResponses(initialResponses);
    };

    // Initialize user responses on first render
    useEffect(() => {
        initializeResponses();
    }, [user]);

    const handleInputChange = (event, questionKey) => {
        const { value } = event.target;
        setUserResponses((prevResponses) => ({
            ...prevResponses,
            [questionKey]: value, // Update the response for the specific question
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare an object marking all questions as completed and saving responses
        const updatedQuestions = { ...user.questions };
        Object.keys(updatedQuestions).forEach((key) => {
            // Mark as incomplete if the answer is an empty string
            updatedQuestions[key].completed = userResponses[key] !== '';
            updatedQuestions[key].answer = userResponses[key]; // Store the user's answer
        });

        // Update the database with user responses
        try {
            const response = await fetch('http://localhost:3001/updateUserResponses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        ...user,
                        questions: updatedQuestions, // Updated user questions
                    },
                    responses: userResponses, // Responses to be sent
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Responses updated successfully!'); // Show success alert
                setIsEditing(false); // Disable edit mode after successful submission
                initializeResponses(); // Reinitialize to reset the form and show answers
            } else {
                alert(result); // Show error message
            }
        } catch (error) {
            console.error('Error updating database:', error);
            alert("Error updating responses");
        }
    };

    const handleSliderChange = (event, questionKey) => {
        const value = parseFloat(event.target.value);
        setUserResponses((prevResponses) => ({
            ...prevResponses,
            [questionKey]: value, // Update GPA slider value
        }));
    };

    const handleEditResponses = () => {
        // Retain the current answers instead of clearing them
        setIsEditing(true); // Enter edit mode
    };

    const renderQuestions = () => {
        return (
            <form onSubmit={handleSubmit}>
                {Object.keys(user.questions).map((questionKey, index) => {
                    const question = user.questions[questionKey];

                    // Display editable fields if profileStatus is false or user is editing
                    const isEditable = !user.profileStatus || isEditing;

                    return (
                        <div key={index} className="question-container">
                            <label htmlFor={`question-${index}`}>
                                {question.question}
                            </label>
                            <br></br>
                            {/* Degree dropdown for a specific question, use appropriate condition */}
                            {questionKey === "Q2" && isEditable ? (
                                <select className='input'
                                    value={userResponses[questionKey] || ''}
                                    onChange={(event) => handleInputChange(event, questionKey)}
                                    required
                                >
                                    <option value="UTA" className='inputd'>UTA</option>
                                    <option value="UTD" className='inputd'>UTD</option>
                                </select>
                            ) : questionKey === "Q4" && isEditable ? ( // GPA slider for question Q4
                                <div>
                                    <input className='inputn'
                                        type="range"
                                        min="0"
                                        max="4.0"
                                        step="0.1"
                                        value={userResponses[questionKey] || '0'}
                                        onChange={(event) => handleSliderChange(event, questionKey)}
                                        required
                                    />
                                    <span>{userResponses[questionKey] || '0'}</span> {/* Display current GPA value */}
                                </div>
                            ) : questionKey === "Q1" && isEditable ? ( // Degree level dropdown
                                <select className='input'
                                    value={userResponses[questionKey] || ''}
                                    onChange={(event) => handleInputChange(event, questionKey)}
                                    required
                                >
                                    <option value="Masters" className='inputd'>Masters</option>
                                    <option value="Undergrad" className='inputd'>Undergrad</option>
                                    <option value="PhD" className='inputd'>PhD</option>
                                </select>
                            ) : questionKey === "Q3" && isEditable ? ( // Major dropdown
                                <select className='input'
                                    value={userResponses[questionKey] || ''}
                                    onChange={(event) => handleInputChange(event, questionKey)}
                                    required
                                >
                                    <option value="Computer Science" className='inputd'>Computer Science</option>
                                    <option value="Information Science" className='inputd'>Information Science</option>
                                    <option value="Data Science" className='inputd'>Data Science</option>
                                </select>
                            ) : (
                                <input
                                    type="text" className='input'
                                    id={`question-${index}`}
                                    value={userResponses[questionKey] || ''}
                                    onChange={(event) => handleInputChange(event, questionKey)}
                                    readOnly={!isEditable} // Make fields readonly if not editable
                                    required={isEditable} // Required only when editable
                                />
                            )}
                        </div>
                    );
                })}
                {/* Show either Submit or Edit button depending on the state */}
                {user.profileStatus && !isEditing ? (
                    <button type="button"className='button-85n' onClick={handleEditResponses}>Edit Responses</button>
                ) : (
                    <button type="submit" className='button-85n'>Submit Answers</button>
                )}
            </form>
        );
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome, {user.firstName}!</h1>
            </header>

            <main className="dashboard-main">
                <section className="dashboard-section">
                    <h2>Your Profile</h2>
                    {renderQuestions()}
                </section>
            </main>
        </div>
    );
};

export default UserDashboard;

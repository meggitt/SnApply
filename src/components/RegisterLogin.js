import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/RegisterLogin.css';

const RegisterLogin = () => {
    const [isRightPanelActive, setIsRightPanelActive] = useState(true);
    const [username, setUsername] = useState(""); // Store the username
    const containerRef = useRef(null);
    const signupFormRef = useRef(null);
    const signinFormRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isRightPanelActive) {
            containerRef.current.classList.add('right-panel-active');
        } else {
            containerRef.current.classList.remove('right-panel-active');
        }
    }, [isRightPanelActive]);

    const handleSignIn = () => {
        setIsRightPanelActive(false);
    };

    const handleSignUp = () => {
        setIsRightPanelActive(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');

        if (isRightPanelActive) {
            // Registration flow
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const confirmPassword = formData.get('cPassword');

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data === "success") {
                    alert("Registration successful! Please log in.");
                    setIsRightPanelActive(false);
                    signupFormRef.current.reset();
                } else {
                    alert("Registration failed: " + data.message);
                }
            })
            .catch(error => {
                console.error("Error during registration:", error);
            });

        } else {
            // Login flow
            fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            .then(response => response.json())
            .then(data => {
                if (data != "Wrong password" || data != "No records found!") {
                    setUsername(data.firstName); // Set username
                    navigate('/dashboard', { state: { username: data.firstName } }); // Pass username to dashboard
                } else {
                    alert("Login failed: " + data.message);
                }
            })
            .catch(error => {
                console.error("Error during login:", error);
            });
        }
    };

    return (
        <div className="container" ref={containerRef}>
            {/* Sign Up Form */}
            <div className="container__form container--signup">
                <form action="#" className="form" id="form1" ref={signupFormRef} onSubmit={handleFormSubmit}>
                    <fieldset>
                        <legend className='legend'>Register</legend>
                        <div className='input2'>
                            <input type='text' name="firstName" placeholder='First Name' className="input" required />
                            <input type='text' name="lastName" placeholder='Last Name' className="input" required />
                        </div>
                        <input type="email" name="email" placeholder="Email" className="input" required />
                        <input type="password" name="password" placeholder="Password" className="input" required />
                        <input type="password" name="cPassword" placeholder="Confirm Password" className="input" required />
                        <br></br>
                        <button className="button-85">Sign Up</button>
                        <br></br>
                    </fieldset>
                </form>
            </div>

            {/* Sign In Form */}
            <div className="container__form container--signin">
                <form action="#" className="form" id="form2" ref={signinFormRef} onSubmit={handleFormSubmit}>
                    <fieldset>
                        <legend className='legend'>Login</legend>
                    <input type="email" name="email" placeholder="Email" className="input" required />
                    <input type="password" name="password" placeholder="Password" className="input" required />
                    <a href="#" className="link">Forgot your password?</a>
                    <br></br>
                    <br></br>
                    <button className="button-85">Sign In</button>
                    </fieldset>
                </form>
            </div>

            {/* Overlay */}
            <div className="container__overlay">
                <div className="overlay">
                    <div className="overlay__panel overlay--left">
                        <h2 className='Title'>Resume<br></br>Illa</h2>
                        <p className='text'>Already a member?</p>
                        <button className="button-85" id="signIn" onClick={handleSignIn}>
                            Login Now
                        </button>
                    </div>
                    <div className="overlay__panel overlay--right">
                        <h2 className='Title'>Resume<br></br>Illa</h2>
                        <p className='text'>New Here?</p>
                        <button className="button-85" id="signUp" onClick={handleSignUp}>
                            Register Here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterLogin;

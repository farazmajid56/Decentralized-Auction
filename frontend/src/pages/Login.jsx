import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [name, setName] = useState('');

    const handleInputChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onLogin();
    };

    return (
        <div className="login-container">
            <header className="login-header">
                Welcome to Decentralized Auction House
            </header>
            <form onSubmit={handleSubmit} className="login-form">
                <label htmlFor="name" className="login-label">Enter your name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={handleInputChange}
                    className="login-input"
                    placeholder="Your Name"
                    required
                />
                <button type="submit" className="login-button">Continue</button>
            </form>
            <footer className="login-footer">
                By Faraz Majid 20L-1162 & Aemon Fatima 20L-1057
            </footer>
        </div>
    );
};

export default Login;

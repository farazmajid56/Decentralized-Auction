import './Login.css';
import React, { useEffect, useState } from 'react';

const Login = ({ contract, accounts, onLogin, username, setUsername, existingUser, setExistingUser }) => {

    useEffect(() => {
        // Define the async function inside useEffect
        async function checkUserExists() {
            if (!window.ethereum) {
                alert('Please install MetaMask!');
                return;
            }
            if (!contract) {
                console.error('Contract not loaded');
                return; // Early return if contract is not loaded
            }            
            const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const isRegistered = await contract.methods.getUser(account[0]).call();
            if (isRegistered) {
                setExistingUser(true);
            } else {
                setExistingUser(false);
                // Prompting before setting username might lead to better flow control
                const name = prompt('Please enter your username for registration:');
                setUsername(name);
            }
        }

        checkUserExists();
    }, [contract]); // Dependencies should include all variables used in the effect that could change over time

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }
        const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!existingUser) {
            await contract.methods.registerUser(username).send({ from: account[0] });
        }
        onLogin();
    };

    return (
        <div className="login-container">
            <header className="login-header">
                Welcome to Decentralized Auction House
            </header>
            {/* TODO: Add check for empty username */}
            { !existingUser ?  
                <> 
                    <h1 className="register-heading">Please register your account</h1> 
                    <label className='login-label'>Username:
                        <input value={username} className="login-input" onChange={(e) => setUsername(e.target.value)} />
                    </label>
                </>
                :
                <h1 className="register-heading">Welcome back</h1> 
            }

            <button className="login-button" onClick={connectWallet}>Connect Wallet</button>

            <footer className="login-footer">
                By Faraz Majid 20L-1162 & Aemon Fatima 20L-1057
            </footer>
        </div>
    );
};

export default Login;
import './Login.css';
import React, { useEffect, useState } from 'react';

const Login = ({ contract, onLogin, username, setUsername, existingUser, setExistingUser, setwalletAddress }) => {

    useEffect(() => {
        async function checkUserExists() {
            if (!window.ethereum) {
                alert('Please install MetaMask!');
                return;
            }
            if (!contract) {
                console.error('Contract not loaded');
                return; // Early return if contract is not loaded
            }
            
            try {
                const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const isRegistered = await contract.methods.getUser(account[0]).call();
                if (isRegistered) {
                    setUsername(isRegistered.username)
                    setExistingUser(true);
                    onLogin();
                } else {
                    setExistingUser(false);
                    // Prompting before setting username might lead to better flow control
                    const name = prompt('Please enter your username for registration:');
                    setUsername(name);
                }
                setwalletAddress(account[0]);
            } catch (error) {
                console.error('Error checking if user exists:', error);
                // Handle specific error scenarios if needed
                if (error.code === 4001) {
                    // EIP-1193 user rejection error
                    console.log('Please connect to MetaMask.');
                } else if (error.message.includes('Internal JSON-RPC error')) {
                    console.log('A JSON-RPC error occurred. Please try again.');
                } else {
                    // Generic error handling
                    alert('An error occurred. Please try again later.');
                }
            }
        }
    
        checkUserExists();
    }, [contract]);  // Add contract to the dependency array to ensure re-run if contract changes
    

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }
        const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (!existingUser) {
            console.log("New user registered")
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
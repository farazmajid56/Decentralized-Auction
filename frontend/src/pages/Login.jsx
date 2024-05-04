import React, { useEffect, useState } from 'react';
import './Login.css';

const Login = ({ contract, accounts, onLogin }) => {
    const [username, setUsername] = useState('');
    const [existingUser, setexistingUser] = useState(false);

    useEffect(() => checkUserExists(), [])

    const connectWallet = async () => {
        if (window.ethereum) {
            const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if(!existingUser){
                await contract.methods.registerUser(username).send({ from: account });
            }
            onLogin();
        } else {
            alert('Please install MetaMask!');
        }
    };

    const checkUserExists = async (account) => {
        const isRegistered = await contract.methods.getUser(account).call();
        if (isRegistered) {
            setexistingUser(true);
        } else {
            setexistingUser(false);
            const name = prompt('Please enter your username for registration:');
            await contract.methods.registerUser(username).send({ from: account });
        }
    };

    return (
        <div className="login-container">
            <header className="login-header">
                Welcome to Decentralized Auction House
            </header>
            
            { !existingUser && 
                <> 
                <h1>Please register you account</h1> 
                <input value={username} className="login-input" onChange={(e) => setUsername(e.target.value)} />
                </>
            }

            <button className="login-button" onClick={connectWallet}>Connect Wallet</button>

            <footer className="login-footer">
                By Faraz Majid 20L-1162 & Aemon Fatima 20L-1057
            </footer>
        </div>
    
    );
};

export default Login;

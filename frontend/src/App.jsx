import './App.css';
import Web3 from 'web3';
import React, { useEffect, useState } from 'react';

import Home from './pages/Home'
import Login from './pages/Login'

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [items, setItems] = useState([]);
  const [isOpenAddItemsPage, setisOpenAddItemsPage] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [existingUser, setExistingUser] = useState(false);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable(); // Request account access
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);
          loadContract(web3Instance);
        } catch (error) {
          console.error("Access to your Ethereum account rejected.");
        }
      } else {
        console.error('Please install MetaMask!');
      }
    };

    const loadContract = async (web3) => {
      const contractData = require('./DecentralizedAuction.json'); // Path to JSON file
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = contractData.networks[networkId];
      const contractInstance = new web3.eth.Contract(
        contractData.abi,
        deployedNetwork && deployedNetwork.address,
      );
      setContract(contractInstance);
      const itemsCount = await contractInstance.methods.itemsCount().call();
      const items = [];
      for (let i = 0; i < itemsCount; i++) {
        const item = await contractInstance.methods.items(i).call();
        items.push(item);
      }
      setItems(items);
    };
    initWeb3();
  }, [isOpenAddItemsPage]);

  const toggleAddItemsPage = () => {
      setisOpenAddItemsPage(prevState => !prevState);
  }
  const toggleisLoggedIn = () => {
    setisLoggedIn(true);
  }

  return (
    <>
      {!isLoggedIn ? 
        <Login 
          contract={contract} 
          onLogin={toggleisLoggedIn} 
          username = {username} 
          setUsername = {setUsername} 
          existingUser = {existingUser} 
          setExistingUser = {setExistingUser}
        />
        : 
        <Home 
          items = {items} 
          contract = {contract} 
          accounts = {accounts} 
          web3 = {web3} 
          toggleAddItemsPage = {toggleAddItemsPage} 
          isOpenAddItemsPage = {isOpenAddItemsPage}
        />
      }
    </>
  );  
}

export default App;

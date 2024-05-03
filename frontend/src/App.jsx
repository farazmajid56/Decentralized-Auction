import React, { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';
import AuctionItem from './AuctionItem'; // Component for auction items

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [items, setItems] = useState([]);

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
  }, []);

  return (
    <div className="App">
      <header className="title-bar">
        <h1>Decentralized Auction House</h1>
        <p>By: Faraz Majid 20L-1162 & Aemon Fatima 20L-1057</p>
      </header>
      <div className="feed">
      {items.map((item, index) => (
        <AuctionItem key={index} item={item} contract={contract} accounts={accounts} web3={web3}/>
      ))}
      </div>
    </div>
  );
}

export default App;

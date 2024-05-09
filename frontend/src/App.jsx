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
  const [walletAddress, setwalletAddress] = useState('');
  const [toggleFeed, setToggleFeed] = useState(true);
  const [userItems, setuserItems] = useState([]);

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
      try {
        //let _userItems = await contractInstance.methods.getAllUserItems().call()

        // console.log(walletAddress);
        let _userItems = items.filter(x => x.seller == walletAddress);

        // console.log("_userItems")
        // console.log(_userItems);
        setuserItems(_userItems);
        
      } catch (error) {
        //console.log("Unable to Fetch User Items")
        //console.log(error)
      }
      setItems(items);
    };
    initWeb3();
  }, [isOpenAddItemsPage,walletAddress,existingUser,toggleFeed,isLoggedIn,items]);

  const toggleAddItemsPage = () => {
      setisOpenAddItemsPage(prevState => !prevState);
  }
  const toggleisLoggedIn = () => {
    setisLoggedIn(true);
  }
  const openUserAuctions = () => {
    setToggleFeed(prevState => !prevState);
  }
  // const withdrawRefunds = async () => {
  //   try{
  //     const success = await contract.methods.withdraw().send();
  //     console.log("withdrawRefunds()")
  //     console.log(Number(success))
  //     alert("Withdraw Successful")
  //   }catch(error){
  //     console.log(error);
  //     //console.log(success)
  //     alert("Withdraw Failed")
  //   }
  //   //alert(success ? "Withdraw Successful" : "Withdraw Failed");
  //   //console.log( success ? "Withdraw Successful" : "Withdraw Failed");
  // }
  const endAuction = async (id) => {
      try {
          // Call the endAuction method in the smart contract
          const success = await contract.methods.manualEndAuction(id).send({
            from: walletAddress
          });
  
          console.log(`Wallet Address: ${walletAddress}`)
          console.log(`endAuction(${id})`)
          console.log(success)
          //console.log(success.data.message)
          if (success) {
              // Update the local state
              setItems((prevItems) =>
                  prevItems.map((item) =>
                      item.id === id ? { ...item, ended: true } : item
                  )
              );
          }
      } catch (error) {
          console.warn('Error ending the auction:', error);
      }
  };
  
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
          setwalletAddress = {setwalletAddress}
        />
        : 
        <Home 
          items = {items} 
          userItems = {userItems}
          contract = {contract} 
          accounts = {accounts} 
          web3 = {web3} 
          toggleAddItemsPage = {toggleAddItemsPage} 
          isOpenAddItemsPage = {isOpenAddItemsPage}
          username = {username}
          walletAddress = {walletAddress}
          openUserAuctions = {openUserAuctions}
          toggleFeed = {toggleFeed}
          //withdrawRefunds = {withdrawRefunds}
          endAuction = {endAuction}
        />
      }
    </>
  );  
}

export default App;

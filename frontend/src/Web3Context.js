import React, { createContext, useState, useEffect } from 'react';
import getWeb3 from './getWeb3';
import AuctionContract from '../contracts/Auction.json';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = AuctionContract.networks[networkId];
        const contract = new web3.eth.Contract(
          AuctionContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }
    };
    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={{ web3, accounts, contract }}>
      {children}
    </Web3Context.Provider>
  );
};

import React, { useState } from 'react';
import Web3 from 'web3';
import './AddItems.css'

const AddItems = ({ web3, accounts, contract, back }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [minBid, setMinBid] = useState('');
  const [buyoutPrice, setBuyoutPrice] = useState('');
  const [biddingTime, setBiddingTime] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!web3) {
      alert('Web3 is not initialized. Ensure MetaMask is connected.');
      return;
    }

    try {
      // Convert biddingTime to seconds (if entered in minutes)
      const biddingTimeInSeconds = biddingTime * 60;

      await contract.methods.addItem(
        name,
        imageUrl,
        Web3.utils.toWei(minBid, 'ether'), // Assuming minBid and buyoutPrice are in Ether
        Web3.utils.toWei(buyoutPrice, 'ether'),
        biddingTimeInSeconds
      ).send({ from: accounts[0] });

      alert('Item added successfully!');
      // Optionally reset state here
      setName('');
      setImageUrl('');
      setMinBid('');
      setBuyoutPrice('');
      setBiddingTime('');
    } catch (error) {
      alert('Failed to add item. Error: ' + error.message);
    }
    back();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Auction Item</h2>
      <label>
        Item Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Image URL:
        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
      </label>
      <label>
        Minimum Bid (ETH):
        <input type="number" value={minBid} onChange={(e) => setMinBid(e.target.value)} required />
      </label>
      <label>
        Buyout Price (ETH):
        <input type="number" value={buyoutPrice} onChange={(e) => setBuyoutPrice(e.target.value)} required />
      </label>
      <label>
        Bidding Time (minutes):
        <input type="number" value={biddingTime} onChange={(e) => setBiddingTime(e.target.value)} required />
      </label>
      <button type="submit" onClick={handleSubmit}>Add Item</button>
    </form>
  );
};

export default AddItems;

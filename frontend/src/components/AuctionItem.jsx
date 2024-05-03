import React from 'react';
import './AuctionItem.css';
import { useState } from 'react';

function AuctionItem({ item, contract, accounts, web3 }) {

  let [price,setPrice] = useState(web3.utils.fromWei(item.highestBid,'ether'));

  const placeBid = async (itemId, bidAmount) => {
    bidAmount = prompt("Enter your bid amount in ETH:");
    if (bidAmount !== null) {
      await contract.methods.bid(itemId).send({
        from: accounts[0],
        value: web3.utils.toWei(bidAmount, 'ether')
      });
      setPrice(bidAmount)
    }
  };

  const buyout = async (itemId) => {
    const itemDetails = await contract.methods.items(itemId).call();
    await contract.methods.buyout(itemId).send({
      from: accounts[0],
      value: itemDetails.buyoutPrice
    });
  };

  let isEnded = "card " + (item.ended ? "disabled" : "");
  
  return (
    <div className={isEnded}>
      <img src={item.imageUrl} alt={item.name} />
      <h2>{item.name}</h2>
      <p className="bid-info">Current Bid Price: {Number(price)} AUC</p>
      <p className="buyout-info">Buyout Price: {web3.utils.fromWei(item.buyoutPrice, 'ether')} AUC</p>
      
      <p className='status-active'>{item.ended ? "EXPIRED" : "ACTIVE"}</p>
  
      <button className="bid-button" onClick={() => placeBid(item.id)} disabled = {item.ended}>Place Bid</button>
      <button className="buyout-button" onClick={() => buyout(item.id)} disabled = {item.ended}>Buy Now</button>
    </div>
  );
}

export default AuctionItem;

import React from 'react';
import './AuctionItem.css';
import { useState } from 'react';

function AuctionItem({ item, contract, accounts, web3 }) {

  const [price,setPrice] = useState(web3.utils.fromWei(item.highestBid,'ether'));
  const [isExpired,setExpired] = useState(item.ended);

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
    setExpired(true);
  };

  let isEnded = "card " + (isExpired ? "disabled" : "");
  
  return (
    <div className={isEnded}>
      <img src={item.imageUrl} alt={item.name} />
      <h2>{item.name}</h2>
      <p className="bid-info">Current Bid Price: {Number(price)} AUC</p>
      <p className="buyout-info">Buyout Price: {web3.utils.fromWei(item.buyoutPrice, 'ether')} AUC</p>
      
      <p className='status-active'>{isExpired ? "EXPIRED" : "ACTIVE"}</p>
  
      <button className="bid-button" onClick={() => placeBid(item.id)} disabled = {isExpired}>Place Bid</button>
      <button className="buyout-button" onClick={() => buyout(item.id)} disabled = {isExpired}>Buy Now</button>
    </div>
  );
}

export default AuctionItem;

import React from 'react';
import './AuctionItem.css';

function AuctionItem({ item, contract, accounts, web3 }) {
  const placeBid = async (itemId, bidAmount) => {
    bidAmount = prompt("Enter your bid amount in ETH:");
    if (bidAmount !== null) {
      await contract.methods.bid(itemId).send({
        from: accounts[0],
        value: web3.utils.toWei(bidAmount, 'ether')
      });
    }
  };

  const buyout = async (itemId) => {
    const itemDetails = await contract.methods.items(itemId).call();
    await contract.methods.buyout(itemId).send({
      from: accounts[0],
      value: itemDetails.buyoutPrice
    });
  };

  return (
    <div className="card">
      <img src={item.imageUrl} alt={item.name} />
      <h2>{item.name}</h2>
      <p className="bid-info">Current Bid Price: {web3.utils.fromWei(item.highestBid, 'ether')} ETH</p>
      <p className="buyout-info">Buyout Price: {web3.utils.fromWei(item.buyoutPrice, 'ether')} ETH</p>
      <button className="bid-button" onClick={() => placeBid(item.id)}>Place Bid</button>
      <button className="buyout-button" onClick={() => buyout(item.id)}>Buy Now</button>
    </div>
  );
}

export default AuctionItem;

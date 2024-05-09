import React from 'react';
import './AuctionItemLandscape.css';

function AuctionItemLandscape({ web3, item, endAuction }) {
    const { imageUrl, name, highestBid, buyoutPrice, ended } = item;

    return (
        <div className="auction-item-landscape">
            <img src={imageUrl} alt={name} className="auction-item-landscape-image" />
            <div className="auction-item-landscape-info">
                <h2>{name}</h2>
                <p>Current Bid: {Number(web3.utils.fromWei(highestBid,'ether'))} AUC</p>
                <p>Buyout price: {Number(web3.utils.fromWei(buyoutPrice, 'ether'))} AUC</p>
                <p>Status: {ended ? "Ended": "Active"}</p>
                { !ended &&
                    <button className="end-auction-button" onClick={() => endAuction(item.id)}>End Auction</button>
                }
            </div>
        </div>
    );
}

export default AuctionItemLandscape;

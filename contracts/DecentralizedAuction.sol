// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedAuction {
    struct Item {
        uint id;
        address payable seller;
        string name;
        string imageUrl;
        uint minBid;
        uint buyoutPrice;
        uint auctionEndTime;
        address highestBidder;
        uint highestBid;
        bool ended;
    }

    Item[] public items;
    mapping(address => uint) public pendingReturns;

    event AuctionCreated(uint itemId, string name, uint minBid, uint buyoutPrice, uint auctionEndTime);
    event HighestBidIncreased(uint itemId, address bidder, uint amount);
    event AuctionEnded(uint itemId, address winner, uint amount);
    event ItemBoughtOut(uint itemId, address buyer, uint amount);

    constructor() {
        addItem("Vintage Phone", "https://m.media-amazon.com/images/I/71tQC-279uL.jpg", 1 ether, 5 ether, 180 minutes);
        addItem("Record Player", "https://ii1.pepperfry.com/media/catalog/product/g/o/494x544/gold-brass-and-wood-embossed-horn-and-gramophone-by-exim-decor-gold-brass-and-wood-embossed-horn-and-fjizt5.jpg", 2 ether, 7 ether, 180 minutes);
        addItem("Aladdin Movie Prop", "https://multiwood.com.pk/cdn/shop/products/Picsart_22-10-23_03-53-33-812_1000x1000.jpg?v=1666479726", 3 ether, 10 ether, 180 minutes);
    }

    function addItem(string memory name, string memory imageUrl, uint minBid, uint buyoutPrice, uint biddingTime) public {
        uint auctionEndTime = block.timestamp + biddingTime;
        items.push(Item({
            id: items.length,
            seller: payable(msg.sender),
            name: name,
            imageUrl: imageUrl,
            minBid: minBid,
            buyoutPrice: buyoutPrice,
            auctionEndTime: auctionEndTime,
            highestBidder: address(0),
            highestBid: 0,
            ended: false
        }));
        emit AuctionCreated(items.length - 1, name, minBid, buyoutPrice, auctionEndTime);
    }

    function bid(uint itemId) public payable {
        Item storage item = items[itemId];
        require(block.timestamp < item.auctionEndTime, "Auction already ended.");
        require(msg.value > item.highestBid, "There already is a higher bid.");
        if (item.highestBidder != address(0)) {
            pendingReturns[item.highestBidder] += item.highestBid;
        }
        item.highestBidder = msg.sender;
        item.highestBid = msg.value;
        emit HighestBidIncreased(itemId, msg.sender, msg.value);
    }

    function withdraw() public returns (bool) {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;
            if (!payable(msg.sender).send(amount)) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    function buyout(uint itemId) public payable {
        Item storage item = items[itemId];
        require(block.timestamp < item.auctionEndTime, "Auction already ended.");
        require(msg.value >= item.buyoutPrice, "Buyout price not met.");
        item.ended = true;
        item.auctionEndTime = block.timestamp;
        item.seller.transfer(msg.value);
        emit ItemBoughtOut(itemId, msg.sender, msg.value);
    }

    function endAuction(uint itemId) public {
        Item storage item = items[itemId];
        require(block.timestamp >= item.auctionEndTime, "Auction not yet ended.");
        require(!item.ended, "Auction end has already been called.");
        item.ended = true;
        if (item.highestBidder != address(0)) {
            item.seller.transfer(item.highestBid);
            emit AuctionEnded(itemId, item.highestBidder, item.highestBid);
        }
    }

    function itemsCount() public view returns (uint) {
        return items.length;
    }

}

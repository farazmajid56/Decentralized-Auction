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
        //uint auctionEndTime;
        address highestBidder;
        uint highestBid;
        bool ended;
    }

    struct User {
        string username;
        address walletAddress;
    }

    struct Refund{
        address toWallet;
        uint amount;
    }

    Item[] public items;
    mapping(address => User) public users;
    mapping(address => bool) public registered;
    // mapping(address => Refund[]) public pendingReturns;

    event UserRegistered(address userAddress, string username);
    //event AuctionCreated(uint itemId, string name, uint minBid, uint buyoutPrice, uint auctionEndTime);
    event AuctionCreated(uint itemId, string name, uint minBid, uint buyoutPrice);
    event HighestBidIncreased(uint itemId, address bidder, uint amount);
    event AuctionEnded(uint itemId, address winner, uint amount);
    event ItemBoughtOut(uint itemId, address buyer, uint amount);
    
    constructor() {
        // addItem("Vintage Phone", "https://m.media-amazon.com/images/I/71tQC-279uL.jpg", 1 ether, 5 ether, 180 minutes);
        // addItem("Record Player", "https://ii1.pepperfry.com/media/catalog/product/g/o/494x544/gold-brass-and-wood-embossed-horn-and-gramophone-by-exim-decor-gold-brass-and-wood-embossed-horn-and-fjizt5.jpg", 2 ether, 7 ether, 180 minutes);
        // addItem("Aladdin Movie Prop", "https://multiwood.com.pk/cdn/shop/products/Picsart_22-10-23_03-53-33-812_1000x1000.jpg?v=1666479726", 3 ether, 10 ether, 180 minutes);
        // addItem("Sword", "https://www.swordsantiqueweapons.com/images/s2331b.jpg", 3 ether, 10 ether, 1 minutes);
        // addItem("Flintlock", "https://www.hemswell-antiques.com/uploads/media/news/0001/95/thumb_94739_news_wide.jpeg", 3 ether, 10 ether, 3 minutes);
        // addItem("James Bond's DB5", "https://www.007.com/wp-content/uploads/2022/08/LCC-LS.jpg", 3 ether, 10 ether, 5 minutes);
        // addItem("Commodore PET", "https://i.redd.it/om995fq8j8ua1.jpg", 3 ether, 10 ether, 5 minutes);
        // addItem("HP Palmtop", "https://i.pcmag.com/imagery/lineupitems/06sRck1AimbfOxWwRYvEBqX.fit_lim.size_1050x578.v1569508748.jpg", 3 ether, 10 ether, 5 minutes);
    }

    function registerUser(string memory _username) public {
        require(!registered[msg.sender], "User already registered.");
        users[msg.sender] = User(_username, msg.sender);
        registered[msg.sender] = true;
        emit UserRegistered(msg.sender, _username);
    }

    function getUser(address _userAddress) public view returns (User memory) {
        require(registered[_userAddress], "User not registered.");
        return users[_userAddress];
    }

    function addItem(string memory name, string memory imageUrl, uint minBid, uint buyoutPrice, uint biddingTime) public {
        //uint auctionEndTime = block.timestamp + biddingTime;
        items.push(Item({
            id: items.length,
            seller: payable(msg.sender),
            name: name,
            imageUrl: imageUrl,
            minBid: minBid,
            buyoutPrice: buyoutPrice,
            //auctionEndTime: auctionEndTime,
            highestBidder: address(0),
            highestBid: 0,
            ended: false
        }));
        //emit AuctionCreated(items.length - 1, name, minBid, buyoutPrice, auctionEndTime);
        emit AuctionCreated(items.length - 1, name, minBid, buyoutPrice);
    }

    function bid(uint itemId) public payable {
        require(itemId < items.length, "Invalid Item ID");
        Item storage item = items[itemId];
        require(!item.ended, "Auction already ended");
        require(item.seller != msg.sender, "You cannot bid on your own auction");
        require(msg.value >= item.minBid, "Bid must be greater than or equal to minimum bid");
        require(msg.value > item.highestBid, "There already is a higher bid");
        require(msg.value < item.buyoutPrice, "Bid cannot be higher than buyout");

        // Refund the previous highest bidder automatically
        if (item.highestBidder != address(0)) {
            (bool success, ) = item.highestBidder.call{value: item.highestBid}("");
            require(success, "Refund to previous highest bidder failed");
        }

        // Update the highest bidder and highest bid
        item.highestBidder = payable(msg.sender);
        item.highestBid = msg.value;

        emit HighestBidIncreased(itemId, msg.sender, msg.value);

        // Check if the bid meets the buyout price
        if (msg.value >= item.buyoutPrice) {
            endAuction(itemId);
        }
    }


    function buyout(uint itemId) public payable {
        require(itemId < items.length, "Invalid Item ID");
        Item storage item = items[itemId];
        //require(block.timestamp < item.auctionEndTime, "Auction already ended.");
        require(!items[itemId].ended, "Auction already ended.");
        require(msg.value >= item.buyoutPrice, "Buyout price not met.");
        
        item.ended = true;
        //item.auctionEndTime = block.timestamp;
        
        // pendingReturns[item.highestBidder] += item.highestBid;

        if (item.highestBidder != address(0)) {
            (bool success, ) = item.highestBidder.call{value: item.highestBid}("");
            require(success, "Refund to previous highest bidder failed");
        }

        item.seller.transfer(msg.value);
        
        emit ItemBoughtOut(itemId, msg.sender, msg.value);
    }

    // function withdraw() public returns (uint) {
    //     uint amount = pendingReturns[msg.sender];
    //     if (amount > 0) {
    //         pendingReturns[msg.sender] = 0;
    //         if (!payable(msg.sender).send(amount)) {
    //             pendingReturns[msg.sender] = amount;
    //             return 0;
    //         }
    //     }
    //     return amount;
    // }


    function endAuction(uint itemId) internal {
        Item storage item = items[itemId];
        require(!item.ended, "Auction end has already been called");

        item.ended = true;

        // Transfer the highest bid amount to the seller
        item.seller.transfer(item.highestBid);

        emit AuctionEnded(itemId, item.highestBidder, item.highestBid);
    }


    // Function to manually end the auction
    function manualEndAuction(uint itemId) public {
        require(itemId < items.length, "Invalid Item ID");
        Item storage item = items[itemId];
        require(msg.sender == item.seller, "Only the seller can end this auction");
        require(!item.ended, "Auction already ended");

        endAuction(itemId);
    }


    function itemsCount() public view returns (uint) {
        return items.length;
    }

    // Retrieve all user items
    function getAllUserItems() public view returns (Item[] memory) {
        require(registered[msg.sender], "User not registered.");

        // Count the user's items
        uint count = 0;
        for (uint index = 0; index < items.length; index++) {
            if (items[index].seller == msg.sender) {
                count++;
            }
        }

        // Allocate a memory array for the user's items
        Item[] memory list = new Item[](count);

        uint counter = 0;
        for (uint index = 0; index < items.length; index++) {
            if (items[index].seller == msg.sender) {
                list[counter] = items[index];
                counter++;
            }
        }

        return list;
    }
}

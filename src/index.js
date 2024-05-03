var contract;
var userAccount;

window.addEventListener('load', async function() {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            await ethereum.enable();
            initApp();
        } catch (error) {
            console.error("User denied account access...");
            console.log(error);
        }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        initApp();
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});

function GetABI(){
    return [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "minBid",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "buyoutPrice",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "auctionEndTime",
              "type": "uint256"
            }
          ],
          "name": "AuctionCreated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "winner",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "AuctionEnded",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "bidder",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "HighestBidIncreased",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "buyer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "ItemBoughtOut",
          "type": "event"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "items",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "seller",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "imageUrl",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "minBid",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "buyoutPrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "auctionEndTime",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "highestBidder",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "highestBid",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "ended",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "pendingReturns",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "imageUrl",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "minBid",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "buyoutPrice",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "biddingTime",
              "type": "uint256"
            }
          ],
          "name": "addItem",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            }
          ],
          "name": "bid",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function",
          "payable": true
        },
        {
          "inputs": [],
          "name": "withdraw",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            }
          ],
          "name": "buyout",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function",
          "payable": true
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            }
          ],
          "name": "endAuction",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "itemsCount",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            }
          ],
          "name": "timeLeft",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function",
          "constant": true
        }
      ];
}

// function GetABI(){
//   try {
//       const response = fetch('DecentralizedAuction.json');
//       if (!response.ok) {
//           throw new Error('Failed to fetch JSON file');
//       }
//       const jsonData = response.json();
//       console.log(jsonData);
//       return jsonData.abi;
//   } catch (error) {
//       console.error('Error reading JSON file:', error);
//       return null;
//   }
// }

function initApp() {
    const abi = GetABI();
    const contractAddress = '0xE51Da7B8731f48Eb51DA203108B539deb9BE6c35';
    contract = new web3.eth.Contract(abi, contractAddress);

    web3.eth.getAccounts(function(err, accounts) {
        if (err != null) {
            console.error("An error occurred: " + err);
        } else if (accounts.length == 0) {
            console.error("No account is logged in with MetaMask");
        } else {
            userAccount = accounts[0];
            loadItems();
        }
    });
}

function loadItems() {
    contract.methods.itemsCount().call().then(function(count) {
        for (let i = 0; i < count; i++) {
            contract.methods.items(i).call().then(function(item) {
                displayItem(item, i);
            });
        }
    });
}

function displayItem(item, index) {
    const itemsContainer = document.getElementById('auctionItems');
    const etherValue = web3.utils.fromWei;
    const html = `
        <div class="card">
            <img src="${item.imageUrl}" alt="${item.name}">
            <h2>${item.name}</h2>
            <p class="bid-info">Current Bid Price: ${etherValue(item.highestBid, 'ether')} AUH</p>
            <p class="buyout-info">Buyout Price: ${etherValue(item.buyoutPrice, 'ether')} AUH</p>
            <div class="timer" id="timer-${index}">Time Left: 00:00</div>
            <button class="bid-button" onclick="placeBid(${item.id})">Place Bid</button>
            <button class="buyout-button" onclick="buyout(${item.id})">Buy Now</button>
        </div>
    `;
    itemsContainer.innerHTML += html;
    updateTimer(index, item.auctionEndTime);
}

function placeBid(itemId) {
    var bidAmount = prompt("Enter your bid amount in ETH:");
    if (bidAmount != null) {
        contract.methods.bid(itemId).send({
            from: userAccount,
            value: web3.utils.toWei(bidAmount, 'ether')
        });
    }
}

function buyout(itemId) {
    contract.methods.items(itemId).call().then(function(item) {
        contract.methods.buyout(itemId).send({
            from: userAccount,
            value: item.buyoutPrice
        });
    });
}

function updateTimer(index, endTime) {
    const timer = document.getElementById(`timer-${index}`);
    const x = setInterval(function() {
        let now = new Date().getTime();
        let distance = endTime * 1000 - now;
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        timer.innerHTML = `Time Left: ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(x);
            timer.innerHTML = "EXPIRED";
        }
    }, 1000);
}
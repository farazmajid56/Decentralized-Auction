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

async function GetContractConfigData() {
  try {
      const response = await fetch('DecentralizedAuction.json');
      if (!response.ok) {
          throw new Error('Failed to fetch DecentralizedAuction.json');
      }
      const jsonData = await response.json();
      return {abi:jsonData.abi, address:jsonData.networks['5777'].address};
  } catch (error) {
      console.error('Error reading ABI from JSON file:', error);
      return null;
  }
}

async function initApp() {
  try {
      const contractConfig = await GetContractConfigData();
      const abi = contractConfig.abi;
      const contractAddress = contractConfig.address//'0xE51Da7B8731f48Eb51DA203108B539deb9BE6c35';
      console.log("Contract Address: " + contractAddress)
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
  }catch (error) {
    console.error("Failed to initialize the app with ABI:", error);
  }
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
    console.log("Starting Timmer for Item at Index : " + index);
    const timer = document.getElementById(`timer-${index}`);
    const x = setInterval(function() {
        console.log("Running Timmer for Item at Index : " + index);
        let now = new Date().getTime();
        let distance = endTime * 1000 - now;
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        timer.innerHTML = `Time Left: ${hours}h ${minutes}m ${seconds}s`;

        if (distance < 0) {
            clearInterval(x);
            console.log("Stopping Timmer for Item at Index : " + index);
            timer.innerHTML = "EXPIRED";
        }
    }, 1000);
}
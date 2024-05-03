import React, { useEffect, useState, useContext } from 'react';
import { Web3Context } from './Web3Context';
import AuctionItem from './components/AuctionItem';  // Assume you have an AuctionItem component

const App = () => {
  const { web3, accounts, contract } = useContext(Web3Context);
  const [items, setItems] = useState([]);

  // Function to load items from the blockchain
  const loadItems = async () => {
    const itemCount = await contract.methods.itemsCount().call();
    const loadedItems = [];
    for (let i = 0; i < itemCount; i++) {
      let item = await contract.methods.items(i).call();
      loadedItems.push(item);
    }
    setItems(loadedItems);
  };

  useEffect(() => {
    if (contract) {
      loadItems();
    }
  }, [contract]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Decentralized Auction House</h1>
      </header>
      <div className="item-list">
        {items.map((item, index) => (
          <AuctionItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default App;

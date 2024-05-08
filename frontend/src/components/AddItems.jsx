import React, { useState } from 'react';
import Web3 from 'web3';
import './AddItems.css';

const imageOptions = [
  { label: "Vintage Phone", url: "https://m.media-amazon.com/images/I/71tQC-279uL.jpg" },
  { label: "Record Player", url: "https://ii1.pepperfry.com/media/catalog/product/g/o/494x544/gold-brass-and-wood-embossed-horn-and-gramophone-by-exim-decor-gold-brass-and-wood-embossed-horn-and-fjizt5.jpg" },
  { label: "Aladdin Movie Prop", url: "https://multiwood.com.pk/cdn/shop/products/Picsart_22-10-23_03-53-33-812_1000x1000.jpg?v=1666479726" },
  { label: "Sword", url: "https://www.swordsantiqueweapons.com/images/s2331b.jpg" },
  { label: "Flintlock", url: "https://www.hemswell-antiques.com/uploads/media/news/0001/95/thumb_94739_news_wide.jpeg" },
  { label: "James Bond's DB5", url: "https://www.007.com/wp-content/uploads/2022/08/LCC-LS.jpg" },
  { label: "Commodore PET", url: "https://i.redd.it/om995fq8j8ua1.jpg" },
  { label: "HP Palmtop", url: "https://i.pcmag.com/imagery/lineupitems/06sRck1AimbfOxWwRYvEBqX.fit_lim.size_1050x578.v1569508748.jpg" }
];

const AddItems = ({ web3, accounts, contract, back }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [minBid, setMinBid] = useState('');
  const [buyoutPrice, setBuyoutPrice] = useState('');
  const [biddingTime, setBiddingTime] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!web3) {
      alert('Web3 is not initialized. Ensure MetaMask is connected.');
      return;
    }

    const finalImageUrl = useCustomUrl ? customImageUrl : imageUrl;

    if (!finalImageUrl) {
      alert('Please provide an image URL.');
      return;
    }

    try {
      // Convert biddingTime to seconds (if entered in minutes)
      const biddingTimeInSeconds = 100 * 60;

      await contract.methods.addItem(
        name,
        finalImageUrl,
        Web3.utils.toWei(minBid, 'ether'), // Assuming minBid and buyoutPrice are in Ether
        Web3.utils.toWei(buyoutPrice, 'ether'),
        biddingTimeInSeconds
      ).send({ from: accounts[0] });

      alert('Item added successfully!');
      // Optionally reset state here
      setName('');
      setImageUrl('');
      setCustomImageUrl('');
      setUseCustomUrl(false);
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
        {!useCustomUrl ? (
          <>
            <select value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required>
              <option value="">Select an Image URL</option>
              {imageOptions.map((option, index) => (
                <option key={index} value={option.url}>{option.label}</option>
              ))}
            </select>
            <button type="button" onClick={() => setUseCustomUrl(true)}>Set Custom URL</button>
          </>
        ) : (
          <>
            <input type="text" value={customImageUrl} onChange={(e) => setCustomImageUrl(e.target.value)} required />
            <button type="button" onClick={() => setUseCustomUrl(false)}>Use Dropdown</button>
          </>
        )}
      </label>
      <label>
        Minimum Bid (ETH):
        <input type="number" value={minBid} onChange={(e) => setMinBid(e.target.value)} required />
      </label>
      <label>
        Buyout Price (ETH):
        <input type="number" value={buyoutPrice} onChange={(e) => setBuyoutPrice(e.target.value)} required />
      </label>
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItems;

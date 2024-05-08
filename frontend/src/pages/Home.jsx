import './Home.css'

import AuctionItem from '../components/AuctionItem'; // Component for auction items
import NavBar from '../components/NavBar';
import AddItems from '../components/AddItems'
import AuctionItemLandscape from '../components/AuctionItemLandscape';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Home = ({ items, userItems, contract, accounts, web3, isOpenAddItemsPage, toggleAddItemsPage, username, walletAddress, openUserAuctions, toggleFeed, withdrawRefunds }) =>{

    return(
        <>
        <NavBar 
            username = {username} 
            walletAddress = {walletAddress}
            openUserAuctions = {openUserAuctions}
            withdrawRefunds = {withdrawRefunds}
        />
        {isOpenAddItemsPage ? (
            <AddItems 
            contract={contract} 
            accounts={accounts} 
            web3={web3} 
            back={toggleAddItemsPage} 
            walletAddress = {walletAddress}
            />
        ) : (
            <div className="App">
            <button className='btn-addItem' onClick={toggleAddItemsPage}>
                <FontAwesomeIcon icon={faPlus} size="2x" />
            </button>

            {
                !toggleFeed ? (
                    <div className='userAuction'>
                        {
                            userItems.map(
                                (item) => (
                                    <AuctionItemLandscape web3 = {web3} item={item}/>
                                )
                            )
                        }
                    </div>
                ) : (
                    <div className="feed">
                        {items.map((item, index) => (
                        <AuctionItem 
                            key={index} 
                            item={item} 
                            contract={contract} 
                            accounts={accounts} 
                            web3={web3} 
                        />
                        ))}
                    </div>
                )
            }

            </div>
        )}
        </>
    );
}

export default Home;
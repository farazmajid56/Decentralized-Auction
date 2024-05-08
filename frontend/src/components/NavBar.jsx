import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faGavel, faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';

const NavBar = ({ username, walletAddress, openUserAuctions, withdrawRefunds }) => {
    return (
        <div className="header-container">
            <div className="btn-user-auctions">
                <button className="icon-button" onClick={openUserAuctions}>
                    <FontAwesomeIcon icon={faGavel} size="2x" />
                    <p id="btn-user-auctions-txt">Your Auctions</p>
                </button>
            </div>            
            <div className="btn-user-auctions">
                <button className="icon-button" onClick={withdrawRefunds}>
                <FontAwesomeIcon icon={faMoneyBillTransfer} size="2x"/>
                    <p id="btn-user-auctions-txt">Withdraw Refunds</p>
                </button>
            </div>
            <div className="title-bar">
                <h1>Decentralized Auction House</h1>
                <p>By: Faraz Majid 20L-1162 & Aemon Fatima 20L-1057</p>
            </div>
            <div className="user-info">
                <FontAwesomeIcon icon={faUserCircle} size="4x" />
                <div className="user-details">
                    <p id="userName">{username}</p>
                    <p id="walletAdd">{walletAddress}</p>
                </div>
            </div>
        </div>
    );
}

export default NavBar;

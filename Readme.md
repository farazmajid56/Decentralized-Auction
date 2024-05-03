
# Decentralized Auction House
A decentralized auction platform developed using Solidity for smart contracts and React.js for the frontend interface.

## Features

- **User Authentication:** Allows users to sign up and log in to the platform.
- **Add Items:** Users can list items for auction with a minimum bid requirement.
- **Place Bids:** Participants can bid on available auction items.
- **Buyout Option:** Allows immediate purchase of an item at the buyout price.
- **Responsive Design:** Ensures a seamless experience across different devices.

## Setup Guide

### Backend Setup:
Ensure you have [Node.js](https://nodejs.org/), [Truffle Suite](https://www.trufflesuite.com/), and [Ganache](https://www.trufflesuite.com/ganache) installed on your machine to proceed with the following steps:

1. **Start Ganache:**
   - Open Ganache and start a local blockchain instance.

2. **Compile and Deploy Contracts:**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Compile the smart contracts:
     ```bash
     truffle compile
     ```
   - Deploy the contracts to the local blockchain:
     ```bash
     truffle migrate
     ```
     Or, to reset the state of previously deployed contracts:
     ```bash
     truffle migrate --reset
     ```

3. **Integrate Contract with Frontend:**
   - Copy the contract's JSON file to the frontend:
     ```bash
     cp /backend/build/contracts/DecentralizedAuction.json /frontend/src/
     ```

4. **Finalize Backend Setup:**
   - Ensure all steps are completed without errors.

### Frontend Setup:
Ensure you have [npm](https://www.npmjs.com/) installed to manage dependencies.

1. **Prepare the Frontend Environment:**
   - Change to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install necessary dependencies:
     ```bash
     npm install
     ```

2. **Launch the Frontend Application:**
   - Start the application:
     ```bash
     npm start
     ```
   - This will open the web application in your default browser, typically accessible at `http://localhost:3000`.

3. **Verify Operation:**
   - Interact with the application to ensure all functionalities such as adding items, bidding, and buyout are working correctly.

## Additional Information
- Ensure your browser has the MetaMask extension installed and connected to the local blockchain provided by Ganache to interact with the deployed contracts.
- The platform can be extended or modified to include additional features such as a more advanced bidding mechanism or integration with real-world auction standards.
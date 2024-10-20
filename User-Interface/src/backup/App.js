import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Web3 from 'web3';
import FiatToEurBoC from './pages/FiatToEurBoC';
import Marketplace from './pages/Marketplace';
import BoCLoginAndFetch from './pages/BoCLoginAndFetch'; // Import BoC login component
import realEstateMarketplaceAbi from './abis/RealEstateMarketplace.json';
import EurBoCAbi from './abis/EurBoC.json';
import realEstateNFTAbi from './abis/RealEstateNFT.json';

// Import the local database JSON
import database from './database.json'; // Simulate a database with JSON

const TARGET_NETWORK = {
  chainId: '0xE708', // Correct Hex for 59144
  chainName: 'Linea Mainnet',
  rpcUrls: ['https://linea-mainnet.infura.io/v3/'],
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  blockExplorerUrls: ['https://lineascan.build'],
};

const REAL_ESTATE_MARKETPLACE_ADDRESS = "0x3dCaF589421F5Dc08cE20C6Dce95F9337530CFCF";
const EURBOC_ADDRESS = "0xd4AAF6Db249BFeA8be5B34fd719029df56E279A8";
const REAL_ESTATE_NFT_ADDRESS = "0x599f2B7407d4976fB25358e9D79a639eA251C2Ad";

function App() {
    const [account, setAccount] = useState(null); // MetaMask wallet account
    const [web3, setWeb3] = useState(null);
    const [realEstateMarketplaceContract, setRealEstateMarketplaceContract] = useState(null);
    const [eurBoCContract, setEurBoCContract] = useState(null);
    const [realEstateNFTContract, setRealEstateNFTContract] = useState(null);
    const [error, setError] = useState('');
    const [accountsData, setAccountsData] = useState([]); // Account data from database
    const [loggedInAccount, setLoggedInAccount] = useState(null); // Stores the logged-in account number
    const [inputAccountNumber, setInputAccountNumber] = useState(''); // Input for account number

    useEffect(() => {
        // Load the database JSON into state
        setAccountsData(database); // Simulates loading from the database
        
        if (window.ethereum) {
            const web3Instance = new Web3(window.ethereum);
            setWeb3(web3Instance);

            try {
                const realEstateNFT = new web3Instance.eth.Contract(realEstateNFTAbi, REAL_ESTATE_NFT_ADDRESS);
                const realEstateMarketplace = new web3Instance.eth.Contract(realEstateMarketplaceAbi, REAL_ESTATE_MARKETPLACE_ADDRESS);
                const eurBoC = new web3Instance.eth.Contract(EurBoCAbi, EURBOC_ADDRESS);

                setRealEstateNFTContract(realEstateNFT); // NFT contract
                setRealEstateMarketplaceContract(realEstateMarketplace); // Marketplace contract
                setEurBoCContract(eurBoC); // EurBoC contract
            } catch (err) {
                console.error('Contract initialization failed', err);
                setError('Contract initialization failed');
            }
        }
    }, []);

    // Function to handle account login
    const handleLogin = () => {
        const foundAccount = accountsData.find(account => account["Account Number"] === inputAccountNumber);
        if (foundAccount) {
            setLoggedInAccount(foundAccount); // Store the logged-in account
        } else {
            setError('Account number not found');
        }
    };

    // Connect to MetaMask
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                setAccount(accounts[0]);
                await switchNetwork();
            } catch (err) {
                console.error('MetaMask connection failed', err);
                setError('MetaMask connection failed');
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    // Disconnect Wallet
    const disconnectWallet = () => {
        setAccount(null); // Reset the account state
    };

    // Switch Network if needed
    const switchNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: TARGET_NETWORK.chainId }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [TARGET_NETWORK],
                    });
                } catch (addError) {
                    console.error('Failed to add network', addError);
                    setError('Failed to add network');
                }
            } else {
                setError('Network switch failed');
            }
        }
    };

    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li><Link to="/fiat">Convert Fiat to EurBoC</Link></li>
                        <li><Link to="/marketplace">Real Estate Marketplace</Link></li>
                        <li><Link to="/boc-login">Login to BoC</Link></li>
                    </ul>
                </nav>

                {/* If the user is not logged in, show login form */}
                {!loggedInAccount && (
                    <div>
                        <h2>Login</h2>
                        <input
                            type="text"
                            placeholder="Enter Account Number"
                            value={inputAccountNumber}
                            onChange={(e) => setInputAccountNumber(e.target.value)}
                        />
                        <button onClick={handleLogin}>Login</button>
                    </div>
                )}

                {/* Show "Connect Wallet" button only if the user is logged in */}
                {loggedInAccount && !account && (
                    <div>
                        <p>Logged in as {loggedInAccount["Account Owner"]}</p>
                        <button onClick={connectWallet}>Connect Wallet</button>
                    </div>
                )}

                {/* Show connected wallet info if the wallet is connected */}
                {account && (
                    <div>
                        <p>Connected Wallet: {account}</p>
                        <button onClick={disconnectWallet}>Disconnect Wallet</button>
                    </div>
                )}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <Routes>
                    <Route 
                        path="/fiat" 
                        element={<FiatToEurBoC EurBoCContract={eurBoCContract} account={account} />} 
                    />
                    <Route 
                      path="/marketplace" 
                      element={
                        <Marketplace 
                          realEstateContract={realEstateMarketplaceContract} 
                          eurBoCContract={eurBoCContract} 
                          realEstateNFTContract={realEstateNFTContract} 
                          account={account} 
                        />
                      } 
                    />
                    <Route 
                      path="/boc-login" 
                      element={<BoCLoginAndFetch accountsData={accountsData} />} // Pass the account data to BoC login
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

// SPDX-License-Identifier: MIT

// Author: Konstantinos Andreou 18/10/2024
// 
// EurBoC is a stable-coin fiat pegged with the euro, developed during BoCHackathon.
// This smart contract is in the development phase and is intended for hackathon purposes.
//
// Contract Overview:
// The EurBoC contract represents a stablecoin pegged to the euro.
// It allows users to convert fiat into EurBoC tokens and utilize them in decentralized applications.
// The contract owner has minting privileges to control token issuance.
// The contract owner can verify wallets to use this token.
// Further security measures are required before deploying this in a production environment.


pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EurBoC is ERC20, Ownable {

    mapping(address => bool) public verifiedUsers; // KYC-compliant users

    // Events for minting, burning, and KYC verification
    event Minted(address indexed user, uint256 amount);
    event Burned(address indexed user, uint256 amount);
    event VerifiedUser(address indexed user);

    constructor() ERC20("EurBoC Stablecoin", "EurBoC") Ownable(msg.sender) {
        _mint(msg.sender, 0 * 10 ** decimals());  // Initial supply set to 0
    }
    
    // Function to verify users (done by the bank/admin)
    function verifyUser(address user) public onlyOwner {
        verifiedUsers[user] = true;
        emit VerifiedUser(user);
    }

    // Mint EurBoC, only for verified users
    function mint(address to, uint256 amount) public onlyOwner {
        require(verifiedUsers[to], "User not KYC-verified");
        _mint(to, amount);
        emit Minted(to, amount);
    }

    // Burn EurBoC, only accessible by owner (bank)
    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
        emit Burned(from, amount);
    }

    // Only verified users can receive tokens
    modifier onlyVerifiedRecipient(address recipient) {
        require(verifiedUsers[recipient], "Recipient is not KYC-verified");
        _;
    }

    // Transfer function, only to verified recipients
    function transfer(address recipient, uint256 amount) public override onlyVerifiedRecipient(recipient) whenNotPaused returns (bool) {
        return super.transfer(recipient, amount);
    }

    // TransferFrom function, only to verified recipients
    function transferFrom(address sender, address recipient, uint256 amount) public override onlyVerifiedRecipient(recipient) whenNotPaused returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }

    // Allow the owner (bank) to pause the contract in emergencies (regulatory requirements)
    bool public paused = false;

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    function pause() public onlyOwner {
        paused = true;
    }

    function unpause() public onlyOwner {
        paused = false;
    }
}

// SPDX-License-Identifier: MIT

/**
 * Author: Konstantinos Andreou
 * Date: 18/10/2024
 *
 * Each NFT corresponds to a property, with attributes such as name, description, location, and property type.
 *
 *
 * Description:
 * This contract is designed to tokenize real estate assets as NFTs. It allows the minting of new real estate NFTs, 
 * fetching property details, and tracking the total supply of minted properties. It is developed as part of the BoCHackathon project.
 */

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateNFT is ERC721, Ownable {
    uint256 public nextTokenId;

    struct Property {
        string name;
        string description;
        string location; // Address or GPS coordinates
        string propertyType; // Residential, Commercial, etc.
        string imageURL; // Image of the property
    }

    mapping(uint256 => Property) public properties;

    constructor() ERC721("RealEstateNFT", "REAL-ESTATE-BoC") Ownable(msg.sender) {}

    function mintRealEstate(
        address to,
        string memory name,
        string memory description,
        string memory location,
        string memory propertyType,
        string memory imageURL
    ) public onlyOwner {
        properties[nextTokenId] = Property(name, description, location, propertyType, imageURL);
        _mint(to, nextTokenId);
        nextTokenId++;
    }

    function getPropertyDetails(uint256 tokenId) public view returns (Property memory) {
        return properties[tokenId];
    }

    function totalSupply() public view returns (uint256) {
        return nextTokenId;
    }

}

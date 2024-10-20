
// SPDX-License-Identifier: MIT


/**
 * Author: Konstantinos Andreou
 * Date: 18/10/2024
 * This contract allows users to list their real estate NFTs for sale, and others to buy the NFTs
 * using the EurBoC token. It integrates with both the EurBoC and RealEstateNFT contracts.
 *
 *
 * Description:
 * This contract allows users to list and purchase real estate NFTs. Properties (represented as NFTs)
 * are listed with a price in EurBoC, and verified buyers can purchase them using the stablecoin.
 */

pragma solidity ^0.8.0;

import "./EurBoc_new.sol";
import "./RealEstateNFT.sol";

contract RealEstateMarketplace {
    EurBoC public EurBoCToken;
    RealEstateNFT public realEstateNFT;
    address public owner;

    struct Listing {
        uint256 price;
        address seller;
    }

    mapping(uint256 => Listing) public listings;

    constructor(EurBoC _EurBoCToken, RealEstateNFT _realEstateNFT) {
        EurBoCToken = _EurBoCToken;
        realEstateNFT = _realEstateNFT;
        owner = msg.sender;
    }

    function listProperty(uint256 tokenId, uint256 price) public {
        require(realEstateNFT.ownerOf(tokenId) == msg.sender, "You do not own this property.");
        listings[tokenId] = Listing(price, msg.sender);
    }

    function buyProperty(uint256 tokenId) public {
        Listing memory listing = listings[tokenId];
        require(listing.price > 0, "Property is not for sale.");

        // Transfer EurBoC from buyer to seller
        EurBoCToken.transferFrom(msg.sender, listing.seller, listing.price);

        // Transfer the NFT (property) to buyer
        realEstateNFT.safeTransferFrom(listing.seller, msg.sender, tokenId);

        // Remove the listing after purchase
        delete listings[tokenId];
    }

    function getListingDetails(uint256 tokenId) public view returns (uint256, address) {
        Listing memory listing = listings[tokenId];
        return (listing.price, listing.seller);
    }
}

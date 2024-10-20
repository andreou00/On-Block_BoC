import React from 'react';
import './About.css'; 

function About() {
    return (
        <div className="about">
            <h1 className="about-title">About Our Platform</h1>
            <p className="about-description">
                Our platform, <strong>On Block-BoC</strong>, is designed to revolutionize the real estate market using 
                the power of blockchain technology. We aim to provide a seamless, transparent, and 
                secure solution for buying, selling, and transferring real estate ownership through 
                NFTs (Non-Fungible Tokens) and a fiat-pegged stablecoin, EurBoC.
            </p>
            <p className="about-mission">
                By digitizing real estate ownership and embedding these assets on the blockchain, 
                we ensure that property transfers are instantaneous, secure, and cost-effective. 
                Our system also facilitates seamless fiat-to-blockchain transactions using the EurBoC 
                stablecoin, pegged 1:1 to the euro.
            </p>
            
            <h2>Smart Contracts</h2>
            <ul className="contracts">
                <li>
                    <strong>EurBoC Stablecoin (EurBoC)</strong> – Our fiat-pegged stablecoin contract: 
                    <a href="https://lineascan.build/address/0xd4aaf6db249bfea8be5b34fd719029df56e279a8#code" target="_blank" rel="noopener noreferrer">
                        View on LineaScan
                    </a>
                </li>
                <li>
                    <strong>RealEstateNFT</strong> – This contract tokenizes real estate assets as NFTs: 
                    <a href="https://lineascan.build/address/0x599f2b7407d4976fb25358e9d79a639ea251c2ad#code" target="_blank" rel="noopener noreferrer">
                        View on LineaScan
                    </a>
                </li>
                <li>
                    <strong>Real Estate Marketplace</strong> – A decentralized platform to buy and sell tokenized properties:
                    <a href="https://lineascan.build/address/0x3dCaF589421F5Dc08cE20C6Dce95F9337530CFCF" target="_blank" rel="noopener noreferrer">
                        View on LineaScan
                    </a>
                </li>
            </ul>

            <h2>Why Our Platform is Unique</h2>
            <p>
                Our platform stands out because it merges <strong>traditional banking compliance</strong> with the 
                <strong> innovative capabilities of blockchain technology</strong>. Key features include:
            </p>
            <ul className="platform-features">
                <li><strong>KYC Verified Users</strong>: Every user must be verified wallet on blockchain, ensuring compliance with financial regulations.</li>
                <li><strong>Tokenized Real Estate</strong>: Property ownership is digitized and stored as NFTs, making transfers instant and secure.</li>
                <li><strong>EURBoC Stablecoin</strong>: Fiat-pegged currency that ensures liquidity and stability in the decentralized world.</li>
                <li><strong>Transaction Security</strong>: Our system leverages the immutable, transparent nature of the blockchain to prevent fraud and ensure trust.</li>
                <li><strong>Integration with Traditional Finance</strong>: We bring together the world of traditional banking and DeFi to create new, innovative ways of transacting securely.</li>
            </ul>

            <h2>About the Creator</h2>
            <p>
                This platform was developed by <strong>Konstantinos Andreou</strong>. My linkedIn profile:
                <a href="https://www.linkedin.com/in/andreou00/" target="_blank" rel="noopener noreferrer"> LinkedIn</a>.
            </p>

            <p className="about-call">
                Join us in revolutionizing digital transactions. The future is digital, and <strong>On Block-BoC</strong> is leading the way!
            </p>
        </div>
    );
}

export default About;

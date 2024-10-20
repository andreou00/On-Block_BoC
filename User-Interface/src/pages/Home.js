import React from 'react';
import './Home.css'; // Create a separate CSS file for Home-specific styles

function Home() {
    return (
        <div className="home">
            <h1 className="home-title">Welcome to On Block-BoC!</h1>
            <p className="home-description">
                Discover the future of real estate and digital-Euro, powered by cutting-edge blockchain technology. 
                On Block-BoC is revolutionizing the way real estate is bought, sold, and managed 
                through tokenization. With us, every property is transformed into a digital asset 
                backed by real-world value.
            </p>
            <p className="home-invite">
                Ready to dive into the future? Get started by logging into your BoC account, 
                connecting your crypto wallet, and explore the endless possibilities!
            </p>
            <p className="home-highlight">
                Join us in shaping the future of real estate – where every property transaction 
                is fast, secure, and accessible with just a few clicks.
            </p>
        </div>
    );
}

export default Home;

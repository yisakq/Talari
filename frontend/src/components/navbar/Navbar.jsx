import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import "./Navbar.scss";
import Logo from '../../assets/tlogo.svg';
import { IoMenu } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { openMetaMaskApp } from '../../wallet';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
    onError(error) {
      console.error("Connection Error:", error);
    },
  });

  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    // Navigate to /transaction if the user is connected and they refresh the page
    if (isConnected && location.pathname === '/') {
      navigate('/transaction');
    }
  }, [isConnected, navigate, location]);

  const handleConnect = async () => {
    try {
      await connect();
      openMetaMaskApp();
      if (isConnected) {
        console.log("Wallet connected:", address);
        localStorage.setItem('walletConnected', 'true');
        navigate('/transaction');
      } 
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = async (event) => {
    event.preventDefault(); // Prevent default link behavior

    try {
      await disconnect();
      localStorage.removeItem('walletConnected');
      console.log("Wallet disconnected");

      // Delay the navigation slightly to ensure disconnect completes
      setTimeout(() => {
        navigate('/');
      }, 100); // Adjust delay as necessary
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  // Check if wallet was previously connected on mount
  useEffect(() => {
    const walletConnected = localStorage.getItem('walletConnected');
    if (walletConnected === 'true') {
      handleConnect();
    }
  }, []);

  return (
    <header className="navbar">
      <nav className="navbar_container wrapper">
        <Link to={isConnected ? "/transaction" : "/"} className="navbar_logo" onClick={() => setShowNav(false)}>
          <img src={Logo} alt="logo" />
        </Link>

        <div className="btn">
          {isConnected ? (
            <Link to="/" onClick={handleDisconnect}>Disconnect Wallet</Link>
          ) : (
            <Link onClick={handleConnect}>Connect Wallet</Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

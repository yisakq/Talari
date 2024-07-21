import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Hero from './components/hero/Hero';
import Factors from './components/factors/Factors';
import Transaction from './transaction';
import Footer from './components/footer/Footer';
import { WagmiConfig, createClient, configureChains } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { publicProvider } from 'wagmi/providers/public';

// Define the Sepolia chain
const sepolia = {
  id: 11155111,
  name: 'Sepolia Test Network',
  network: 'sepolia',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'SepoliaETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.org'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
  testnet: true,
};

// Configure chains
const { chains, provider } = configureChains(
  [sepolia],
  [publicProvider()],
);

// Create wagmi client
const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
});

function App() {
  return (
    <WagmiConfig client={client}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transaction" element={<Transaction />} />
        </Routes>
        <ConditionalFooter />
      </Router>
    </WagmiConfig>
  );
}

const Home = () => (
  <>
    <Hero />
    <Factors />
  </>
);

const ConditionalFooter = () => {
  const location = useLocation();

  return location.pathname === '/' ? <Footer /> : null;
};

export default App;

import  './Hero.scss';
import Mob from '../../assets/ethlogo.svg';
import Aos from 'aos';
import "aos/dist/aos.css";
import { Link,useNavigate} from 'react-router-dom';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import {useEffect} from 'react'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { openMetaMaskApp } from '../../wallet';

const Hero = () => {
    useEffect(()=>{
        Aos.init({duration:1000});
    });
    const navigate = useNavigate();
    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new MetaMaskConnector(),
        onError(error) {
          console.error("Connection Error:", error);
        },
      });

      const handleConnect = async () => {
        try {
          await connect();
          if (isConnected) {
            console.log("Wallet connected:", address);
            localStorage.setItem('walletConnected', 'true');
            navigate('/transaction');
          } 
        } catch (error) {
          console.error("Failed to connect wallet:", error);
        }
      };
    
  return (
        <section className='hero'>
           <div className='hero_container wrapper'>
            <div className='hero_left' data-aos="fade-right">
                <img src={Mob} alt=""/>
            </div>
                
                <div className='hero_right' data-aos="zoom-in-up">
                   <h1>Make easier your crypto transactions.</h1>
                   <p>
                   Our platform allows you to send and receive cryptocurrency quickly, securely, and affordably. Join the revolution in decentralized finance today and take control of your financial future. Log in now to start using our platform and experience the freedom of decentralized transactions.
                   </p>
                   <Link onClick={handleConnect} className="btn">TRY FOR FREE</Link>
                </div>
           </div>
        </section>
  )
}

export default Hero
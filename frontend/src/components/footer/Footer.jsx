import './Footer.scss';
import Logo from '../../assets/tlogo.svg'
import {FaFacebookF,FaInstagram,FaTwitter,FaLinkedinIn} from 'react-icons/fa' 
import Aos from 'aos';
import "aos/dist/aos.css";    

import {useEffect} from 'react';
const Footer = () => {

  useEffect(() => {
    Aos.init({duration:1000});
  });
  return (
    <footer className='footer'>
     <div className="footer_container wrapper" data-aos="fade-up">
      <div className='footer_col'>
        <img src={Logo} alt="logo" />
        <p>Your Financial Redemption
        </p>
      </div>
      <div className="footer_col"> 
        <h3>About</h3>
        <a href="#">about us</a>
        <a href="#">features</a>
        <a href="#">news</a>

      </div>
      
      <div className="footer_col"> 
        <h3>Support</h3>
        <a href="#">FAQs</a>
        <a href="#">Support</a>
        <a href="#">Contact us</a>

      </div>
      <div className="footer_col"> 
        <h3>Socials</h3>
        <div className="footer_icons">
          <a href="#" className='footer_icon'><FaFacebookF /></a>
          <a href="#" className='footer_icon'><FaInstagram /></a>
          <a href="#" className='footer_icon'><FaTwitter /></a>
          <a href="#" className='footer_icon'><FaLinkedinIn /></a>

        </div>

      </div>
     </div>
    </footer>
  )
}

export default Footer
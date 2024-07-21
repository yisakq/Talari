import './factors.scss';
import Aos from "aos";
import {useInfo} from '../../Data';
import "aos/dist/aos.css";
import {useEffect} from 'react';
const Factors = () => {
    useEffect(() => {
        Aos.init({duration:1000});
    });
  return (
     <section className='factors'>
       <h2 data-aos="fade-up">easy and secure way for sending crypto</h2>
       <div className='factors_container wrapper'>
          {useInfo.map(({image, title, desc})=>(
            <div className="factors_card" data-aos="fade-up">
               <img src={image} alt={title} />
               <h3>{title}</h3>
               <span>{desc}</span>
            </div>
          ))}
       </div>
     </section>
  )
}

export default Factors;
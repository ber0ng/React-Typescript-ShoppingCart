import React from 'react'
import './Collections.css'
import { Link } from 'react-router-dom'
// import hand_icon from '../Assets/hand_icon.png'
// import arrow_icon from '../Assets/arrow.png'
// import hero_image from '../Assets/hero_image.png'


const Collections = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
            <div className="hero-hand-icon">
                <p>new</p>
            </div>
            <p>collections</p>
            <p>for everyone</p>
        <div className="hero-latest-btn">
            <Link to="/store" style={{ textDecoration: 'none', color: 'white' }}>
                Latest Collection
            </Link>
        </div>
      </div>
      <div className="hero-right">
        
      </div>
    </div>
  )
}

export default Collections

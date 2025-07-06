import React from 'react'
import './Footer.css'
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className='footer'>
      <p>Copyright @ {currentYear}, Cryptoplace - All Right Reserved.</p>
    </div>
  )
}

export default Footer
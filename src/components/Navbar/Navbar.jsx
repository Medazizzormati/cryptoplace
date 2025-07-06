import React, { useContext } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import arrow_icon from '../../assets/arrow_icon.png'
import { CoinContext } from '../../context/CoinContext'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const { setCurrency } = useContext(CoinContext)
  const { isAuthenticated, user, logout } = useAuth()

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd": {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
      case "eur": {
        setCurrency({ name: "eur", symbol: "€" });
        break;
      }
      case "tnd": {
        setCurrency({ name: "tnd", symbol: "DT" });
        break;
      }
      default: {
        setCurrency({ name: "usd", symbol: "$" });
        break;
      }
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className='navbar'>
      <Link to={'/'}>
        <img src={logo} alt='' className='logo' />
      </Link>
      <ul >
        <Link to={'/'}><li>Home</li></Link>
        {isAuthenticated() && (
          <Link to={'/dashboard'}><li>Dashboard</li></Link>
        )}
        <Link to={'/features'}><li>Features</li></Link>
        <Link to={'/pricing'}><li>Pricing</li></Link>
        <Link to={'/blog'}><li>Blog</li></Link>
      </ul>
      <div className='nav-right'>
        <select onChange={currencyHandler} >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="tnd">TND</option>
        </select>
        
        {isAuthenticated() ? (
          <div className='auth-buttons'>
            <Link to={'/profile'} className='profile-link'>
              👤 {user?.username || 'Profile'}
            </Link>
            <button className='logout-btn' onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className='auth-buttons'>
            <Link to={'/login'} className='login-link'>
              Login
            </Link>
            <Link to={'/signup'}>
              <button className='signup-btn'>
                Sign Up <img src={arrow_icon} alt="" />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
// Navbar.js
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import { WalletContext } from './WalletContext';
import { FaWallet, FaUserShield } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { isConnected, accountName } = useContext(WalletContext);

  return (
    <motion.nav 
      className="navbar navbar-expand-lg navbar-dark fixed-top"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)' }}
    >
      <div className="container">
        <NavLink 
          className="navbar-brand d-flex align-items-center" 
          to="/"
        >
          <FaUserShield className="me-2 text-warning" size={20} />
          <span className="fw-bold">SecureTitleZW</span>
        </NavLink>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {[
              { path: "/", name: "Home" },
              { path: "/manage-land", name: "Manage Land" },
              { path: "/admin", name: "Admin" },
              { path: "/about", name: "About" },
              { path: "/features", name: "Features" },
              { path: "/contact", name: "Contact Us" }
            ].map((item, index) => (
              <motion.li 
                key={item.path}
                className="nav-item"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <NavLink 
                  className="nav-link position-relative"
                  to={item.path}
                  end
                >
                  {item.name}
                  <span className="nav-link-underline"></span>
                </NavLink>
              </motion.li>
            ))}
          </ul>
          
          {isConnected && (
            <motion.div 
              className="ms-lg-3 mt-2 mt-lg-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="wallet-badge d-flex align-items-center p-2">
                <FaWallet className="me-2" />
                <span className="text-truncate" style={{ maxWidth: '120px' }}>
                  {accountName}
                </span>
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
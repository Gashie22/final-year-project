// LandingPage.js
import React, { useContext, useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import backgroundImage from '../assets/background.jpg';
import Navbar from './Navbar';
import About from './About';
import Features from './Features';
import Footer from './Footer';
import { WalletContext } from './WalletContext';
import { motion } from 'framer-motion';
import { FaWallet, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import { SiBlockchaindotcom } from 'react-icons/si'; 

const LandingPage = () => {
  const { isConnected, connectWallet } = useContext(WalletContext);
  const [headlineText, setHeadlineText] = useState('');
  const [subheadlineText, setSubheadlineText] = useState('');
  const [showHeadlineCursor, setShowHeadlineCursor] = useState(true);
  const [showSubheadlineCursor, setShowSubheadlineCursor] = useState(false);
  const fullHeadlineText = '  End Land Disputes. Secure Your Future.';
  const fullSubheadlineText = '_A transparent and efficient land registry system powered by blockchain for Zimbabwe.';
  const typingSpeed = 50;

  // Animation variants
  const bannerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      } 
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
    },
    tap: { 
      scale: 0.98,
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Typing effect
  useEffect(() => {
    let headlineIndex = 0;
    let subheadlineIndex = 0;
    let subheadlineInterval;

    const headlineInterval = setInterval(() => {
      if (headlineIndex < fullHeadlineText.length) {
        setHeadlineText(prev => prev + fullHeadlineText.charAt(headlineIndex));
        headlineIndex++;
      } else {
        clearInterval(headlineInterval);
        setShowHeadlineCursor(false);
        setShowSubheadlineCursor(true);
        
        subheadlineInterval = setInterval(() => {
          if (subheadlineIndex < fullSubheadlineText.length) {
            setSubheadlineText(prev => prev + fullSubheadlineText.charAt(subheadlineIndex));
            subheadlineIndex++;
          } else {
            clearInterval(subheadlineInterval);
            setShowSubheadlineCursor(false);
          }
        }, typingSpeed);
      }
    }, typingSpeed);

    return () => {
      clearInterval(headlineInterval);
      clearInterval(subheadlineInterval);
    };
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      <Navbar />
      <motion.div
        className="hero min-vh-100 d-flex flex-column justify-content-center align-items-center text-center text-white"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        initial="initial"
        animate="animate"
        variants={bannerVariants}
      >
        <div className="banner container px-4 d-flex flex-column align-items-center">
          <motion.div
            className="secure-badge d-flex align-items-center justify-content-center gap-2 mb-4 px-3 py-2"
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.03 }}
          >
            <FaShieldAlt className="text-warning" size={16} />
            <span className="fw-bold text-warning">SecureTitleZW</span>
            <SiBlockchaindotcom className="text-warning" size={16} />
          </motion.div>

          <motion.h1 className="display-3 fw-bold mb-3 text-center">
            {headlineText}
            {showHeadlineCursor && (
              <motion.span 
                className="blinking-cursor" 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                |
              </motion.span>
            )}
          </motion.h1>

          <motion.p className="lead mb-4 text-center">
            {subheadlineText}
            {showSubheadlineCursor && (
              <motion.span 
                className="blinking-cursor"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                |
              </motion.span>
            )}
          </motion.p>

          <motion.button
            onClick={connectWallet}
            className="btn btn-wallet btn-lg mt-4 px-4 py-3 d-flex align-items-center justify-content-center gap-2 mx-auto"
            disabled={isConnected}
            aria-label={isConnected ? 'Wallet Connected' : 'Connect to Ethereum Wallet'}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            style={{
              backgroundColor: isConnected ? '#28a745' : '#f6851b',
              color: 'white',
              border: 'none',
              minWidth: '240px',
              borderRadius: '12px'
            }}
          >
            {isConnected ? (
              <>
                <FaCheckCircle size={18} />
                Wallet Connected
              </>
            ) : (
              <>
                <FaWallet size={18} />
                Connect Wallet
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
      
      <About />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;
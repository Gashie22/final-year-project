import React, { createContext, useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import LandRegistry from '../contracts/LandRegistry.json';
import config from '../config';

const accountNames = {
  "0xdC2D7AaED0e3DA74827A8b20eBe1A2c4CB6729C9": "Admin",
  "0x199d9B21e062A1DEB904f5a9e5b4F47dF0a2b44D": "User 1",
};

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [networkError, setNetworkError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Current Account:', account);
    console.log('Configured Admin:', config.ADMIN_ADDRESS);
    console.log('Admin Status:', isAdmin);
  }, [account, isAdmin]);

  // Update account name and admin status when account changes
  useEffect(() => {
    if (account) {
      setAccountName(accountNames[account] || config.shortenAddress(account));
      setIsAdmin(account.toLowerCase() === config.ADMIN_ADDRESS.toLowerCase());
    } else {
      setAccountName('');
      setIsAdmin(false);
    }
  }, [account]);

  // Initialize Web3 and contract
  const initWeb3 = useCallback(async () => {
    if (!window.ethereum) {
      setNetworkError('Please install MetaMask to use this application.');
      return;
    }

    try {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Network verification
      const networkId = await web3Instance.eth.net.getId();
      if (Number(networkId) !== config.NETWORK_ID) {
        setNetworkError(`Please switch to ${config.NETWORK_NAME} (Chain ID: ${config.NETWORK_ID})`);
        
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3Instance.utils.toHex(config.NETWORK_ID) }],
          });
          // After switching, reload to reinitialize
          window.location.reload();
        } catch (switchError) {
          if (switchError.code === 4902) {
            setNetworkError(`${config.NETWORK_NAME} network not found in your wallet`);
          }
        }
        return;
      }

      // Initialize contract
      const contractInstance = new web3Instance.eth.Contract(
        LandRegistry.abi,
        config.CONTRACT_ADDRESS
      );
      setContract(contractInstance);

      // Verify contract admin (if the contract has this function)
      if (contractInstance.methods.getAdmin) {
        const contractAdmin = await contractInstance.methods.getAdmin().call();
        console.log('Contract Admin:', contractAdmin);
        if (contractAdmin.toLowerCase() !== config.ADMIN_ADDRESS.toLowerCase()) {
          console.warn('Config admin does not match contract admin');
        }
      }

      // Check connected accounts
      const accounts = await web3Instance.eth.getAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setNetworkError('');
      }
    } catch (error) {
      console.error('Initialization error:', error);
      setNetworkError(`Initialization failed: ${error.message}`);
    }
  }, []);

  useEffect(() => {
    initWeb3();

    // Event listeners
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0] || '');
        setIsConnected(!!accounts[0]);
        if (!accounts[0]) {
          setNetworkError('Account disconnected');
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [initWeb3]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setNetworkError('MetaMask not detected');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
      setIsConnected(true);
      setNetworkError('');
    } catch (error) {
      console.error('Connection error:', error);
      setNetworkError(`Connection failed: ${error.message}`);
    }
  };

  const getAccountName = (addr) => {
    return accountNames[addr] || config.shortenAddress(addr);
  };

  // Enhanced contract call with admin verification
  const adminContractCall = async (methodName, params = [], options = {}) => {
    if (!isAdmin) {
      throw new Error('Only admin can perform this action');
    }

    if (!contract || !account) {
      throw new Error('Contract not initialized or no account connected');
    }

    try {
      return await contract.methods[methodName](...params)
        .send({ from: account, ...options });
    } catch (error) {
      console.error('Admin contract call failed:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      web3,
      contract,
      account,
      accountName,
      connectWallet,
      networkError,
      getAccountName,
      accountNames,
      isAdmin,
      adminContractCall // Provide the admin call function
    }}>
      {children}
    </WalletContext.Provider>
  );
};
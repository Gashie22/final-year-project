// Configuration settings for the application
const config = {
  // Contract settings
  /**
   * @property {string} CONTRACT_ADDRESS
   * @description The address of the deployed smart contract on the blockchain.
   * It prioritizes the environment variable `REACT_APP_CONTRACT_ADDRESS`.
   * If the environment variable is not set, it defaults to the provided address.
   */
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS || '0xcfDA1D32D05510efB3320106E4FdC905C6556A70', //0x3881bc1Dbf04140966474471c3Dd1f0CDfbba231
  /**
   * @property {string} ADMIN_ADDRESS
   * @description The Ethereum address designated as the administrator for the application.
   * It prioritizes the environment variable `REACT_APP_ADMIN_ADDRESS`.
   * If the environment variable is not set, it defaults to the provided address.
   */
  ADMIN_ADDRESS: process.env.REACT_APP_ADMIN_ADDRESS || '0xdC2D7AaED0e3DA74827A8b20eBe1A2c4CB6729C9',

  // Network settings
  /**
   * @property {number} NETWORK_ID
   * @description The ID of the blockchain network the application is configured to interact with.
   * Here, it's set to `11155111`, which corresponds to the Sepolia test network.
   */
 // Network settings
NETWORK_ID: 5777, // Ganache (usually)
NETWORK_NAME: 'Ganache', // Update the name for clarity

  // UI settings
  /**
   * @property {number} ADDRESS_DISPLAY_LENGTH
   * @description The number of characters to display at the beginning and end of Ethereum addresses
   * in the user interface for brevity.
   */
  ADDRESS_DISPLAY_LENGTH: 8, // How many characters to show at beginning/end of ethereum addresses

  // Helper functions
  /**
   * @function shortenAddress
   * @param {string} address - The full Ethereum address to shorten.
   * @returns {string} A shortened version of the address (e.g., '0x1234...abcd').
   * Returns an empty string if the input address is null or undefined.
   */
  shortenAddress: (address) => {
    if (!address) return '';
    return `${address.substring(0, config.ADDRESS_DISPLAY_LENGTH)}...${address.substring(address.length - 4)}`;
  }
};

export default config;
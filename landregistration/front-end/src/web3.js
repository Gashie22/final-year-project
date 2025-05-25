import Web3 from 'web3';

// Declare a variable 'web3' which will hold the Web3 instance.
let web3;

// Check if the browser has the 'window.ethereum' object, which is typically provided by modern Ethereum wallets like MetaMask.
if (window.ethereum) {
  // If 'window.ethereum' exists, create a new Web3 instance using it as the provider.
  // This is the recommended way to interact with Ethereum in modern browsers.
  web3 = new Web3(window.ethereum);

  // Request user permission to connect their Ethereum account to the application.
  // This is an asynchronous operation, and we use a Promise to handle the result.
  window.ethereum.enable().catch(error => {
    // If the user denies permission or an error occurs during the connection attempt,
    // log the error to the console.
    console.log(error);
  });
}
// If 'window.ethereum' is not present, check for the older 'window.web3' object.
// This was used by older versions of MetaMask and other dApp browsers.
else if (window.web3) {
  // If 'window.web3' exists, create a new Web3 instance using its 'currentProvider'.
  // This ensures compatibility with older dApp browsers.
  web3 = new Web3(window.web3.currentProvider);
}
// If neither 'window.ethereum' nor 'window.web3' is found, it indicates that
// the user is likely using a standard web browser without an Ethereum wallet.
else {
  // Log a message to the console informing the user about the lack of an Ethereum provider
  // and suggesting they try MetaMask, which is a popular browser extension for interacting with Ethereum dApps.
  console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
}

// Export the 'web3' instance so it can be imported and used by other parts of the application
// to interact with the Ethereum blockchain.
export default web3;
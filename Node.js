// Import necessary libraries
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

// Initialize Web3 with the Infura endpoint and HDWalletProvider
const infuraEndpoint = '<YOUR_INFURA_ENDPOINT_URL>';
const mnemonic = '<YOUR_MNEMONIC>';
const web3Provider = new HDWalletProvider(mnemonic, infuraEndpoint);
const web3 = new Web3(web3Provider);

// Function to create a new wallet
async function createWallet() {
  const account = await web3.eth.accounts.create();
  const publicKey = account.address;
  const privateKey = account.privateKey;
  const creationDate = new Date();
  return {
    publicKey,
    privateKey,
    creationDate
  };
}

// Function to get transactions by wallet address
async function getTransactionsByAddress(address) {
  const transactions = await web3.eth.getTransactionsByAddress(address);
  return transactions;
}

// Function to check for common transactions between two addresses
async function checkCommonTransactions(address1, address2) {
  const transactions1 = await getTransactionsByAddress(address1);
  const transactions2 = await getTransactionsByAddress(address2);
  for (let i = 0; i < transactions1.length; i++) {
    const tx1 = transactions1[i];
    for (let j = 0; j < transactions2.length; j++) {
      const tx2 = transactions2[j];
      if (tx1.from === tx2.from) {
        return true;
      }
    }
  }
  return false;
}

// Export the functions as a module
module.exports = {
  createWallet,
  getTransactionsByAddress,
  checkCommonTransactions
};

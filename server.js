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

// Function1 to get transactions by wallet address
async function getTransactionsByAddress(address) {
  const transactions = await web3.eth.getTransactionsByAddress(address);
  return transactions;
}

// Function2 to get transactions by wallet address & Token In this version of the function, we added a new parameter tokenAddress which takes the address of the specific token we are interested in. We then create a new instance of the token contract using the web3.eth.Contract function, passing in the ABI of the token.Next, we use the getPastEvents method of the token contract to get all the Transfer events involving the specified wallet address. We filter the events to only include transfers where the wallet address is either the sender or the recipient. We then map over the events and get the corresponding transaction for each event using web3.eth.getTransaction. We merge the event object with the transaction object and return an array of transaction objects containing the necessary data.Finally, we return the array of transactions as the result of the function.
async function getTransactionsByAddressAndToken(address, tokenAddress) {
  const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
  const transferEvents = await tokenContract.getPastEvents('Transfer', {
    filter: { $or: [{ from: address }, { to: address }] },
    fromBlock: 0,
    toBlock: 'latest'
  });
  const transactions = await Promise.all(
    transferEvents.map(async event => {
      const tx = await web3.eth.getTransaction(event.transactionHash);
      return { ...event, tx };
    })
  );
  return transactions;
}

// Function1 to check for common transactions between two addresses
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
// Function2 to check for common transactions between two addresses & tokenAddress. In this version of the function, we added a new parameter tokenAddress which takes the address of the specific token we are interested in. We then create a new instance of the token contract using the web3.eth.Contract function, passing in the ABI of the token.Next, we get the transactions for both addresses using the getTransactionsByAddress function we defined earlier. We then filter the transactions of the first address address1 and check if any of them are also present in the transactions of the second address address2. If they are, we then check if the transaction was made to the specific token's address. If it was, we consider it a common transaction involving the token.Finally, we return a boolean value indicating whether or not there were any common transactions involving the specific token.
async function checkCommonTokenTransactions(tokenAddress, address1, address2) {
  const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
  const txs1 = await getTransactionsByAddress(address1);
  const txs2 = await getTransactionsByAddress(address2);
  const commonTxs = txs1.filter(tx1 => {
    const isFromAddress2 = txs2.some(tx2 => tx1.hash === tx2.hash);
    return isFromAddress2 && tx1.to.toLowerCase() === tokenAddress.toLowerCase();
  });
  return commonTxs.length > 0;
}


// Export the functions as a module
module.exports = {
  createWallet,
  getTransactionsByAddress,
  checkCommonTransactions
};

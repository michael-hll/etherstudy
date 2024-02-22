// Load environment variables.
require("dotenv").config({
  path: './.metamask.env'
});

const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require('web3');
const compiledFactory = require("./build/CampaignFactory.json");
const mnemonicPhrase = process.env.ACCOUNT_MNEMONIC;
const network = process.env.SEPOLIA_ENDPOINT;


const provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonicPhrase
  },
  providerOrUrl: network
});

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};


deploy();
// after deploy, can view the contract instance from: https://sepolia.etherscan.io/
// contract address: 0x53Fe24801649B17c770047e8e4F5De16Ae16b792
// you can also deploy or call the contract methods from https://remix.ethereum.org/

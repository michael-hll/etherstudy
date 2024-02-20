// Load environment variables.
require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require('web3');
const { abi, evm } = require("./compile");

const mnemonicPhrase = process.env.ACCOUNT_MNEMONIC;
// from https://app.infura.io/ can find the related network endpoint
// for this case we connected to Sepolia network
const network = process.env.SEPOLIA_ENDPOINT;

const provider = new HDWalletProvider({
  mnemonic: {
    phrase: mnemonicPhrase
  },
  providerOrUrl: network
});

const web3 = new Web3(provider);
const message = "Hi there!";

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: "0x" + evm.bytecode.object, arguments: [message] })
    .send({ from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};

deploy();
// after deploy, can view the contract instance from: https://sepolia.etherscan.io/
// contract address: 0x2596C0F54eE31C43FD6E159BC4Ab28Cde8Df03DA
// you can also deploy or call the contract methods from https://remix.ethereum.org/

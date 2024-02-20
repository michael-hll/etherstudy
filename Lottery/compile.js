const path = require('path');
const fs = require('fs');
const solc = require('solc');
const WriteFile = require('./utils/write');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
// Read 'Lottery.sol' file from the 'contracts' folder
const source = fs.readFileSync(lotteryPath, 'utf8');

/***
 * The recommended way to interface with the Solidity compiler, especially for more
 * complex and automated setups is the so-called JSON-input-output interface.
 *
 * See https://docs.soliditylang.org/en/latest/using-the-compiler.html#compiler-input-and-output-json-description
 * for more details.
 */
let input = {
  language: 'Solidity',
  sources: {
    // Each Solidity source file to be compiled must be specified by defining either
    // a URL to the file or the literal file content.
    // See https://docs.soliditylang.org/en/latest/using-the-compiler.html#input-description
    'Lottery.sol': {
      content: source
    }
  },
  settings: {
    metadata: {
      useLiteralContent: true
    },
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

// start build and get the build output
const output = JSON.parse(solc.compile(JSON.stringify(input)));
module.exports = output.contracts["Lottery.sol"].Lottery;
// debug used
WriteFile(lotteryPath + '.json', output);
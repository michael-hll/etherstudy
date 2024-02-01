const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
// Read 'Inbox.sol' file from the 'contracts' folder
const source = fs.readFileSync(inboxPath, 'utf8');

// settings for building
let input = {
  language: 'Solidity',
  sources: {
    'Inbox.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};

// start build and get the build output
let output = JSON.parse(solc.compile(JSON.stringify(input)));
console.dir(output.contracts['Inbox.sol']['Inbox']);
module.exports = output.contracts['Inbox.sol']['Inbox'];

// debug used
// write output to json file
/*
fs.writeFile(
  inboxPath + '.json',
  JSON.stringify(output, null, 2),
  {
    encoding: "utf8",
    flag: "w",
    mode: 0o666
  },
  (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully\n");      
    }
  });
*/
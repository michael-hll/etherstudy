const { abi, evm } = require("./compile");
const path = require('path');
const WriteFile = require('./utils/write');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.abi');
WriteFile(lotteryPath + '.json', abi);
console.log(abi);
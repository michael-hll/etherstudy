const assert = require('assert');
const ganache = require('ganache-cli'); // pronounciation: ge nar sh
const { Web3 } = require('web3');

// create a instance web3 using local network ganache
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract  
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: JSON.stringify(evm['deployedBytecode']),
      arguments: ['Hi there!']
    })
    .send({
      from: accounts[0],
      gas: '1000000'
    });
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    //console.dir(inbox, { depth: null, colors: true });
  });
})

// code to study mocha
/*
class Car {
  park() {
    return 'stopped';
  }

  drive() {
    return 'vroom';
  }
}

let car = undefined;
beforeEach(() => {
  // run before each it function
  if (!car) {
    car = new Car();
  }
});

describe('Car', () => {
  it('can park', () => {
    assert.equal(car.park(), 'stopped');
  });

  it('can drive', () => {
    assert.equal(car.drive(), 'vroom');
  });
});
*/
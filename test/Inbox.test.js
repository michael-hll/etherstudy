const assert = require('assert');
const ganache = require('ganache'); // pronounciation: ge nar sh
const { Web3 } = require('web3');

// create a instance web3 using local network ganache
const provider = ganache.provider();
const web3 = new Web3(provider);
// get compiled contract code
const { abi, evm } = require('../compile');

let accounts;
let inbox;
const INIT_MESSAGE = 'Hi there!';

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract  
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: '0x' + evm.bytecode.object,
      arguments: [INIT_MESSAGE]
    })
    .send({
      from: accounts[0],
      gas: '1000000', // The gasLimit units of gas
      //gasPrice: 1000000000 // The gas price in wei to use for this call `transaction`.
    });
  // total spent gas = gasUnits * gasPrice
  // 1 Ether = 1000000000000000000 Wei (18 zeros)
});

describe('Inbox', () => {
  it('deploys a contract', async () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INIT_MESSAGE);
  });

  it("can change the message", async () => {
    const newMsg = "bye";
    await inbox.methods.setMessage(newMsg).send({ from: accounts[0] });

    const msg = await inbox.methods.message().call();
    assert.strictEqual(msg, newMsg);
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
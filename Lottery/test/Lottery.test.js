const assert = require('assert');
const ganache = require('ganache'); // pronounciation: ge nar sh
const { Web3 } = require('web3');

// create a instance web3 using local network ganache
const provider = ganache.provider({
  quiet: true, // by default this was set to false, set to true to disable logging
});
const web3 = new Web3(provider);
// get compiled contract code
const { abi, evm } = require('../compile');

let accounts;
let lottery;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract  
  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: '0x' + evm.bytecode.object,
      arguments: []
    })
    .send({
      from: accounts[0],
      gas: '1000000', // The gasLimit units of gas
      //gasPrice: 1000000000 // The gas price in wei to use for this call `transaction`.
    });
  // total spent gas = gasUnits * gasPrice
  // 1 Ether = 1000000000000000000 Wei (18 zeros)
});

describe('Lottery', () => {
  it('deploys a contract', async () => {
    assert.ok(lottery.options.address);
  });

  it('test random number generation', async () => {
    const randomNumber1 = await lottery.methods.random(new Date().getTime()).call();
    const randomNumber2 = await lottery.methods.random(new Date().getTime()).call();
    console.log(randomNumber1, randomNumber2);
    assert.notEqual(randomNumber1, randomNumber2);
  });

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  it('allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });

    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(accounts[1], players[1]);
    assert.equal(accounts[2], players[2]);
    assert.equal(3, players.length);
  });

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 100
      });
      assert(false);
    } catch (err) {
      assert.ok(err);
    }
  });

  it('only manager can call pickWinner', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('0.02', 'ether')
      });
      await lottery.methods.pickWinner(new Date().getTime()).send({
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert.ok(err);
    }
  });

  it('sends money to the winner and reset the players array', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('2', 'ether')
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner(new Date().getTime()).send({
      from: accounts[0]
    });

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;
    //console.log(difference);
    assert(difference > web3.utils.toWei('1.8', 'ether'));
  });
})
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    // As of Solidity 0.5.0 the `address` type was split into `address` and
    // `address payable`, where only `address payable` provides the transfer
    // function. We therefore need to explicity use the `address payable[]`
    // array type for the players array.
    address public manager;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(
            msg.value >= .01 ether,
            "A minimum payment of .01 ether must be sent to enter the lottery"
        ); // validations

        // As of Solidity 0.8.0 the global variable `msg.sender` has the type
        // `address` instead of `address payable`. So we must convert msg.sender
        // into `address payable` before we can add it to the players array.
        players.push(payable(msg.sender));
    }

    function random() private view returns (uint) {
        // For an explanation of why `abi.encodePacked` is used here, see
        // https://github.com/owanhunte/ethereum-solidity-course-updated-code/issues/1
        //
        // VM Paris Update: Note that in September 2022, Ethereum transitioned to proof-of-stake consensus,
        // also known as The Merge. One of the changes this resulted in was the introduction of a new
        // opcode called 'prevrandao', which replaces the 'difficulty' opcode. As such, since Solidity 0.8.18
        // block.difficulty has been deprecated and instead, block.prevrandao should be used.
        return
            uint(
                keccak256(
                    abi.encodePacked(block.prevrandao, block.timestamp, players)
                )
            );
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function pickWinner() public validatePickWinner {
        // ****************************
        // modifier code will be put here
        // and the later codes will be put to the placeholder in the modifier
        // ****************************

        uint index = random() % players.length;

        // As of Solidity 0.4.24 at least, `this` is a deprecated way to get the address of the
        // contract. `address(this)` must be used instead.
        address contractAddress = address(this); // get current contract address

        players[index].transfer(contractAddress.balance);
        players = new address payable[](0); // create a new empty payable address array
    }

    modifier validatePickWinner() {
        require(players.length > 0, "There are no players currently.");
        require(msg.sender == manager, "Only owner can call this function.");
        _; // placeholder
    }
}

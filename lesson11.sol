// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Ownable {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "not an owner!");
        _;
    }

    // virtual позволяет переопределять функцию в потомках
    function withdraw(address payable) public virtual onlyOwner {
        // onlyOwner должен прописываться в конструкторе
        payable(owner).transfer(address(this).balance);
    }
}

abstract contract Balances is Ownable {

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    // override позволяет переопределить функцию
    function withdraw(address payable _to) public override virtual onlyOwner {
        // onlyOwner должен прописываться в конструкторе
        _to.transfer(getBalance());
    }
}

contract MyContract is Ownable, Balances {

    // Переопределение конструктора

    function withdraw(address payable _to) public override(Balances, Ownable) onlyOwner {
        super.withdraw(_to);
    }

}
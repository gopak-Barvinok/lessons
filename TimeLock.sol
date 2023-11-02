// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Timelock {
    uint constant MINIMUM_DELAY = 10;
    uint constant MAXIMUM_DELAY = 1 days;
    uint constant GRACE_PERIOD = 1 days;
    // Колличество нужный подтверждений
    uint public constant CONFIRMATIONS_REQUIRED = 3;
    address[] public owners;

    string public message;
    uint public amount;

    struct Transaction {
        bytes32 uid;
        address to;
        uint value;
        bytes data;
        bool executed;
        uint confirmations;
    }

    mapping(bytes32 => mapping(address => bool)) public confirmations;
    mapping(bytes32 => bool) public queue;
    mapping(address => bool) public isOwner;
    mapping(bytes32 => Transaction) public txs;

    event Queued(bytes32 txId);
    event Discarded(bytes32 txId);
    event Executed(bytes32 txId);

    constructor(address[] memory _owners) {
        require(_owners.length >= CONFIRMATIONS_REQUIRED, "not enough owners!");
        for(uint i = 0; i < _owners.length; i++) {
            address nextOwner = _owners[i];

            require(nextOwner != address(0), "zero address!");
            require(!isOwner[nextOwner], "duplicate owner!");
            isOwner[nextOwner] = true;
            owners.push(nextOwner);

        }
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not an owner!");
        _;
    }

    function demo (string calldata _msg) external payable {
        message = _msg;
        amount = msg.value;
    }

    function getNextTimeStamp() external view returns(uint) {
        return block.timestamp + 60;
    }

    function prepareData(string calldata _msg) external pure returns(bytes memory) {
        return abi.encode(_msg);
    }

    function addToQueue(
        address _to,
        string calldata _func,
        bytes calldata _data,
        uint _value,
        uint _timestamp
    ) external onlyOwner returns(bytes32) {
        require(
            _timestamp > block.timestamp + MINIMUM_DELAY &&
            _timestamp < block.timestamp + MAXIMUM_DELAY,
            "invalid timestamp"
        );
        bytes32 txId = keccak256(abi.encode(
            _to,
            _func,
            _data,
            _value,
            _timestamp
        ));

        require(queue[txId], "not queued!");

        require(!queue[txId], "already queued");

        queue[txId] = true;

        // Отправка транзакции
        txs[txId] = 
            Transaction({
                uid: txId,
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                confirmations: 0         
            });

        emit Queued(txId);

        return txId;
    }

    function confirm(bytes32 _txId) external onlyOwner {
        require(queue[_txId], "not queued");
        require(!confirmations[_txId][msg.sender], "already confirmed");
        Transaction storage transaction = txs[_txId];

        transaction.confirmations++;
        confirmations[_txId][msg.sender] = true;
    }

    function cancelConfirmation(bytes32 _txId) external onlyOwner {
        require(queue[_txId], "not queued!");
        require(confirmations[_txId][msg.sender], "not confirmed");

        Transaction storage transaction = txs[_txId];
        transaction.confirmations--;
        confirmations[_txId][msg.sender] = false;        
    }

    function execute(
        address _to,
        string calldata _func,
        bytes calldata _data,
        uint _value,
        uint _timestamp  
    ) external payable onlyOwner returns(bytes memory){
        require(
            block.timestamp > _timestamp,
            "too early"
        );

        require(
            block.timestamp + GRACE_PERIOD > block.timestamp,
            "tx expired"
        );

        bytes32 txId = keccak256(abi.encode(  //Высчитываем уникальный идентификатор
            _to, 
            _func,
            _data,
            _value,
            _timestamp
        ));

        require(queue[txId], "not queued!");
        Transaction storage transaction = txs[txId];
        require(transaction.confirmations >= CONFIRMATIONS_REQUIRED, "not enough confirmations");
        delete queue[txId];

        transaction.executed = true;

        bytes memory data;
        // Кодирование аргументов и функции
        if(bytes(_func).length > 0) {
            data = abi.encodePacked(
                bytes4(keccak256(bytes(_func))),
                _data
            );
        } else {
            data = _data;
        }

        (bool success, bytes memory response) = _to.call{value: _value}(data);
        require(success);

        emit Executed(txId);
        return response;
    }

    function discard(bytes32 _txId) external onlyOwner {
        require(queue[_txId], "not queued");
        delete queue[_txId];

        emit Discarded(_txId);
    }
}
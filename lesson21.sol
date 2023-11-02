// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


//В памяти слоты по 32 байта
contract MyContract {
    function work(uint[3] memory _arr) external pure returns(bytes memory) {
        // calldata используется, если данные не сохраняются в блокчейне и не копируются в память
        return msg.data[0:4]; // (2*4) 

        // 0x1c28968b000000000000000000000000000000000000000000000000000000000000000
        // Эти данные обозначают какую функцию мы хотим вызвать (селектор)
        
        // 1000000000000000000000000000000000000000000000000000000000000000
        // 20000000000000000000000000000000000000000000000000000000000000003

        // assembly {
        //     let ptr := mload(64)
        //     data := mload(sub(ptr, 64))  //sub как функция для вычитания
        //     // ptr 192 - 32 ---> STR
        // }
    }
}

contract MyContract2 {
    function sel() external pure returns(bytes4) {
        return bytes4(keccak256(bytes("work(uint256[3])")));
    }

    function work(uint[] calldata a) external pure returns(
        bytes32 _startIn, bytes32 _elCount, bytes32 _firstEl
        ) {
        assembly {
            // _el1 := calldataload(add(4, 64)) //Считать коллдату напрямую
        
            //Через 32 байта (20 в шеснадцетиричном формате)
            // 0x0000000000000000000000000000000000000000000000000000000000000020
            // 0x0000000000000000000000000000000000000000000000000000000000000004
            // 0x7465737400000000000000000000000000000000000000000000000000000000
        
            _startIn := calldataload(4)
            _elCount := calldataload(add(_startIn, 4))
            _firstEl := calldataload(add(_startIn, 36))

// 0:
//     bytes32: _startIn 0x0000000000000000000000000000000000000000000000000000000000000020
// 1:
//     bytes32: _elCount 0x0000000000000000000000000000000000000000000000000000000000000003
// 2:
//     bytes32: _firstEl 0x0000000000000000000000000000000000000000000000000000000000000001
        
        }
    }
}
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface ILogger {
    
    function log(address _from, uint amount) external;

    function getEntry(address _from, uint _index) external view returns(uint);

}
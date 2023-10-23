// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IERC165.sol";

contract ERC165 is IERC165 {
    function supportInterface(bytes4 interfaceId) external view returns(bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}
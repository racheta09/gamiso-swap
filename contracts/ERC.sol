// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC is ERC20 {
    constructor() ERC20("Test", "tst") {
        _mint(msg.sender, 10**10 * 10**18);
    }
}

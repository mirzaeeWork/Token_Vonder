// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// learn more: https://docs.openzeppelin.com/contracts/4.x/erc20

contract YourToken is ERC20 {
    address private owner;

    constructor() ERC20("AZADI", "AZI") {
        _mint(msg.sender, 1000 * 10 ** 18);
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function transfer(
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address _owner = tx.origin;
        _transfer(_owner, to, amount);
        return true;
    }

    function approve(
        address spender,
        uint256 amount
    ) public override returns (bool) {
        address _owner = tx.origin;
        _approve(_owner, spender, amount);
        return true;
    }
}

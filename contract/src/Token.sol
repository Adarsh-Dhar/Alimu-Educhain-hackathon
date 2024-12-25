pragma solidity 0.8.28;

import "../lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
contract Token is ERC20 {

    constructor() ERC20("AlimuToken", "ALIM") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { OFT } from "@layerzerolabs/oft-evm/contracts/OFT.sol";

contract BrenkibERC20 is OFT {
    constructor(
        address _lzEndpoint,
        address _delegate
    ) OFT("BrenkibERC20", "BRN20", _lzEndpoint, _delegate) Ownable(_delegate) {
        _mint(msg.sender, 100 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

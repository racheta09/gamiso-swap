// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Swap is Context, ReentrancyGuard, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 private _token;
    address payable private _wallet;
    uint256 private _rate;
    uint256 private _busdSold;
    uint256 private _fees;
    bool private _end;
    IERC20 BUSD;
    // IERC20 BUSD = IERC20(0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56); //Mainnet
    // IERC20 BUSD = IERC20(0xE0dFffc2E01A7f051069649aD4eb3F518430B6a4); // Testnet

    event BUSDExchanged(address indexed beneficiary, uint256 busdAmount);
    event RateChanged(uint256 rate);

    constructor(address busd_, address erc, address wallet_) {
        BUSD = IERC20(busd_); 
        _rate = 10;
        _wallet = payable(wallet_);
        _token = IERC20(erc);
        _fees = 20;
        _end = false;
    }

    function swapToBUSD(uint256 amount) public nonReentrant {
        address beneficiary = _msgSender();
        require(amount != 0, "Amount is 0");
        require(_token.balanceOf(beneficiary) >= amount, "Not Enough Balance");
        require(
            _token.allowance(beneficiary, address(this)) >= amount,
            "Not Enough Allowance"
        );
        uint256 busdAmount = _getBusdAmount(amount);
        _preValidatePurchase(beneficiary, busdAmount);
        _token.safeTransferFrom(beneficiary, address(this), amount);
        _processPurchase(beneficiary, busdAmount);
        emit BUSDExchanged(beneficiary, busdAmount);
    }

    function _getBusdAmount(uint256 amount) internal view returns (uint256) {
        return amount.mul(_rate).div(100);
    }

    function _preValidatePurchase(address beneficiary, uint256 tokens)
        internal
        view
    {
        require(!_end, "Sale Ended");
        require(beneficiary != address(0), "Buyer is the zero address");
        require(tokens != 0, "Sale token amount is 0");
        require(remainingBusd() >= tokens, "Less BUSD remaining");
    }

    function _processPurchase(address beneficiary, uint256 busdAmount)
        internal
    {
        _deliverBUSD(beneficiary, busdAmount.sub(busdAmount.mul(_fees).div(10000)));
    }

    function _deliverBUSD(address beneficiary, uint256 busdAmount) internal {
        BUSD.safeTransferFrom(_wallet, beneficiary, busdAmount);
        _busdSold = _busdSold.add(busdAmount);
    }

    function withdrawTokens() external {
        _token.safeTransfer(_wallet, _token.balanceOf(address(this)));
    }
    function tokenBalance() public view {
        _token.balanceOf(address(this));
    }

    function token() public view returns (IERC20) {
        return _token;
    }

    function wallet() public view returns (address payable) {
        return _wallet;
    }

    function rate() public view returns (uint256) {
        return _rate;
    }

    function setRate(uint256 r) public onlyOwner {
        _rate = r;
        emit RateChanged(_rate);
    }

    function saleEnded() public view returns (bool) {
        return _end;
    }

    function setEnd(bool end) external onlyOwner {
        _end = end;
    }
    function fees() public view returns (uint256) {
        return _fees;
    }

    function setFees(uint256 fees_) external onlyOwner {
        _fees = fees_;
    }

    function busdSold() public view returns (uint256) {
        return _busdSold;
    }

    function remainingBusd() public view returns (uint256) {
        return BUSD.allowance(_wallet, address(this));
    }
}

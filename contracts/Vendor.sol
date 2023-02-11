// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./YourToken.sol";

contract Vendor is Ownable {
    event BuyTokens(address buyer, uint256 amountOfETH, uint256 amountOfTokens);

    YourToken public yourToken;
    uint256 public priceToken = 0.02 ether;
    uint256 public fee = 0.002 ether;
    address public ownerVendor;
    uint256 public sumFee;
    uint256 public sumpriceToken;

    constructor(address tokenAddress) {
        yourToken = YourToken(tokenAddress);
        ownerVendor = msg.sender;
    }

    function allowApprove(uint256 amountToken) public {
        require(
            msg.sender == yourToken.getOwner(),
            "Vendor : is not the owner"
        );
        require(
            amountToken <= yourToken.totalSupply(),
            "Vendor : Insufficient inventory"
        );
        yourToken.approve(address(this), amountToken);
    }

    // ToDo: create a payable buyTokens() function:
    function buyTokens(uint256 _amount) public payable {
        require(
            msg.value >= (_amount * (priceToken + fee)),
            "Vendor : Insufficient inventory"
        );
        require(
            msg.value % (priceToken + fee) == 0,
            "Vendor : must be a multiple of (priceToken+fee)"
        );
        require(
            msg.sender != yourToken.getOwner(),
            "Vendor : It cannot be the owner"
        );
        yourToken.transferFrom(yourToken.getOwner(), msg.sender, _amount);
        sumFee += (fee * _amount);
        sumpriceToken += (priceToken * _amount);
        emit BuyTokens(msg.sender, msg.value, _amount);
    }

    // ToDo: create a withdraw() function that lets the owner withdraw ETH
    function withdraw() public payable {
        require(msg.sender == ownerVendor, "Vendor : is not the owner");
        require(
            address(this).balance > sumFee,
            "Vendor : Insufficient inventory"
        );
        uint256 payment = sumFee;
        sumFee = 0;
        payable(ownerVendor).transfer(payment);
    }

    // ToDo: create a sellTokens(uint256 _amount) function:
    function sellTokens(     
        uint256 _amount) public payable {
        require(
            msg.sender != yourToken.getOwner(),
            "Vendor : It cannot be the owner"
        );

        require(
            address(this).balance >= (_amount * priceToken),
            "Vendor : Insufficient inventory"
        );
        uint256 _balanceAddress = yourToken.balanceOf(msg.sender);
        require(
            _balanceAddress >= _amount,
            "Vendor : The balance is not enough"
        );
        yourToken.transfer(yourToken.getOwner(), _amount);
        uint _payment=(_amount * priceToken);
        sumpriceToken =sumpriceToken - (_amount * priceToken);
        (bool sent, ) = (msg.sender).call{value: _payment}("");
        require(sent, "Failed to send Ether");
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getFee()public view returns(uint256){
        return sumFee;        
    }
}

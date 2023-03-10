pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

contract DailyToken {
    uint256 constant public DAY_IN_SECONDS = 86400;
    uint256 public lastIssuedTime;
    IERC20 public token;
    mapping(address => uint256) public lastWithdrawalTime;
    
    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
        lastIssuedTime = block.timestamp;
    }
    
    function depositTokens(uint256 _amount) public {
        require(token.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");
    }
    
    function withdrawToken() public {
        require(lastWithdrawalTime[msg.sender] + DAY_IN_SECONDS < block.timestamp, "Token can only be withdrawn once per day");
        require(token.balanceOf(address(this)) >= 1, "No tokens available for withdrawal");
        token.transfer(msg.sender, 1);
        lastWithdrawalTime[msg.sender] = block.timestamp;
    }
    
    function getTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }
}

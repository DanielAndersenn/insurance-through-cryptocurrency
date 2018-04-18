pragma solidity 0.4.21;

contract BikeFund {

    address public owner;

    // Fallback function must be specified
    function() public payable {
    
    }

    function BikeFund() public {
        owner = msg.sender;
    }

    function kill() public {
        if(msg.sender == owner) selfdestruct(owner);
    }

    // To deposit savings
    function deposit() public payable {
        require((msg.sender==owner));
      
        if(this.balance >= 5000000000000000000) unlockFund();
    }

    //Transfers the fundBalance back to the address of the owner
    function unlockFund() private {
        owner.transfer(this.balance);
    }

}
ragma solidity 0.4.25;

contract Voting {
  event voted(address addr, bool accepted);
  
  struct Voting{
      string url;
      string place;
      address owner;
      uint16 approvals;
      uint16 rejects;
      uint date;
      mapping(address => bool) isVoted;
  }
  
  mapping(string => Voting) votings;
  
  constructor() public {
  }
  
  function createVoting(string _id, string _url, string _place) public {
      Voting memory mVoting = Voting({
          url: _url,
          place: _place,
          owner: msg.sender,
          approvals: 0,
          rejects: 0,
          date: now
      });
      votings[_id] = mVoting;
  }
  
  function approveVoting(string _id) public {
      require(votings[_id].isVoted[msg.sender] == false, "each participant can vote only once for a voting");
      require(votings[_id].owner != msg.sender, "owner of voting can't approve");
      votings[_id].approvals++;
      votings[_id].isVoted[msg.sender]=true;
  }
  
  function rejectVoting(string _id) public {
      require(votings[_id].isVoted[msg.sender] == false, "each participant can vote only once for a voting");
      require(votings[_id].owner != msg.sender, "owner of voting can't reject");
      votings[_id].rejects++;
      votings[_id].isVoted[msg.sender]=true;
  }
  
  function getVotingResult(string id) public {
      require(now - 30 minutes > votings[id].date, "Not 30 minutes past since voting creation" );
      require(votings[id].approvals + votings[id].rejects > 100, "Now enough voting have made");
      if(votings[id].approvals > votings[id].rejects)
        return true;
      else
        return false;
  }
  
}

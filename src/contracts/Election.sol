
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    // Candidate structure
    struct Candidate {
        uint id;
        string name;
        string party;
        string imageUrl;
        uint voteCount;
    }

    // Election state enum
    enum State { NotStarted, InProgress, Ended }
    
    // Election state variable
    State public electionState = State.NotStarted;

    // Owner of the contract (admin)
    address public owner;
    
    // Mapping of candidate ID to Candidate
    mapping(uint => Candidate) public candidates;
    
    // Mapping of voter addresses to whether they've voted
    mapping(address => bool) public voters;
    
    // Total number of candidates
    uint public candidatesCount;
    
    // Total number of votes cast
    uint public totalVotes;

    // Events
    event CandidateAdded(uint indexed candidateId, string name);
    event Voted(address indexed voter, uint indexed candidateId);
    event ElectionStateChanged(State state);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
    
    modifier electionNotStarted() {
        require(electionState == State.NotStarted, "Election has already started");
        _;
    }
    
    modifier electionInProgress() {
        require(electionState == State.InProgress, "Election is not in progress");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    // Function to add a candidate (only owner)
    function addCandidate(string memory _name, string memory _party, string memory _imageUrl) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _party, _imageUrl, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    // Function to get a candidate
    function getCandidate(uint _candidateId) public view returns (uint id, string memory name, string memory party, string memory imageUrl, uint voteCount) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        Candidate storage candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.party, candidate.imageUrl, candidate.voteCount);
    }

    // Function to get the total number of candidates
    function getCandidateCount() public view returns (uint) {
        return candidatesCount;
    }

    // Function to vote for a candidate
    function vote(uint _candidateId) public electionInProgress {
        // Check if the voter has already voted
        require(!voters[msg.sender], "You have already voted");
        
        // Check if the candidate ID is valid
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        // Record that voter has voted
        voters[msg.sender] = true;
        
        // Update candidate vote count
        candidates[_candidateId].voteCount++;
        
        // Update total votes
        totalVotes++;
        
        // Emit event
        emit Voted(msg.sender, _candidateId);
    }

    // Function to check if a voter has voted
    function hasVoted(address _voter) public view returns (bool) {
        return voters[_voter];
    }

    // Function to get the total number of votes
    function getTotalVotes() public view returns (uint) {
        return totalVotes;
    }

    // Function to start the election
    function startElection() public onlyOwner electionNotStarted {
        electionState = State.InProgress;
        emit ElectionStateChanged(State.InProgress);
    }

    // Function to end the election
    function endElection() public onlyOwner electionInProgress {
        electionState = State.Ended;
        emit ElectionStateChanged(State.Ended);
    }

    // Function to get the current election state
    function getElectionState() public view returns (State) {
        return electionState;
    }
}

export const governerABI = [
    {
        "inputs": [
          {
            "internalType": "address[]",
            "name": "targets",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "values",
            "type": "uint256[]"
          },
          {
            "internalType": "bytes[]",
            "name": "calldatas",
            "type": "bytes[]"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          }
        ],
        "name": "propose",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "proposalId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "proposer",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "address[]",
            "name": "targets",
            "type": "address[]"
          },
          {
            "indexed": false,
            "internalType": "uint256[]",
            "name": "values",
            "type": "uint256[]"
          },
          {
            "indexed": false,
            "internalType": "string[]",
            "name": "signatures",
            "type": "string[]"
          },
          {
            "indexed": false,
            "internalType": "bytes[]",
            "name": "calldatas",
            "type": "bytes[]"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "voteStart",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "voteEnd",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "description",
            "type": "string"
          }
        ],
        "name": "ProposalCreated",
        "type": "event"
      }
]
export const thetreABI = [
  {
    "inputs": [
      {
        "internalType": "contract TimelockController",
        "name": "_timelock",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "movieName",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      }
    ],
    "name": "BoughtTicket",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "movieName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "ticketAddress",
        "type": "address"
      }
    ],
    "name": "MovieListed",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "discountNFT",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "discount",
        "type": "uint256"
      }
    ],
    "name": "addDiscountTicket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_movieName",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "discountNFT",
        "type": "address"
      }
    ],
    "name": "buyDiscountedTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_movieName",
        "type": "string"
      }
    ],
    "name": "buyTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_movieName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "baseTokenURI",
        "type": "string"
      }
    ],
    "name": "listMovie",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "movieTicket",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "movieVideos",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_movieName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "videoId",
        "type": "string"
      }
    ],
    "name": "setMovieVideo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_ticketPrice",
        "type": "uint256"
      }
    ],
    "name": "setTicketPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
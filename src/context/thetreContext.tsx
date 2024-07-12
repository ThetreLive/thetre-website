import { createContext, useContext, useState } from "react";
import { useTurnkeyContext } from "./turnkeyContext";
import { ethers } from "ethers";
import { getFileURL } from "@/utils/theta";

export interface ProposalData {
    title: string;
    description: string;
    genre: string;
    producer: string;
    cast: string;
    director: string;
    platforms: string;
    movieLink: string;
    trailerLink: string;
    coverLink: string;
}

const governerContract = ""
const thetreContract = ""
const governerABI = [
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
]

const thetreAB1 = [
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
      }
]

type StoreState = {
    movies: any[],
    createProposal: (data: ProposalData) => void
};
  
const ThetreContext = createContext<StoreState>({
    movies: [],
    createProposal: () => {}
});
  
export const useThetreContext = () => useContext(ThetreContext);

type Props = {
    children?: React.ReactNode;
};

const ThetreContextProvider = (props: Props) => {
    const [movies, setMovies] = useState([])
    const {signer} = useTurnkeyContext()
    const createProposal = async (data: ProposalData) => {
        const govEthers = new ethers.Contract(governerContract, governerABI, signer)
        const thetreEthers = new ethers.Contract(thetreContract, thetreAB1, signer)
        const url = 'https://p2p.thetre.live/rpc';
        const body = {
            jsonrpc: "2.0",
            method: "edgestore.PutData",
            params: [
                {
                ...data
                }
            ],
            id: 1
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            const listingCalldata = thetreEthers.interface.encodeFunctionData("listMovie", [data.title, getFileURL(result.result.key, null)])
            const proposalId = await govEthers.propose([thetreContract], [0], [listingCalldata], "List Movie")
            console.log(proposalId)
          } catch (error) {
            console.error('Error:', error);
          }
        

    }
    return (
        <ThetreContext.Provider value={{ movies, createProposal }}>
            {props.children}
        </ThetreContext.Provider>
    )
}

export default ThetreContextProvider;
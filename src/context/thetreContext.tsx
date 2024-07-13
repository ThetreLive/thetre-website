import { createContext, useContext, useEffect, useState } from "react";
import { useTurnkeyContext } from "./turnkeyContext";
import { ethers } from "ethers";
import { getFileURL, uploadVideo } from "@/utils/theta";

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

const governerContract = "0x1052Db8fe097a011cd2124f14fFe0729019984B3"
const thetreContract = "0x1052Db8fe097a011cd2124f14fFe0729019984B3"
const governanceNFT = "0x1a1d19fe31197e49ffcc292ff6a23c4fefb3ff39"
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
    createProposal: (data: ProposalData) => Promise<void>
};
  
const ThetreContext = createContext<StoreState>({
    movies: [],
    createProposal: async() => {}
});
  
export const useThetreContext = () => useContext(ThetreContext);

type Props = {
    children?: React.ReactNode;
};

const ThetreContextProvider = (props: Props) => {
    const [movies, setMovies] = useState([])
    const {signer} = useTurnkeyContext()
    useEffect(() => {
      (async () => {
        if (signer) {
          const filter = {
            address: governerContract,
            topics: [
              ethers.id("ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)")
            ],
            fromBlock: 27110023,
            toBlock: 'latest'
          };
          const govEthers = new ethers.Contract(governerContract, governerABI, signer)
          
          const logs = await signer.provider?.getLogs(filter)
          const parsedLogs = logs?.map(log => govEthers.interface.parseLog(log));
          console.log(parsedLogs)
        }
      })()
    }, [])
    const createProposal = async (data: ProposalData) => {
        for (const key in data) {
            if (data.hasOwnProperty(key) && data[key as keyof ProposalData] === '') {
                alert("Please fill all fields")
            }
        }
        const govEthers = new ethers.Contract(governerContract, governerABI, signer)
        const thetreEthers = new ethers.Contract(thetreContract, thetreAB1, signer)
        const url = 'https://p2p.thetre.live/rpc';
        const upload = await uploadVideo(getFileURL(JSON.parse(data.movieLink).result.key, JSON.parse(data.movieLink).result.relpath), governanceNFT, data.title, data.coverLink)
        const body = {
            jsonrpc: "2.0",
            method: "edgestore.PutData",
            params: [
                {
                ...data,
                movieLink: upload.body.videos[0].id,
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
            console.log(result)
            // const listingCalldata = thetreEthers.interface.encodeFunctionData("listMovie", ["movie", getFileURL("0x122d07b601c05953fe8229d17e5b5c0a66fbec3b9da839aea24afc18d86a6219", null)])
            const listingCalldata = thetreEthers.interface.encodeFunctionData("listMovie", [data.title, getFileURL(result.result.key, null)])

            const govCalldata = govEthers.interface.encodeFunctionData("propose", [[thetreContract], [0], [listingCalldata], "List Movie"]);
            const txResponse =  await signer?.sendTransaction({
                from: signer.getAddress(),
                to: governerContract,
                data: govCalldata,
                gasLimit: 100000

            })
            console.log('Transaction response:', txResponse);

            // Wait for the transaction to be mined
            const receipt = await txResponse?.wait();
            console.log('Receipt - ', receipt);
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
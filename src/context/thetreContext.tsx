import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { getFileURL, getFromEdgeStore, uploadFileToEdgeStore, uploadToEdgeStore, uploadVideo } from "@/utils/theta";
import { governerABI } from "@/utils/abis/governerABI";
import { thetreAB1 } from "@/utils/abis/thetreABI";
import { contracts } from "@/utils/constants";
import { useWalletContext } from "./walletContext";

export interface ProposalData {
    title: string;
    description: string;
    genre: string;
    producer: string;
    cast: string;
    director: string;
    platforms: string;
    movieLink: string | File;
    trailerLink: string | File;
    coverLink: string | File;
}

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed
}

export interface ProposalDetails {
  data: ProposalData;
  voteEnd: number;
  id: string,
  proposalState: ProposalState;
  votes: {
    forProp: number;
    against: number;
  };
}
const provider = new ethers.JsonRpcProvider("https://eth-rpc-api-testnet.thetatoken.org/rpc")

type StoreState = {
    movies: any[],
    loading: boolean,
    setLoader: (fn: any) => Promise<void>,
    proposalDetails: ProposalDetails[],
    castVote: (proposalId: string, support: 0 | 1) => Promise<void>,
    createProposal: (data: ProposalData) => Promise<void>,
    fetchProposals: () => Promise<void>,
};
  
const ThetreContext = createContext<StoreState>({
    movies: [],
    loading: false,
    setLoader: async () => {},
    proposalDetails: [],
    castVote: async() => {},
    createProposal: async() => {},
    fetchProposals: async() => {},
});
  
export const useThetreContext = () => useContext(ThetreContext);

type Props = {
    children?: React.ReactNode;
};

const ThetreContextProvider = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const [movies, setMovies] = useState([])
    const [proposalDetails, setProposalDetails] = useState<ProposalDetails[]>([])
    const {signer} = useWalletContext()

    const setLoader = async (fn: any) => {
      setLoading(true);
      document.body.classList.add('overflow-hidden');
      await fn();
      setLoading(false);
      document.body.classList.remove('overflow-hidden');
    }

    const fetchProposals = async () => {
      if (proposalDetails.length === 0) {
        const startBlock = 27166848;
        const endBlock = await provider.getBlockNumber();
        const blockRange = 5000;
      
        let proposals: ProposalDetails[] = [];
        const ranges: { fromBlock: number; toBlock: number }[] = [];
        
        for (let currentBlock = startBlock; currentBlock <= endBlock; currentBlock += blockRange) {
          ranges.push({
            fromBlock: currentBlock,
            toBlock: Math.min(currentBlock + blockRange - 1, endBlock),
          });
        }
      
        const govEthers = new ethers.Contract(contracts.LISTING_GOVERNER, governerABI, provider);
        const thetreEthers = new ethers.Contract(contracts.THETRE, thetreAB1, provider);
        
        const logsPromises = ranges.map(range => {
          const filter = {
            address: contracts.LISTING_GOVERNER,
            topics: [
              ethers.id("ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)")
            ],
            fromBlock: range.fromBlock,
            toBlock: range.toBlock
          };
          return provider.getLogs(filter);
        });
      
        const logsResults = await Promise.all(logsPromises);
      
        const logs = logsResults.flat();
      
        const parsedLogs = logs.map(log => govEthers.interface.parseLog(log));
      
        const proposalDetailsPromises = parsedLogs.map(async log => {
          const proposalDetails: ProposalDetails[] = await Promise.all(log!.args.calldatas.map(async (calldata: any) => {
            const listingData = thetreEthers.interface.decodeFunctionData("listMovie", calldata);
            const data = JSON.parse(await getFromEdgeStore(listingData[1]));
            const state = await govEthers.state(log!.args.proposalId);
            const voteEnd = log!.args.voteEnd;
            const votes = await govEthers.proposalVotes(log!.args.proposalId);
            return {
              data,
              voteEnd,
              proposalState: state,
              id: log!.args.proposalId.toString(),
              votes: {
                forProp: ethers.formatEther(votes[1]),
                against: ethers.formatEther(votes[0])
              }
            };
          }));
          return proposalDetails;
        });
      
        const proposalsInChunks = await Promise.all(proposalDetailsPromises);
      
        proposals = proposalsInChunks.flat();
        setProposalDetails(proposals);
        console.log(proposals);
      }
    };
    
    const createProposal = async (data: ProposalData) => {
        for (const key in data) {
            if (data.hasOwnProperty(key) && data[key as keyof ProposalData] === '') {
                alert("Please fill all fields")
            }
        }
        const govEthers = new ethers.Contract(contracts.LISTING_GOVERNER, governerABI, signer)
        const thetreEthers = new ethers.Contract(contracts.THETRE, thetreAB1, signer)

        const movieRes = await uploadFileToEdgeStore(data.movieLink as File)
        const trailerRes = await uploadFileToEdgeStore(data.trailerLink as File)
        const coverRes = await uploadFileToEdgeStore(data.coverLink as File)
        
        const upload = await uploadVideo(getFileURL(movieRes.result.key, movieRes.result.relpath), contracts.GOVERNANCE_PASS, data.title, getFileURL(coverRes.result.key, coverRes.result.relpath))
        try {
            const result = await uploadToEdgeStore({
              ...data,
              trailerLink: JSON.stringify(trailerRes),
              coverLink: JSON.stringify(coverRes),
              movieLink: upload.body.videos[0].id,
            });

            console.log(result)
            // const listingCalldata = thetreEthers.interface.encodeFunctionData("listMovie", ["movie", getFileURL("0x122d07b601c05953fe8229d17e5b5c0a66fbec3b9da839aea24afc18d86a6219", null)])
            const listingCalldata = thetreEthers.interface.encodeFunctionData("listMovie", [data.title, result.result.key])
            console.log([contracts.THETRE], [0], [listingCalldata], "List Movie: " + data.title)
            const govCalldata = govEthers.interface.encodeFunctionData("propose", [[contracts.THETRE], [0], [listingCalldata], "List Movie: " + data.title]);
            const txResponse =  await signer?.sendTransaction({
                from: signer.getAddress(),
                to: contracts.LISTING_GOVERNER,
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

    const castVote = async (proposalId: string, support: 0 | 1) => {
      if (!signer) {
        alert("Please Sign In")
        return
      }
      const govEthers = new ethers.Contract(contracts.LISTING_GOVERNER, governerABI, signer)
      try {
        // Cast the vote
        const govCalldata = govEthers.interface.encodeFunctionData("castVote", [proposalId, support]);

        const txResponse =  await signer?.sendTransaction({
          from: signer.getAddress(),
          to: contracts.LISTING_GOVERNER,
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
        <ThetreContext.Provider value={{ movies, createProposal, proposalDetails, fetchProposals, loading, setLoader, castVote }}>
            {props.children}
        </ThetreContext.Provider>
    )
}

export default ThetreContextProvider;
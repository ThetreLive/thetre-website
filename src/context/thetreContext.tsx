import { createContext, useContext, useEffect, useState } from "react";
import { useTurnkeyContext } from "./turnkeyContext";
import { ethers } from "ethers";
import { getFileURL, getFromEdgeStore, uploadToEdgeStore, uploadVideo } from "@/utils/theta";
import { governerABI } from "@/utils/abis/governerABI";
import { thetreAB1 } from "@/utils/abis/thetreABI";

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
  proposalState: ProposalState;
}
const provider = new ethers.JsonRpcProvider("https://eth-rpc-api-testnet.thetatoken.org/rpc")
const governerContract = "0x1052Db8fe097a011cd2124f14fFe0729019984B3"
const thetreContract = "0x1052Db8fe097a011cd2124f14fFe0729019984B3"
const governanceNFT = "0x1a1d19fe31197e49ffcc292ff6a23c4fefb3ff39"

type StoreState = {
    movies: any[],
    proposalDetails: ProposalDetails[],
    createProposal: (data: ProposalData) => Promise<void>
};
  
const ThetreContext = createContext<StoreState>({
    movies: [],
    proposalDetails: [],
    createProposal: async() => {}
});
  
export const useThetreContext = () => useContext(ThetreContext);

type Props = {
    children?: React.ReactNode;
};

const ThetreContextProvider = (props: Props) => {
    const [movies, setMovies] = useState([])
    const [proposalDetails, setProposalDetails] = useState<ProposalDetails[]>([])
    const {signer} = useTurnkeyContext()
    useEffect(() => {
      (async () => {
        if (provider) {
          const filter = {
            address: governerContract,
            topics: [
              ethers.id("ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)")
            ],
            fromBlock: 27110027,
            toBlock: 'latest'
          };
          const govEthers = new ethers.Contract(governerContract, governerABI, provider);
          const thetreEthers = new ethers.Contract(thetreContract, thetreAB1, provider)
          const logs = await provider.provider?.getLogs(filter)
          const parsedLogs = logs?.map(log => govEthers.interface.parseLog(log));
          const proposals = await Promise.all(parsedLogs?.map(async log => {
            const proposalDetails: ProposalDetails[] = await Promise.all(log?.args?.calldatas?.map(async (calldata: any) => {
              const listingData = thetreEthers.interface.decodeFunctionData("listMovie", calldata);
              const data = JSON.parse(await getFromEdgeStore(listingData[1]));
              const state = await govEthers.state(log?.args?.proposalId);
              const voteEnd = log?.args?.voteEnd;
    
              return {
                data,
                voteEnd,
                proposalState: state
              };
            }));
    
            return proposalDetails;
          }) ?? []);
    
          const flatProposals = proposals.flat();
          setProposalDetails(flatProposals);
          console.log(flatProposals);
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
        const upload = await uploadVideo(getFileURL(JSON.parse(data.movieLink).result.key, JSON.parse(data.movieLink).result.relpath), governanceNFT, data.title, data.coverLink)
        try {
            const result = await uploadToEdgeStore({
              ...data,
              movieLink: upload.body.videos[0].id,
            });

            console.log(result)
            // const listingCalldata = thetreEthers.interface.encodeFunctionData("listMovie", ["movie", getFileURL("0x122d07b601c05953fe8229d17e5b5c0a66fbec3b9da839aea24afc18d86a6219", null)])
            const listingCalldata = thetreEthers.interface.encodeFunctionData("listMovie", [data.title, result.result.key])

            const govCalldata = govEthers.interface.encodeFunctionData("propose", [[thetreContract], [0], [listingCalldata], "List Movie: " + data.title]);
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
        <ThetreContext.Provider value={{ movies, createProposal, proposalDetails }}>
            {props.children}
        </ThetreContext.Provider>
    )
}

export default ThetreContextProvider;
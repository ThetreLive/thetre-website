import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { ethers } from "ethers";
import {
  getFileURL,
  getFromEdgeStore,
  uploadFileToEdgeStore,
  uploadToEdgeStore,
  uploadVideo,
} from "@/utils/theta";
import { governerABI } from "@/utils/abis/governerABI";
import { thetreABI } from "@/utils/abis/thetreABI";
import { contracts } from "@/utils/constants";
import { useWalletContext } from "./walletContext";
import { thetreTicketABI } from "@/utils/abis/thetreTicketABI";

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
  logoLink: string | File;
  isDRMEnabled: boolean;
  screeningType: "Recorded" | "Live Screening";
  livestreamData:
    | {
        selectedDates: Date[];
        screeningTimes: string[];
      }
    | undefined;
}

export enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

export interface ProposalDetails {
  data: ProposalData;
  voteEnd: number;
  id: string;
  proposalState: ProposalState;
  votes: {
    forProp: number;
    against: number;
  };
  proposer: string;
}
const provider = new ethers.JsonRpcProvider(
  "https://eth-rpc-api-testnet.thetatoken.org/rpc"
);

type StoreState = {
  movies: any[];
  loading: boolean;
  setLoader: (fn: any) => Promise<void>;
  proposalDetails: ProposalDetails[];
  castVote: (proposalId: string, support: 0 | 1) => Promise<void>;
  createProposal: (data: ProposalData) => Promise<void>;
  fetchProposals: () => Promise<void>;
  getVideo: (movieName: string) => Promise<string>;
  buyTicket: (movieName: string) => Promise<void>;
  buySubscription: () => Promise<void>;
  getAccess: () => Promise<void>;
};

const ThetreContext = createContext<StoreState>({
  movies: [],
  loading: false,
  setLoader: async () => {},
  proposalDetails: [],
  castVote: async () => {},
  createProposal: async () => {},
  fetchProposals: async () => {},
  getVideo: async () => "",
  buyTicket: async () => {},
  buySubscription: async () => {},
  getAccess: async () => {},
});

export const useThetreContext = () => useContext(ThetreContext);

type Props = {
  children?: React.ReactNode;
};

const ThetreContextProvider = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [proposalDetails, setProposalDetails] = useState<ProposalDetails[]>([]);
  const { signer, access, setAccess } = useWalletContext();

  useEffect(() => {
    if (signer && proposalDetails.length > 0) {
      getAccess();
    }
  }, [signer, proposalDetails])

  const setLoader = async (fn: any) => {
    setLoading(true);
    document.body.classList.add("overflow-hidden");
    await fn();
    setLoading(false);
    document.body.classList.remove("overflow-hidden");
  };

  const fetchProposals = async () => {
    if (proposalDetails.length === 0) {
      const proposalsRes = await fetch("/api/getEvents");
      const proposals: ProposalDetails[] = (await proposalsRes.json())
        .proposals;
      setProposalDetails(proposals.map((proposal) => {return {...proposal, livestreamData: proposal.data.livestreamData ? JSON.parse(JSON.parse(proposal.data.livestreamData as any)) : undefined}}));
    }
  };

  const getAccess = async () => {
    if (signer) {
      const thetreEthers = new ethers.Contract(
        contracts.THETRE,
        thetreABI,
        signer
      );
      const access = await Promise.all(
        proposalDetails
          .map(async (proposal) => {
            if (
              proposal.data.isDRMEnabled &&
              proposal.proposalState === ProposalState.Succeeded
            ) {
              const contract = await thetreEthers.movieTicket(
                proposal.data.title
              );
              const thetreTicketEthers = new ethers.Contract(
                contract,
                thetreTicketABI,
                signer
              );
              const tokens = await thetreTicketEthers.balanceOf(
                await signer.getAddress()
              );
              if (Number(tokens) > 0) {
                return proposal.data.title;
              }
            }
          })
      );
      setAccess(access.filter((item) => item !== undefined));
    }
  };

  const createProposal = async (data: ProposalData) => {
    for (const key in data) {
      if (data.hasOwnProperty(key) && data[key as keyof ProposalData] === "") {
        alert("Please fill all fields");
      }
    }
    const govEthers = new ethers.Contract(
      contracts.LISTING_GOVERNER,
      governerABI,
      signer
    );
    const thetreEthers = new ethers.Contract(
      contracts.THETRE,
      thetreABI,
      signer
    );

    const movieRes = await uploadFileToEdgeStore(data.movieLink as File);
    const trailerRes = await uploadFileToEdgeStore(data.trailerLink as File);
    const coverRes = await uploadFileToEdgeStore(data.coverLink as File);
    const logoRes = await uploadFileToEdgeStore(data.logoLink as File);
    let movieLink;
    if (data.isDRMEnabled) {
      const upload = await uploadVideo(
        getFileURL(movieRes.result.key, movieRes.result.relpath),
        contracts.GOVERNANCE_PASS,
        data.title,
        getFileURL(coverRes.result.key, coverRes.result.relpath)
      );
      movieLink = upload.body.videos[0].id;
    } else {
      movieLink = JSON.stringify(movieRes);
    }
    try {
      const result = await uploadToEdgeStore({
        ...data,
        livestreamData: JSON.stringify(data.livestreamData),
        trailerLink: JSON.stringify(trailerRes),
        coverLink: JSON.stringify(coverRes),
        logoLink: JSON.stringify(logoRes),
        movieLink,
      });

      const listingCalldata = thetreEthers.interface.encodeFunctionData(
        "listMovie",
        [data.title, result.result.key]
      );
      const govCalldata = govEthers.interface.encodeFunctionData("propose", [
        [contracts.THETRE],
        [0],
        [listingCalldata],
        "List Movie: " + data.title,
      ]);
      const txResponse = await signer?.sendTransaction({
        from: signer.getAddress(),
        to: contracts.LISTING_GOVERNER,
        data: govCalldata,
        gasLimit: 200000,
      });
      console.log("Transaction response:", txResponse);

      // Wait for the transaction to be mined
      const receipt = await txResponse?.wait();
      console.log("Receipt - ", receipt);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const castVote = async (proposalId: string, support: 0 | 1) => {
    if (!signer) {
      alert("Please Sign In");
      return;
    }
    const govEthers = new ethers.Contract(
      contracts.LISTING_GOVERNER,
      governerABI,
      signer
    );
    try {
      // Cast the vote
      const govCalldata = govEthers.interface.encodeFunctionData("castVote", [
        proposalId,
        support,
      ]);

      const txResponse = await signer?.sendTransaction({
        from: signer.getAddress(),
        to: contracts.LISTING_GOVERNER,
        data: govCalldata,
        gasLimit: 200000,
      });
      console.log("Transaction response:", txResponse);

      // Wait for the transaction to be mined
      const receipt = await txResponse?.wait();
      console.log("Receipt - ", receipt);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getVideo = async (movieName: string) => {
    const thetreEthers = new ethers.Contract(
      contracts.THETRE,
      thetreABI,
      provider
    );
    const ticket = await thetreEthers.movieVideos(movieName);
    return ticket;
  };

  const buyTicket = async (movieName: string) => {
    if (!signer) {
      alert("Please connect wallet/sign in first");
      return;
    }
    const thetreEthers = new ethers.Contract(
      contracts.THETRE,
      thetreABI,
      signer
    );
    try {
      // buy ticket
      const thetreCalldata = thetreEthers.interface.encodeFunctionData(
        "buyTicket",
        [movieName]
      );

      const txResponse = await signer?.sendTransaction({
        from: signer.getAddress(),
        to: contracts.THETRE,
        data: thetreCalldata,
        value: ethers.parseEther("10"),
        gasLimit: 200000,
      });
      console.log("Transaction response:", txResponse);

      // Wait for the transaction to be mined
      const receipt = await txResponse?.wait();
      console.log("Receipt - ", receipt);
      setAccess([...access, movieName]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const buySubscription = async () => {
    if (!signer) {
      alert("Please connect wallet/sign in first");
      return;
    }
    const thetreEthers = new ethers.Contract(
      contracts.THETRE,
      thetreABI,
      signer
    );
    try {
      // buy ticket
      const thetreCalldata = thetreEthers.interface.encodeFunctionData(
        "buySubscription"
      );

      const txResponse = await signer?.sendTransaction({
        from: signer.getAddress(),
        to: contracts.THETRE,
        data: thetreCalldata,
        value: ethers.parseEther("40"),
        gasLimit: 200000,
      });
      console.log("Transaction response:", txResponse);

      // Wait for the transaction to be mined
      const receipt = await txResponse?.wait();
      console.log("Receipt - ", receipt);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <ThetreContext.Provider
      value={{
        movies,
        createProposal,
        proposalDetails,
        fetchProposals,
        loading,
        setLoader,
        castVote,
        getVideo,
        buyTicket,
        getAccess,
        buySubscription
      }}
    >
      {props.children}
    </ThetreContext.Provider>
  );
};

export default ThetreContextProvider;

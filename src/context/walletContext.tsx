import { TurnkeySigner } from "@turnkey/ethers";
import  {ethers, BrowserProvider, Signer, EventLog } from "ethers";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { contracts } from "@/utils/constants";
import { thetreABI } from "@/utils/abis/thetreABI";

type StoreState = {
    signer: Signer | TurnkeySigner | null;
    setSigner: Dispatch<SetStateAction<StoreState["signer"]>>;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    access: string[];
    setAccess: (list: string[]) => void;
};
  
const WalletContext = createContext<StoreState>({
    signer: null,
    setSigner: () => {},
    connectWallet: async () => {},
    disconnectWallet: () => {},
    access: [],
    setAccess: () => {}
});
  
export const useWalletContext = () => useContext(WalletContext);
  
type Props = {
    children?: React.ReactNode;
};

const WalletContextProvider = (props: Props) => {
    const [signer, setSigner] = useState<StoreState["signer"]>(null)
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [access, setAccessList] = useState<string[]>([]);
    const setAccess = (list: string[]) => {
        console.log(list)
        setAccessList([...list]);
    }
    useEffect(() => {
      if (signer) {
        (async () => {
          const address = await signer.getAddress();
          let accessibleMovies = [];
          const thetreContract = new ethers.Contract(contracts.THETRE, thetreABI, signer);
          const filter = thetreContract.filters.BoughtTicket(null, address);
          const toBlock = await signer.provider!.getBlockNumber();

          const fetchEvents = async (startBlock: number, endBlock: number) => {
            const events = await thetreContract.queryFilter(filter, startBlock, endBlock);
            return events.map(event => (event as EventLog).args.movieName);
          };

          const promises = [];
          for (let startBlock = 27166848; startBlock <= toBlock; startBlock += 5000) {
            const endBlock = Math.min(startBlock + 5000 - 1, toBlock);
            promises.push(fetchEvents(startBlock, endBlock));
          }

          const results = await Promise.all(promises);
          accessibleMovies = results.flat();
          setAccess([...accessibleMovies]);
        })()
      }
    }, [signer])
    useEffect(() => {
        if (window.ethereum) {
          const providerInstance = new ethers.BrowserProvider(window.ethereum);
          setProvider(providerInstance);
      
          window.ethereum.on("accountsChanged", handleAccountsChanged);
          window.ethereum.on("chainChanged", () => window.location.reload());
      
          fetchInitialAccounts(providerInstance);
        }
      }, []);
      
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length > 0) {
          setSigner(await provider!.getSigner());
        } else {
          resetConnection();
        }
      };
      
      const fetchInitialAccounts = async (providerInstance: BrowserProvider) => {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          console.log(accounts)
          if (accounts.length > 0) {
            console.log(await providerInstance.getSigner())
            setSigner(await providerInstance.getSigner());
          }
        } catch (error) {
          console.error("Unable to fetch accounts:", error);
        }
      };
      
      const connectWallet = async () => {
        if (!window.ethereum) {
          window.open("https://metamask.io/download.html", "_blank");
          return;
        }
      
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setSigner(await provider!.getSigner());
          await ensureCorrectNetwork();
        } catch (error) {
          console.error("Wallet connection failed:", error);
        }
      };
      
      const disconnectWallet = () => {
        resetConnection();
      };
      
      const resetConnection = () => {
        setSigner(null);
      };
      
      const ensureCorrectNetwork = async () => {
        const desiredChainId = "0x169";
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: desiredChainId }],
          });
        } catch (error: any) {
          if (error.code === 4902) {
            await addNetwork(desiredChainId);
          } else {
            console.error("Network switch failed:", error);
          }
        }
      };
      
      const addNetwork = async (chainId: string) => {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId,
                chainName: "Theta Testnet",
                rpcUrls: ["https://eth-rpc-api-testnet.thetatoken.org/rpc"],
                nativeCurrency: {
                  name: "TFUEL",
                  symbol: "TFUEL",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://testnet-explorer.thetatoken.org/"],
              },
            ],
          });
        } catch (error) {
          console.error("Failed to add network:", error);
        }
      };
      
    return (
        <WalletContext.Provider value={{ signer, setSigner, connectWallet, disconnectWallet, access, setAccess }}>
            {props.children}
        </WalletContext.Provider>
    )
}

export default WalletContextProvider
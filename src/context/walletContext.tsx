import { governerABI } from "@/utils/abis/governerABI";
import { thetreABI } from "@/utils/abis/thetreABI";
import { contracts } from "@/utils/constants";
import { TurnkeySigner } from "@turnkey/ethers";
import  {ethers, BrowserProvider, Signer } from "ethers";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

type StoreState = {
    signer: Signer | TurnkeySigner | null;
    balance: string;
    setSigner: Dispatch<SetStateAction<StoreState["signer"]>>;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    access: string[];
    setAccess: (list: string[]) => void;
    transferTFUEL: (recipient: string, amount: string) => Promise<void>;
    transferNFT: (nftCollectionAddress: string, tokenId: string, recipient: string) => Promise<void>;
    power: string;
    subscribed: boolean | null;
};
  
const WalletContext = createContext<StoreState>({
    signer: null,
    balance: "0",
    setSigner: () => {},
    connectWallet: async () => {},
    disconnectWallet: () => {},
    access: [],
    setAccess: () => {},
    transferTFUEL: async () => {},
    transferNFT: async () => {},
    power: "0",
    subscribed: null,
});
  
export const useWalletContext = () => useContext(WalletContext);
  
type Props = {
    children?: React.ReactNode;
};

const WalletContextProvider = (props: Props) => {
    const [signer, setSigner] = useState<StoreState["signer"]>(null)
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [access, setAccessList] = useState<string[]>([]);
    const [balance, setBalance] = useState<string>("0")
    const [power, setPower] = useState<string>("0")
    const [subscribed, setSubscribed] = useState<boolean | null>(null)

    const setAccess = (list: string[]) => {
        setAccessList([...list]);
    }
    useEffect(() => {
        if (window.ethereum) {
          const providerInstance = new ethers.BrowserProvider(window.ethereum);
          setProvider(providerInstance);
      
          window.ethereum.on("accountsChanged", handleAccountsChanged);
          window.ethereum.on("chainChanged", () => window.location.reload());
      
          fetchInitialAccounts(providerInstance);
        }
      }, []);

      
      useEffect(() => {
        let interval: any;
        if (signer) {
          (async () => {
            const thetreEthers = new ethers.Contract(contracts.THETRE, thetreABI, signer)
            const isSubscribed = await thetreEthers.balanceOf(await signer.getAddress())
            setSubscribed(Number(isSubscribed) > 0)
          })()
          const getBalance = async () => {
            const govEthers = new ethers.Contract(
              contracts.LISTING_GOVERNER,
              governerABI,
              signer
            );
            const daPower = await govEthers.getVotes(await signer.getAddress(), Math.floor(Date.now() / 1000));
            setPower(ethers.formatUnits(daPower.toString()).toString())
            setBalance(ethers.formatEther(await signer.provider?.getBalance(await signer.getAddress())!)?.toString()!)
          }
          getBalance()
          interval = setInterval(getBalance, 30000)
        }
        return () => clearInterval(interval)
      }, [signer])
      
      const handleAccountsChanged = async (accounts: string[]) => {
        const providerInstance = new ethers.BrowserProvider(window.ethereum);
        setProvider(providerInstance);
        if (accounts.length > 0) {
          setSigner(await providerInstance.getSigner());
        } else {
          resetConnection();
        }
      };
      
      const fetchInitialAccounts = async (providerInstance: BrowserProvider) => {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
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
        const desiredChainId = "0x16d";
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
      const transferTFUEL = async (recipient: string, amount: string) => {
        if (!signer) {
          console.error("No signer available");
          return;
        }
        try {
          const tx = await signer.sendTransaction({
            to: recipient,
            value: ethers.parseEther(amount),
          });
          await tx.wait();
          console.log(`Transferred ${amount} ETH to ${recipient}`);
        } catch (error) {
          console.error("ETH transfer failed:", error);
        }
      };
      const transferNFT = async (nftCollectionAddress: string, tokenId: string, recipient: string) => {
        if (!signer) {
          console.error("No signer available");
          return;
        }
        try {
          const nftContract = new ethers.Contract(nftCollectionAddress, [
            "function transfer(address from, address to, uint256 tokenId) external",
          ], signer);
          const tx = await nftContract.transfer(await signer.getAddress(), recipient, tokenId);
          await tx.wait();
          console.log(`Transferred NFT (Collection: ${nftCollectionAddress}, Token ID: ${tokenId}) to ${recipient}`);
        } catch (error) {
          console.error("NFT transfer failed:", error);
        }
      };
            
    return (
        <WalletContext.Provider value={{ balance, signer, setSigner, connectWallet, disconnectWallet, access, setAccess, transferTFUEL, transferNFT, power, subscribed }}>
            {props.children}
        </WalletContext.Provider>
    )
}

export default WalletContextProvider
import { TurnkeySigner } from "@turnkey/ethers";
import { useTurnkey } from "@turnkey/sdk-react";
import axios from "axios";
import { useState, useEffect, createContext, useContext } from "react";
import { TWalletDetails } from "../types";
import { ethers } from "ethers";
import { useWalletContext } from "./walletContext";


type TWalletState = TWalletDetails | null;
type TSigner = TurnkeySigner | null;


const humanReadableDateTime = (): string => {
    return new Date().toLocaleString().replaceAll("/", "-").replaceAll(":", ".");
};

type StoreState = {
    wallet: TWalletState;
    createSubOrgAndWallet: () => any;
    login: () => any;
};
  
const TurnkeyContext = createContext<StoreState>({
    wallet: null,
    createSubOrgAndWallet: () => {},
    login: () => {}
});
  
export const useTurnkeyContext = () => useContext(TurnkeyContext);
  
type Props = {
    children?: React.ReactNode;
};

const TurnkeyContextProvider = (props: Props) => {
    const { turnkey, passkeyClient } = useTurnkey();
    const [wallet, setWallet] = useState<TWalletState>(null);
    const { signer, setSigner } = useWalletContext()

    useEffect(() => {
        (async () => {
            if (!wallet) {
                await turnkey?.logoutUser();
            }
        })();
    });

    const createSubOrgAndWallet = async () => {
        const subOrgName = `Thetre - ${humanReadableDateTime()}`;
        const credential = await passkeyClient?.createUserPasskey({
          publicKey: {
            rp: {
              id: process.env.NEXT_PUBLIC_RPID,
              name: "Thetre",
            },
            user: {
              name: subOrgName,
              displayName: subOrgName,
            },
          },
        });
    
        if (!credential?.encodedChallenge || !credential?.attestation) {
          return false;
        }
    
        const res = await axios.post(process.env.NEXT_PUBLIC_SERVER_SIGN_URL+"/createSubOrg", {
          subOrgName: subOrgName,
          challenge: credential?.encodedChallenge,
          attestation: credential?.attestation,
        });
    
        const response = res.data as TWalletDetails;
        setWallet(response);
        let ethersSigner = new TurnkeySigner({
            client: passkeyClient!,
            organizationId: response.subOrgId,
            signWith: response.address,
        });
        const provider = new ethers.JsonRpcProvider("https://eth-rpc-api-testnet.thetatoken.org/rpc")
        ethersSigner = ethersSigner.connect(provider)
        setSigner(ethersSigner)
      };
    

      const login = async () => {
        try {
          // Initiate login (read-only passkey session)
          const loginResponse = await passkeyClient?.login();
          if (!loginResponse?.organizationId) {
            return;
          }
    
          const currentUserSession = await turnkey?.currentUserSession();
          if (!currentUserSession) {
            return;
          }
    
          const walletsResponse = await currentUserSession?.getWallets();
          if (!walletsResponse?.wallets[0].walletId) {
            return;
          }
    
          const walletId = walletsResponse?.wallets[0].walletId;
          const walletAccountsResponse =
            await currentUserSession?.getWalletAccounts({
              organizationId: loginResponse?.organizationId,
              walletId,
            });
          if (!walletAccountsResponse?.accounts[0].address) {
            return;
          }
    
          setWallet({
            id: walletId,
            address: walletAccountsResponse?.accounts[0].address,
            subOrgId: loginResponse.organizationId,
          } as TWalletDetails);
            let ethersSigner = new TurnkeySigner({
                client: passkeyClient!,
                organizationId: loginResponse.organizationId,
                signWith: walletAccountsResponse?.accounts[0].address,
            });
            const provider = new ethers.JsonRpcProvider("https://eth-rpc-api-testnet.thetatoken.org/rpc")
            ethersSigner = ethersSigner.connect(provider)
            console.log(walletAccountsResponse?.accounts[0].address)
            setSigner(ethersSigner)

        } catch (e: any) {
          const message = `caught error: ${e.toString()}`;
          console.error(message);
        }
      };

    return (
        <TurnkeyContext.Provider value={{
            wallet,
            createSubOrgAndWallet,
            login
        }}>
            {props.children}
        </TurnkeyContext.Provider>
    )
}

export default TurnkeyContextProvider
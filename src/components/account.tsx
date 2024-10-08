import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWalletContext } from '@/context/walletContext';
import { ethers } from 'ethers';
import { useTurnkeyContext } from '@/context/turnkeyContext';
import MetaMaskIcon from '../../public/metamask.svg';
import Image from 'next/image';
import { useThetreContext } from '@/context/thetreContext';
import Link from 'next/link';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    login: boolean;
    setLogin: any;
}

const AccountPage: React.FC<ModalProps> = ({ isOpen, onClose, login, setLogin}) => {
  const [activeTab, setActiveTab] = useState<'tfuel' | 'nft'>('tfuel');
  const [walletAddress, setWalletAddress] = useState('');
  const { signer, access, transferNFT, transferTFUEL, connectWallet, balance: walletBalance, power, subscribed } = useWalletContext()
  const { createSubOrgAndWallet, login: loginPasskey } = useTurnkeyContext()
  const { proposalDetails, buySubscription } = useThetreContext()

  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [nftCollectionAddress, setNftCollectionAddress] = useState('');
  const [nftTokenId, setNftTokenId] = useState('');
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    alert('Wallet address copied to clipboard!');
  };

  const clearState = () => {
    setTransferAmount("")
    setRecipientAddress('')
    setNftCollectionAddress('')
    setNftTokenId('')
  }

  const handleTransferTFUEL = async () => {
    await transferTFUEL(recipientAddress, transferAmount);
    clearState()
  };

  const handleTransferNFT = async () => {
    await transferNFT(nftCollectionAddress, nftTokenId, recipientAddress);
    clearState()
  };

  const handleWatch = (id: string) => {
    // Redirect to the movie watch page
    router.replace(`/watch/${id}`);
  };

  useEffect(() => {
    if (signer) {
        (async () => {
            setWalletAddress(await signer.getAddress())
        })()
    }
  }, [signer])


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div className={`bg-bg-thetre rounded-lg ${signer ? "w-full" : ""} max-w-5xl text-white transition-transform transform duration-300`} onClick={e => e.stopPropagation()}>
        <div className="backdrop-blur-[100px] p-6 rounded-lg">
          {!signer ? (
            <div className='flex flex-col gap-2'>
              <div className='text-center text-2xl'>{login ? "Welcome Back to Thetre" : "Join the Thetre Experience"}</div>
              <div className='text-gray-400'>Tip - Use passkey based wallet to save yourself from losing your funds!</div>
              <button className='flex-1 rounded-md p-2 bg-custom-radial flex flex-row-reverse items-center gap-2 text-xl justify-between' onClick={async () => {
                login ? await loginPasskey() : await createSubOrgAndWallet()
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                </svg>
                <span>Use Passkey(more secure)</span>
              </button>
              <button className='flex-1 rounded-md p-2 bg-custom-radial flex flex-row-reverse items-center gap-2 text-xl justify-between' onClick={() => connectWallet()}>
                <Image src={MetaMaskIcon} alt="metamask" width={24} height={24} />
                <span>Use Metamask</span>
              </button>
              <p className='text-center mt-4'>{login ? "Don't" : "Already"} have an account? <button onClick={() => setLogin(!login)}>{login ? "Register" : "Login"}</button></p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Account</h2>
                  <p className="text-gray-400">{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`} {subscribed ? <span className='text-green-500 p-1 rounded-md'>Subscribed</span> : <button onClick={buySubscription} className="text-white bg-thetre-blue p-1 rounded-md">Subscribe Now</button>}</p>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center bg-gray-700 hover:bg-gray-600 p-2 rounded-md"
                >
                  Copy Address
                </button>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Wallet Balance</h3>
                <div className='flex flex-row gap-6 items-center'>
                  <p className="text-3xl font-bold">{walletBalance} TFUEL</p>
                  <div className='bg-golden-gradient rounded-full px-4 py-2 text-black'>{power} tDAO</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => setActiveTab('tfuel')}
                    className={`flex-1 p-2 rounded-md ${activeTab === 'tfuel' ? 'bg-thetre-blue' : 'bg-gray-700'}`}
                  >
                    Transfer TFUEL
                  </button>
                  <button
                    onClick={() => setActiveTab('nft')}
                    className={`flex-1 p-2 rounded-md ${activeTab === 'nft' ? 'bg-thetre-blue' : 'bg-gray-700'}`}
                  >
                    Transfer NFT
                  </button>
                </div>
                {activeTab === 'tfuel' ? (
                  <div>
                    <h3 className="text-lg font-semibold">Transfer TFUEL</h3>
                    <input
                      type="text"
                      placeholder="Recipient Address"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-700 placeholder-gray-400 mb-2"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-700 placeholder-gray-400 mb-2"
                    />
                    <button
                      onClick={handleTransferTFUEL}
                      className="bg-thetre-blue hover:bg-blue-500 p-2 w-full rounded-md"
                    >
                      Transfer
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold">Transfer NFT</h3>
                    <input
                      type="text"
                      placeholder="NFT Collection Address"
                      value={nftCollectionAddress}
                      onChange={(e) => setNftCollectionAddress(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-700 placeholder-gray-400 mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Token ID"
                      value={nftTokenId}
                      onChange={(e) => setNftTokenId(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-700 placeholder-gray-400 mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Recipient Address"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-700 placeholder-gray-400 mb-2"
                    />
                    <button
                      onClick={handleTransferNFT}
                      className="bg-thetre-blue hover:bg-blue-500 p-2 w-full rounded-md"
                    >
                      Transfer
                    </button>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Owned Movies</h3>
                <ul className="space-y-2 h-48 overflow-y-scroll">
                  {access.map((movie, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded-md">
                      <span>{movie}</span>
                      <Link
                        href={`/watch/${proposalDetails.filter((prop) => prop.data.title === movie)[0].id}`}
                        className="bg-thetre-blue hover:bg-blue-500 p-2 rounded-md"
                      >
                        Watch
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

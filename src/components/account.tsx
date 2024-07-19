import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWalletContext } from '@/context/walletContext';
import { ethers } from 'ethers';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AccountPage: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tfuel' | 'nft'>('tfuel');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const { signer, access, transferNFT, transferTFUEL } = useWalletContext()
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
            setWalletBalance(ethers.formatEther(await signer.provider?.getBalance(await signer.getAddress())!)?.toString()!)
        })()
    }
  }, [signer])


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={onClose}>
      <div className="bg-bg-blue rounded-lg w-full max-w-5xl text-white transition-transform transform duration-300" onClick={e => e.stopPropagation()}>
        <div className="backdrop-blur-[100px] p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Account</h2>
              <p className="text-gray-400">{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</p>
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
            <p className="text-3xl font-bold">{walletBalance}</p>
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
                  <button
                    onClick={() => handleWatch(index.toString())}
                    className="bg-thetre-blue hover:bg-blue-500 p-2 rounded-md"
                  >
                    Watch
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;

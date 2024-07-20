'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useWalletContext } from '@/context/walletContext';
import AccountPage from './account';
import { ethers } from 'ethers';

export default function Navbar() {
  const asPath = usePathname()
  const { signer } = useWalletContext()
  const [isVisible, setIsVisible] = useState(true);
  let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
  const [isWalletOpen, setWalletOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false)
  const [balance, setBalance] = useState("0")
  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) {
        // scroll down
        setIsVisible(false);
      } else {
        // scroll up
        setIsVisible(true);
      }
      lastScrollY = window.scrollY;
    }
  };
  useEffect(() => {
    if (signer) {
      (async () => {
        setBalance(ethers.formatEther(await signer.provider?.getBalance(await signer.getAddress())!).toString())
      })()
    }
  }, [signer])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <>
    <nav
      className={`px-8 py-2 w-full transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex space-x-12 p-4 rounded-xl">
          <Link href="/" className={`text-white font-bold ${asPath === '/' ? 'underline decoration-thetre-blue decoration-4' : ''}`}>
            Browse
          </Link>
          <Link href="/" className={`text-white font-bold ${asPath === '/movies' ? 'underline decoration-thetre-blue decoration-4' : ''}`}>
            Movies
          </Link>
          <Link href="/proposals" className={`text-white font-bold ${asPath === '/shows' ? 'underline decoration-thetre-blue decoration-4' : ''}`}>
            Proposals
          </Link>
        </div>
        {signer ? (
          <button className='flex items-center gap-2 rounded-full text-white bg-custom-radial px-6 py-2' onClick={() => setWalletOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
            </svg>
            <span>{balance} TFUEL</span>
          </button>
        ): (
          <div className='flex space-x-4 items-center'>
            <div className='flex rounded-full bg-custom-radial px-6 py-2'>
              <button onClick={() => {setWalletOpen(true); setIsLogin(false)}} className="text-white">
                Sign Up
              </button>
            </div>
            <div className='flex rounded-full bg-gray-700 px-8 py-2'>
              <button onClick={() => {setWalletOpen(true); setIsLogin(true)}} className="text-white">
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
    <AccountPage isOpen={isWalletOpen} onClose={() => setWalletOpen(false)} login={isLogin}/>
    </>
  );
}

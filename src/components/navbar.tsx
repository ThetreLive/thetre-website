'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTurnkeyContext } from '@/context/turnkeyContext';
import { useWalletContext } from '@/context/walletContext';
import AccountPage from './account';

export default function Navbar() {
  const asPath = usePathname()
  const { wallet, createSubOrgAndWallet, login } = useTurnkeyContext()
  const { signer } = useWalletContext()
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
  const [isWalletOpen, setWalletOpen] = useState(false);

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
        <div className="hidden md:flex space-x-12 p-4 rounded-xl">
          <Link href="/" className={`text-white font-bold ${asPath === '/' ? 'underline decoration-thetre-blue decoration-4' : ''}`}>
            Browse
          </Link>
          <Link href="/movies" className={`text-white font-bold ${asPath === '/movies' ? 'underline decoration-thetre-blue decoration-4' : ''}`}>
            Movies
          </Link>
          <Link href="/shows" className={`text-white font-bold ${asPath === '/shows' ? 'underline decoration-thetre-blue decoration-4' : ''}`}>
            Shows
          </Link>
        </div>
        {signer ? (
          <button className='hidden md:flex rounded-full text-white bg-custom-radial px-6 py-2' onClick={() => setWalletOpen(true)}>
            Account
          </button>
        ): (
          <div className='hidden md:flex space-x-4 items-center'>
            <div className='hidden md:flex rounded-full bg-custom-radial px-6 py-2'>
              <button onClick={createSubOrgAndWallet} className="text-white">
                Sign Up
              </button>
            </div>
            <div className='hidden md:flex rounded-full bg-gray-700 px-8 py-2'>
              <button onClick={login} className="text-white">
                Login
              </button>
            </div>
          </div>
        )}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-80 flex flex-col h-screen items-center justify-center transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-white focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <Link href="/" className="block text-white text-2xl p-2" onClick={() => setIsOpen(false)}>
          Browse
        </Link>
        <Link href="/movies" className="block text-white text-2xl p-2" onClick={() => setIsOpen(false)}>
          Movies
        </Link>
        <Link href="/shows" className="block text-white text-2xl p-2" onClick={() => setIsOpen(false)}>
          Shows
        </Link>
        {wallet ? (
          <Link href="/account" className="block text-white text-2xl p-2" onClick={() => setIsOpen(false)}>
            Account
          </Link>

        ) : (
          <div className="flex flex-col items-center">
            <button onClick={createSubOrgAndWallet} className="block text-white text-2xl p-2">
              Sign Up
            </button>
            <button onClick={login} className="block text-white text-2xl p-2">
              Login
            </button>
          </div>
        
        )}
      </div>
    </nav>
    <AccountPage isOpen={isWalletOpen} onClose={() => setWalletOpen(false)} />
    </>
  );
}

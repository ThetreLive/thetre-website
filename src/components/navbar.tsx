'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useWalletContext } from '@/context/walletContext';
import AccountPage from './account';

export default function Navbar() {
  const asPath = usePathname()
  const { signer } = useWalletContext()
  const [isVisible, setIsVisible] = useState(true);
  let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
  const [isWalletOpen, setWalletOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false)
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
        <div className="flex space-x-12 p-4 rounded-xl">
          <Link href="/" className={`text-white font-bold ${asPath === '/' ? 'underline decoration-thetre-blue decoration-4' : ''}`}>
            Browse
          </Link>
          <Link href="/movies" className={`text-white font-bold ${asPath === '/movies' ? 'underline decoration-thetre-blue decoration-4' : ''}`}>
            Movies
          </Link>
          <Link href="/proposals" className={`text-white font-bold ${asPath === '/shows' ? 'underline decoration-thetre-blue decoration-4' : ''}`}>
            Proposals
          </Link>
        </div>
        {signer ? (
          <button className='flex rounded-full text-white bg-custom-radial px-6 py-2' onClick={() => setWalletOpen(true)}>
            Account
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

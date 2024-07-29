'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWalletContext } from '@/context/walletContext';
import AccountPage from './account';
import Image from 'next/image';

export default function Navbar() {
  const asPath = usePathname()
  const { signer, balance } = useWalletContext()
  const [isWalletOpen, setWalletOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false)
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
    <nav
      className={`fixed inset-0 z-50 h-[100px] flex w-full`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div
        className={`w-full flex items-center justify-between z-10000 transition-transform duration-300 px-8 py-2  ${
          isVisible || asPath === "/proposals" ? 'translate-y-0' : '-translate-y-[100px]'
        }`}
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)"
        }}
      >
        <Link href="/">
          <Image
            src="/thetre-logo.png"
            alt="Thetre Logo"
            width={200}
            height={16}
            className="h-12"
            loading='eager'
          />
        </Link>
        <div className="flex space-x-12 p-4 rounded-xl">
          <Link href="/" className={`text-white font-bold ${asPath === '/' ? 'underline decoration-thetre-blue decoration-4' : ''}`}>
            Browse
          </Link>
          <Link href="/" className={`text-white font-bold ${asPath === '/movies' ? 'underline decoration-thetre-blue decoration-4' : ''}`}>
            Movies
          </Link>
          <Link href="/proposals" className={`text-white font-bold ${asPath === '/proposals' ? 'underline decoration-thetre-blue decoration-4' : ''}`}>
            Proposals
          </Link>
          <Link href="/plans" className={`text-white font-bold ${asPath === '/plans' ? 'underline decoration-thetre-blue decoration-4' : ''}`}>
            Plans
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
    <AccountPage isOpen={isWalletOpen} onClose={() => setWalletOpen(false)} login={isLogin} setLogin={(log: boolean) => setIsLogin(log)}/>
    </>
  );
}

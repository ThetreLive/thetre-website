'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const asPath = usePathname()
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

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
    <nav
      className={`absolute z-10 p-4 w-full transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="md:hidden flex items-center">
          <div className="text-white text-2xl font-bold">
            <Link href="/">
              <Image
                src="/thetre-logo.png"
                alt="Thetre Logo"
                width={200}
                height={16}
                className="md:h-16 lg:h-16"
              />
            </Link>
          </div>
        </div>
        <div className="hidden md:flex space-x-12 spread-bg">
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
        <div className='hidden md:flex rounded-full bg-custom-radial px-6 py-2'>
          <Link href="/account" className="text-white">
            Account
          </Link>
        </div>
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
        <Link href="/account" className="block text-white text-2xl p-2" onClick={() => setIsOpen(false)}>
          Account
        </Link>
      </div>
    </nav>
  );
}

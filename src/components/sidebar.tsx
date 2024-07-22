import { GENRES } from '@/utils/constants';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface Props {
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
}

const Sidebar: React.FC<Props> = ({ selectedGenres, setSelectedGenres }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (genre: string) => {
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genre)
        ? prevSelectedGenres.filter((g) => g !== genre)
        : [...prevSelectedGenres, genre]
    );
  };

  const filteredGenres = GENRES.filter((genre) =>
    genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className='overflow-y-scroll w-96 h-screen border-r border-gray-500/50'>
        <div className="flex items-center w-full justify-center py-2">
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
        </div>
            <div className="hidden lg:block p-4">
                <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search genres"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-2 border-b-2 rounded bg-transparent text-white"
                />
                </div>
                <div>
                {filteredGenres.map((genre) => (
                    <div key={genre} className="mb-2">
                    <label className="inline-flex items-center gap-2">
                        <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => handleCheckboxChange(genre)}
                        className="form-checkbox checkbox"
                        />
                        <span className="ml-2 text-white">{genre}</span>
                    </label>
                    </div>
                ))}
                </div>
            </div>
      </div>
  );
};

export default Sidebar;

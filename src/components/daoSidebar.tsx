import React, { useState } from 'react';

const genres = [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'Animation',
    'Biography',
    'Crime',
    'Documentary',
    'Family',
    'History',
    'Music',
    'Musical',
    'Sport',
    'War',
    'Western',
  ];

const Sidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
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

  const filteredGenres = genres.filter((genre) =>
    genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
        <div className='flex-shrink-0 lg:overflow-y-auto w-96 h-full bg-gray-100 p-4'>
            <div className="hidden lg:block">
                <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search genres"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-2 border border-gray-300 rounded"
                />
                </div>
                <div>
                {filteredGenres.map((genre) => (
                    <div key={genre} className="mb-2">
                    <label className="inline-flex items-center">
                        <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => handleCheckboxChange(genre)}
                        className="form-checkbox"
                        />
                        <span className="ml-2">{genre}</span>
                    </label>
                    </div>
                ))}
                </div>
            </div>
      </div>

      <div className="lg:hidden p-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close Genres' : 'Open Genres'}
        </button>
        <div
          className={`${
            isOpen ? 'max-h-screen' : 'max-h-0'
          } overflow-hidden transition-all duration-300 ease-in-out`}
        >
          {isOpen && (
            <div className="mt-4 bg-gray-100 p-4 rounded shadow-lg">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search genres"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                {filteredGenres.map((genre) => (
                  <div key={genre} className="mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => handleCheckboxChange(genre)}
                        className="form-checkbox"
                      />
                      <span className="ml-2">{genre}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

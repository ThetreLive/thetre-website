import React from 'react';

const MovieCard: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            <img
                className="w-full h-48 object-cover rounded-t-lg"
                src="https://example.com/movie-poster.jpg"
                alt="Movie Poster"
            />
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2">Movie Title</h2>
                <p className="text-gray-600">Movie Description</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-500">Release Date: 2022-01-01</span>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Watch Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
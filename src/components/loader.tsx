import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center h-screen">
      <div className="text-white text-2xl font-semibold">
        Getting The Thetre Experience Ready For You
      </div>
    </div>
  );
};

export default Loader;

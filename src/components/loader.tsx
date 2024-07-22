import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 gradient-background bg-opacity-50 z-50 flex items-center justify-center h-screen">
      <div className="text-white text-4xl font-semibold">
        Getting The Thetre Experience Ready For You
      </div>
    </div>
  );
};

export default Loader;

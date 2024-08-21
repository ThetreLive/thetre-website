import React from 'react';

interface Props {
  loading: boolean;
}

const Loader: React.FC<Props> = (props: Props) => {
  return (
    <div className="fixed inset-0 gradient-background bg-opacity-50 z-50 flex items-center justify-center h-screen">
      {props.loading && (
        <div className="text-white text-center text-4xl font-semibold hidden lg:block">
          Getting The Thetre Experience Ready For You
        </div>
      )}
      <div className="text-white text-center text-4xl font-semibold lg:hidden">
        Coming soon for the smaller screens. Please try on Desktop.
      </div>
    </div>
  );
};

export default Loader;

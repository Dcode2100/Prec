import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-10 h-10 border-4 border-t-4 border-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;

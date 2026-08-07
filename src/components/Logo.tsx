import React from 'react';

export const Logo: React.FC = () => {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      alt="Guna ICT Tutor Logo"
      className="w-full h-full object-contain"
    />
  );
};
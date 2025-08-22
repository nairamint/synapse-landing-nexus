import React from 'react';

const SimpleTest: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Simple Test Page</h1>
        <p className='text-gray-600 mb-4'>
          This is a minimal test page to verify routing and basic functionality.
        </p>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-2'>Test Status</h2>
          <ul className='space-y-2'>
            <li className='flex items-center'>
              <span className='w-3 h-3 bg-green-500 rounded-full mr-2'></span>
              Page loads successfully
            </li>
            <li className='flex items-center'>
              <span className='w-3 h-3 bg-green-500 rounded-full mr-2'></span>
              React components render
            </li>
            <li className='flex items-center'>
              <span className='w-3 h-3 bg-green-500 rounded-full mr-2'></span>
              Tailwind CSS working
            </li>
            <li className='flex items-center'>
              <span className='w-3 h-3 bg-green-500 rounded-full mr-2'></span>
              Routing functional
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleTest;

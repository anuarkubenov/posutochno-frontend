import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Apartments Management</h1>
      <ul>
        <li>
          <Link href="/add-apartment">Add Apartment</Link>
        </li>
        <li>
          <Link href="/apartments">View Apartments</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;

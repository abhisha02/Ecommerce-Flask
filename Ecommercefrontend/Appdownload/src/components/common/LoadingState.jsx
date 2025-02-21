import React from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

export const LoadingState = () => (
  <>
    <Header />
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Loading...</div>
    </div>
    <Footer />
  </>
);
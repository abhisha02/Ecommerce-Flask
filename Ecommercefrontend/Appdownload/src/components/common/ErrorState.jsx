import React from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

export const ErrorState = ({ error }) => (
  <>
    <Header />
    <div className="bg-red-50 p-4 rounded-lg">
      <p className="text-red-600">{error}</p>
    </div>
    <Footer />
  </>
);
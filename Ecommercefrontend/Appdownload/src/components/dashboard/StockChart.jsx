import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const StockChart = ({ stockStats }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Stock by Category</h2>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={stockStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4B5563" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
import React from 'react';

export const RecentProducts = ({ products }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Products</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {products.slice(0, 5).map(product => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">Rs.{product.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.stock > 20 ? 'bg-gray-600 text-white' :
                  product.stock > 10 ? 'bg-gray-400 text-white' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {product.stock} units
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
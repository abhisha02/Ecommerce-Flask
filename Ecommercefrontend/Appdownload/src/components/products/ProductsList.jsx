import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const ProductsList = ({ 
  products, 
  categories, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct 
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Products Management</h2>
      <button 
        onClick={onAddProduct}
        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Product
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {products.map(product => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                {categories.find(c => c.id === product.category_id)?.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-16 w-16 rounded-lg overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/64/64";
                        e.target.onerror = null;
                      }}
                    />
                  ) : (
                    <img 
                      src="/api/placeholder/64/64" 
                      alt="placeholder"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">Rs.{product.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">{product.stock}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button 
                    className="p-2 text-gray-600 hover:text-gray-800 border rounded-md hover:bg-gray-50"
                    onClick={() => onEditProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-2 text-gray-600 hover:text-gray-800 border rounded-md hover:bg-gray-50"
                    onClick={() => onDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const CategoriesList = ({
  categories,
  products,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Categories Management</h2>
      <button 
        onClick={onAddCategory}
        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Category
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {categories.map(category => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">{category.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">{category.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                {products.filter(p => p.category_id === category.id).length}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button 
                    className="p-2 text-gray-600 hover:text-gray-800 border rounded-md hover:bg-gray-50"
                    onClick={() => onEditCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-2 text-gray-600 hover:text-gray-800 border rounded-md hover:bg-gray-50"
                    onClick={() => onDeleteCategory(category.id)}
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
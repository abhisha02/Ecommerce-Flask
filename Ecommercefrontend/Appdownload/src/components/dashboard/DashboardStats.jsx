import React from 'react';
import { Package, Tags, ShoppingCart } from 'lucide-react';

const DashboardStats = ({ products, categories }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-gray-600 text-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <Package size={24} />
        <div>
          <h3 className="text-gray-200 text-sm">Total Products</h3>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-gray-600 text-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <Tags size={24} />
        <div>
          <h3 className="text-gray-200 text-sm">Total Categories</h3>
          <p className="text-3xl font-bold">{categories.length}</p>
        </div>
      </div>
    </div>
    
    <div className="bg-gray-600 text-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <ShoppingCart size={24} />
        <div>
          <h3 className="text-gray-200 text-sm">Low Stock Items</h3>
          <p className="text-3xl font-bold">
            {products.filter(p => p.stock < 10).length}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardStats;
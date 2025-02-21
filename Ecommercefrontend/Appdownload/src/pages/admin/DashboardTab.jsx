import React from 'react';
import DashboardStats from '../../components/dashboard/DashboardStats';
import { RecentProducts } from '../../components/dashboard/RecentProducts';
import { StockChart } from '../../components/dashboard/StockChart';

export const DashboardTab = ({ products, categories, stockStats }) => (
  <div className="space-y-6">
    <DashboardStats products={products} categories={categories} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RecentProducts products={products} />
      <StockChart stockStats={stockStats} />
    </div>
  </div>
);
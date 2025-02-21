import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { Notification } from '../../components/common/Notification';
import { DashboardTab } from './DashboardTab';
import { ProductsTab } from './ProductsTab';
import { CategoriesTab } from './CategoriesTab';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockStats, setStockStats] = useState([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { notification, showNotification } = useNotification();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      
      setProducts(productsRes.data.items || []);
      setCategories(categoriesRes.data || []);
 
      const stockByCategory = {};
      productsRes.data.items.forEach(product => {
        const category = categoriesRes.data.find(c => c.id === product.category_id);
        if (category) {
          stockByCategory[category.name] = (stockByCategory[category.name] || 0) + product.stock;
        }
      });

      setStockStats(Object.entries(stockByCategory).map(([name, value]) => ({
        name,
        value
      })));

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      category_id: parseInt(formData.get('category_id')),
      image_url: formData.get('image_url')
    };

    try {
      if (currentProduct) {
        await api.put(`/products/${currentProduct.id}`, productData);
        showNotification('Product updated successfully');
      } else {
        await api.post('/products', productData);
        showNotification('Product added successfully');
      }
      setIsProductDialogOpen(false);
      fetchData();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Operation failed', true);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const categoryData = {
      name: formData.get('name'),
      description: formData.get('description')
    };

    try {
      if (currentCategory) {
        await api.put(`/categories/${currentCategory.id}`, categoryData);
        showNotification('Category updated successfully');
      } else {
        await api.post('/categories', categoryData);
        showNotification('Category added successfully');
      }
      setIsCategoryDialogOpen(false);
      fetchData();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Operation failed', true);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      await api.delete(`/${type}s/${id}`);
      showNotification(`${type} deleted successfully`);
      fetchData();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Delete operation failed', true);
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === 'dashboard'
                    ? 'border-gray-600 text-gray-800'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`${
                  activeTab === 'products'
                    ? 'border-gray-600 text-gray-800'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('products')}
              >
                Products
              </button>
              <button
                className={`${
                  activeTab === 'categories'
                    ? 'border-gray-600 text-gray-800'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('categories')}
              >
                Categories
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <DashboardTab
            products={products}
            categories={categories}
            stockStats={stockStats}
          />
        )}

        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            categories={categories}
            currentProduct={currentProduct}
            isProductDialogOpen={isProductDialogOpen}
            onAddProduct={() => { setCurrentProduct(null); setIsProductDialogOpen(true); }}
            onEditProduct={(product) => { setCurrentProduct(product); setIsProductDialogOpen(true); }}
            onDeleteProduct={(id) => handleDelete('product', id)}
            onCloseDialog={() => setIsProductDialogOpen(false)}
            onSubmit={handleProductSubmit}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesTab
            categories={categories}
            products={products}
            currentCategory={currentCategory}
            isCategoryDialogOpen={isCategoryDialogOpen}
            onAddCategory={() => { setCurrentCategory(null); setIsCategoryDialogOpen(true); }}
            onEditCategory={(category) => { setCurrentCategory(category); setIsCategoryDialogOpen(true); }}
            onDeleteCategory={(id) => handleDelete('category', id)}
            onCloseDialog={() => setIsCategoryDialogOpen(false)}
            onSubmit={handleCategorySubmit}
          />
        )}

        <Notification notification={notification} />
      </main>
      <Footer />
    </>
  );
};

export default AdminDashboard;
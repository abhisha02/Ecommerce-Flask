import React from 'react';
import { ProductsList } from '../../components/products/ProductsList';
import  ProductDialog  from '../../components/products/ProductDialog';

export const ProductsTab = ({
  products,
  categories,
  currentProduct,
  isProductDialogOpen,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onCloseDialog,
  onSubmit
}) => (
  <>
    <ProductsList
      products={products}
      categories={categories}
      onAddProduct={onAddProduct}
      onEditProduct={onEditProduct}
      onDeleteProduct={onDeleteProduct}
    />
    <ProductDialog
      isOpen={isProductDialogOpen}
      onClose={onCloseDialog}
      onSubmit={onSubmit}
      currentProduct={currentProduct}
      categories={categories}
    />
  </>
);
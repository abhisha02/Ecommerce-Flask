import React from 'react';
import { CategoriesList } from '../../components/categories/CategoriesList';
import { CategoryDialog } from '../../components/categories/CategoryDialog';

export const CategoriesTab = ({
  categories,
  products,
  currentCategory,
  isCategoryDialogOpen,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onCloseDialog,
  onSubmit
}) => (
  <>
    <CategoriesList
      categories={categories}
      products={products}
      onAddCategory={onAddCategory}
      onEditCategory={onEditCategory}
      onDeleteCategory={onDeleteCategory}
    />
    <CategoryDialog
      isOpen={isCategoryDialogOpen}
      onClose={onCloseDialog}
      onSubmit={onSubmit}
      currentCategory={currentCategory}
    />
  </>
);

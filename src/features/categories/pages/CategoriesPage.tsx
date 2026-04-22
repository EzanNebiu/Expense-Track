import { useState } from 'react';
import { Container, Button, Alert, Box, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PageHeader } from '../../../shared/components/ui/PageHeader';
import { LoadingSpinner } from '../../../shared/components/ui/LoadingSpinner';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { EmptyState } from '../../../shared/components/ui/EmptyState';
import CategoryIcon from '@mui/icons-material/Category';
import { CategoryForm, type CategoryFormData } from '../components/CategoryForm';
import { CategoryList } from '../components/CategoryList';
import { useCategories } from '../hooks/useCategories';
import type { Category } from '../types/Category';

export const CategoriesPage = () => {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const filteredCategories = categories.filter((cat) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return cat.type === 'income' || cat.type === 'both';
    if (tabValue === 2) return cat.type === 'expense' || cat.type === 'both';
    return true;
  });

  const handleOpenForm = () => {
    setEditingCategory(undefined);
    setFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingCategory(undefined);
  };

  const handleSubmitForm = async (data: CategoryFormData) => {
    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
      } else {
        await createCategory({ ...data, isDefault: false });
      }
      handleCloseForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingCategory) {
      await deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categor${categories.length !== 1 ? 'ies' : 'y'}`}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Add Category
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="All" />
          <Tab label="Income" />
          <Tab label="Expense" />
        </Tabs>
      </Box>

      {filteredCategories.length === 0 ? (
        <EmptyState
          icon={<CategoryIcon />}
          title="No categories found"
          description="Add your first category to organize transactions"
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenForm}>
              Add Category
            </Button>
          }
        />
      ) : (
        <CategoryList
          categories={filteredCategories}
          onEdit={handleEditCategory}
          onDelete={setDeletingCategory}
        />
      )}

      <CategoryForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        category={editingCategory}
        loading={submitting}
      />

      <ConfirmDialog
        open={!!deletingCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingCategory(null)}
        dangerous
      />
    </Container>
  );
};


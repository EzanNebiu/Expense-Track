import { useState } from 'react';
import { Container, Button, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PageHeader } from '../../../shared/components/ui/PageHeader';
import { LoadingSpinner } from '../../../shared/components/ui/LoadingSpinner';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { EmptyState } from '../../../shared/components/ui/EmptyState';
import RepeatIcon from '@mui/icons-material/Repeat';
import { RecurringForm, type RecurringFormData } from '../components/RecurringForm';
import { RecurringList } from '../components/RecurringList';
import { useRecurring } from '../hooks/useRecurring';
import { useCategories } from '../../categories/hooks/useCategories';
import type { RecurringTransaction } from '../types/RecurringTransaction';

export const RecurringPage = () => {
  const { recurring, loading, error, createRecurring, updateRecurring, deleteRecurring } = useRecurring();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | undefined>();
  const [deletingRecurring, setDeletingRecurring] = useState<RecurringTransaction | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const categoryIconMap = categories.reduce((acc, cat) => {
    acc[cat.name] = cat.icon;
    return acc;
  }, {} as Record<string, string>);

  const handleOpenForm = () => {
    setEditingRecurring(undefined);
    setFormOpen(true);
  };

  const handleEditRecurring = (item: RecurringTransaction) => {
    setEditingRecurring(item);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingRecurring(undefined);
  };

  const handleSubmitForm = async (data: RecurringFormData) => {
    setSubmitting(true);
    try {
      if (editingRecurring) {
        await updateRecurring(editingRecurring.id, data);
      } else {
        await createRecurring(data);
      }
      handleCloseForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingRecurring) {
      await deleteRecurring(deletingRecurring.id);
      setDeletingRecurring(null);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updateRecurring(id, { isActive });
  };

  if (loading || categoriesLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Recurring Transactions"
        subtitle={`${recurring.length} recurring transaction${recurring.length !== 1 ? 's' : ''}`}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Add Recurring
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {recurring.length === 0 ? (
        <EmptyState
          icon={<RepeatIcon />}
          title="No recurring transactions"
          description="Set up automatic income or expense transactions"
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenForm}>
              Add Recurring Transaction
            </Button>
          }
        />
      ) : (
        <RecurringList
          recurring={recurring}
          categoryIcons={categoryIconMap}
          onEdit={handleEditRecurring}
          onDelete={setDeletingRecurring}
          onToggleActive={handleToggleActive}
        />
      )}

      <RecurringForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        categories={categories}
        recurring={editingRecurring}
        loading={submitting}
      />

      <ConfirmDialog
        open={!!deletingRecurring}
        title="Delete Recurring Transaction"
        message={`Are you sure you want to delete "${deletingRecurring?.description}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingRecurring(null)}
        dangerous
      />
    </Container>
  );
};


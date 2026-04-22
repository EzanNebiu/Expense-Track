import { useState } from 'react';
import { Container, Button, Box, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PageHeader } from '../../../shared/components/ui/PageHeader';
import { LoadingSpinner } from '../../../shared/components/ui/LoadingSpinner';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { TransactionForm, type TransactionFormData } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { TransactionFilters } from '../components/TransactionFilters';
import { useTransactions } from '../hooks/useTransactions';
import { useTransactionFilters } from '../hooks/useTransactionFilters';
import { useCategories } from '../../categories/hooks/useCategories';
import type { Transaction } from '../types/Transaction';
import type { TransactionFilters as ITransactionFilters } from '../types/TransactionFilters';

export const TransactionsPage = () => {
  const { transactions, loading, error, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [filters, setFilters] = useState<ITransactionFilters>({
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredTransactions = useTransactionFilters(transactions, filters);

  const handleOpenForm = () => {
    setEditingTransaction(undefined);
    setFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTransaction(undefined);
  };

  const handleSubmitForm = async (data: TransactionFormData) => {
    setSubmitting(true);
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
      } else {
        await createTransaction(data);
      }
      handleCloseForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingTransaction) {
      await deleteTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
    }
  };

  if (loading || categoriesLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Transactions"
        subtitle={`${filteredTransactions.length} transaction${filteredTransactions.length !== 1 ? 's' : ''}`}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Add Transaction
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TransactionFilters
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
      />

      <Box sx={{ mb: 8 }}>
        <TransactionList
          transactions={filteredTransactions}
          categories={categories}
          onEdit={handleEditTransaction}
          onDelete={setDeletingTransaction}
        />
      </Box>

      <TransactionForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        categories={categories}
        transaction={editingTransaction}
        loading={submitting}
      />

      <ConfirmDialog
        open={!!deletingTransaction}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deletingTransaction?.description}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTransaction(null)}
        dangerous
      />
    </Container>
  );
};


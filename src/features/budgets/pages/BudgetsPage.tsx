import { useState } from 'react';
import { Container, Button, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PageHeader } from '../../../shared/components/ui/PageHeader';
import { LoadingSpinner } from '../../../shared/components/ui/LoadingSpinner';
import { ConfirmDialog } from '../../../shared/components/ui/ConfirmDialog';
import { EmptyState } from '../../../shared/components/ui/EmptyState';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { BudgetForm, type BudgetFormData } from '../components/BudgetForm';
import { BudgetList } from '../components/BudgetList';
import { useBudgets } from '../hooks/useBudgets';
import { useBudgetTracking } from '../hooks/useBudgetTracking';
import { useCategories } from '../../categories/hooks/useCategories';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import type { Budget } from '../types/Budget';

export const BudgetsPage = () => {
  const { budgets, loading: budgetsLoading, error, createBudget, updateBudget, deleteBudget } = useBudgets();
  const { categories, loading: categoriesLoading } = useCategories();
  const { transactions, loading: transactionsLoading } = useTransactions();
  
  const categoryNameMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {} as Record<string, string>);

  const budgetTracking = useBudgetTracking(budgets, transactions, categoryNameMap);
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>();
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenForm = () => {
    setEditingBudget(undefined);
    setFormOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingBudget(undefined);
  };

  const handleSubmitForm = async (data: BudgetFormData) => {
    setSubmitting(true);
    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, data);
      } else {
        await createBudget(data);
      }
      handleCloseForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingBudget) {
      await deleteBudget(deletingBudget.id);
      setDeletingBudget(null);
    }
  };

  const loading = budgetsLoading || categoriesLoading || transactionsLoading;

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Budgets"
        subtitle={`${budgets.length} budget${budgets.length !== 1 ? 's' : ''} set`}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Add Budget
          </Button>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {budgetTracking.length === 0 ? (
        <EmptyState
          icon={<AccountBalanceWalletIcon />}
          title="No budgets set"
          description="Set budget limits for your expense categories"
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenForm}>
              Add Budget
            </Button>
          }
        />
      ) : (
        <BudgetList
          budgets={budgetTracking}
          categories={categories}
          onEdit={handleEditBudget}
          onDelete={setDeletingBudget}
        />
      )}

      <BudgetForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        categories={categories}
        budget={editingBudget}
        loading={submitting}
      />

      <ConfirmDialog
        open={!!deletingBudget}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingBudget(null)}
        dangerous
      />
    </Container>
  );
};


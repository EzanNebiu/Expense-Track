import { useState, type FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  InputAdornment,
} from '@mui/material';
import type { Budget } from '../types/Budget';
import type { BudgetPeriod } from '../types/BudgetPeriod';
import type { Category } from '../../categories/types/Category';
import { validateAmount, validateRequired } from '../../../shared/utils/validators';
import { format } from 'date-fns';

interface BudgetFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => Promise<void>;
  categories: Category[];
  budget?: Budget;
  loading?: boolean;
}

export interface BudgetFormData {
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate?: Date;
}

export const BudgetForm = ({
  open,
  onClose,
  onSubmit,
  categories,
  budget,
  loading = false,
}: BudgetFormProps) => {
  const [categoryId, setCategoryId] = useState(budget?.categoryId || '');
  const [amount, setAmount] = useState(budget?.amount.toString() || '');
  const [period, setPeriod] = useState<BudgetPeriod>(budget?.period || 'monthly');
  const [startDate, setStartDate] = useState(
    budget?.startDate ? format(budget.startDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const expenseCategories = categories.filter(
    (cat) => cat.type === 'expense' || cat.type === 'both'
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    const categoryValidation = validateRequired(categoryId);
    if (!categoryValidation.valid) {
      newErrors.categoryId = 'Please select a category';
    }

    const amountValidation = validateAmount(parseFloat(amount));
    if (!amountValidation.valid) {
      newErrors.amount = amountValidation.message || '';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit({
      categoryId,
      amount: parseFloat(amount),
      period,
      startDate: new Date(startDate),
    });

    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {budget ? 'Edit Budget' : 'Add Budget'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth error={!!errors.categoryId} disabled={loading}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryId}
                label="Category"
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                {expenseCategories.length === 0 ? (
                  <MenuItem disabled>No expense categories available</MenuItem>
                ) : (
                  expenseCategories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.categoryId && (
                <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 2 }}>
                  {errors.categoryId}
                </Box>
              )}
            </FormControl>

            <TextField
              label="Budget Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={!!errors.amount}
              helperText={errors.amount}
              required
              fullWidth
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 },
                },
              }}
            />

            <FormControl fullWidth disabled={loading}>
              <InputLabel>Period</InputLabel>
              <Select
                value={period}
                label="Period"
                onChange={(e) => setPeriod(e.target.value as BudgetPeriod)}
              >
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              fullWidth
              disabled={loading}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Saving...' : budget ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

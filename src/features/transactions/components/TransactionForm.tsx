import { useState, useEffect, type FormEvent } from 'react';
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
  ToggleButtonGroup,
  ToggleButton,
  Box,
  InputAdornment,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import type { Transaction } from '../types/Transaction';
import type { TransactionType } from '../types/TransactionType';
import type { Category } from '../../categories/types/Category';
import { validateAmount, validateRequired } from '../../../shared/utils/validators';
import { parseInputDate } from '../../../shared/utils/dateUtils';
import { format } from 'date-fns';

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  categories: Category[];
  transaction?: Transaction;
  loading?: boolean;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export const TransactionForm = ({
  open,
  onClose,
  onSubmit,
  categories,
  transaction,
  loading = false,
}: TransactionFormProps) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setDescription(transaction.description);
      setDate(format(transaction.date, 'yyyy-MM-dd'));
    } else {
      setType('expense');
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
    }
    setErrors({});
  }, [transaction, open]);

  const availableCategories = categories.filter(
    (cat) => cat.type === type || cat.type === 'both'
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    const amountValidation = validateAmount(parseFloat(amount));
    if (!amountValidation.valid) {
      newErrors.amount = amountValidation.message || '';
    }

    const categoryValidation = validateRequired(category);
    if (!categoryValidation.valid) {
      newErrors.category = 'Please select a category';
    }

    const descriptionValidation = validateRequired(description);
    if (!descriptionValidation.valid) {
      newErrors.description = descriptionValidation.message || '';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: parseInputDate(date),
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
          {transaction ? 'Edit Transaction' : 'Add Transaction'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={(_, newType) => {
                if (newType) {
                  setType(newType);
                  setCategory('');
                }
              }}
              fullWidth
              disabled={loading}
            >
              <ToggleButton value="income" color="success">
                <TrendingUpIcon sx={{ mr: 1 }} />
                Income
              </ToggleButton>
              <ToggleButton value="expense" color="error">
                <TrendingDownIcon sx={{ mr: 1 }} />
                Expense
              </ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label="Amount"
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

            <FormControl fullWidth error={!!errors.category} disabled={loading}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {availableCategories.length === 0 ? (
                  <MenuItem disabled>No categories available</MenuItem>
                ) : (
                  availableCategories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.name}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.category && (
                <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 2 }}>
                  {errors.category}
                </Box>
              )}
            </FormControl>

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              required
              fullWidth
              disabled={loading}
              multiline
              rows={2}
            />

            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
            {loading ? 'Saving...' : transaction ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

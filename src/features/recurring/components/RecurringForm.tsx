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
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import type { RecurringTransaction } from '../types/RecurringTransaction';
import type { RecurringFrequency } from '../types/RecurringFrequency';
import type { TransactionType } from '../../transactions/types/TransactionType';
import type { Category } from '../../categories/types/Category';
import { validateAmount, validateRequired } from '../../../shared/utils/validators';
import { parseInputDate } from '../../../shared/utils/dateUtils';
import { format } from 'date-fns';

interface RecurringFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RecurringFormData) => Promise<void>;
  categories: Category[];
  recurring?: RecurringTransaction;
  loading?: boolean;
}

export interface RecurringFormData {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  frequency: RecurringFrequency;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export const RecurringForm = ({
  open,
  onClose,
  onSubmit,
  categories,
  recurring,
  loading = false,
}: RecurringFormProps) => {
  const [type, setType] = useState<TransactionType>(recurring?.type || 'expense');
  const [amount, setAmount] = useState(recurring?.amount.toString() || '');
  const [category, setCategory] = useState(recurring?.category || '');
  const [description, setDescription] = useState(recurring?.description || '');
  const [frequency, setFrequency] = useState<RecurringFrequency>(recurring?.frequency || 'monthly');
  const [startDate, setStartDate] = useState(
    recurring?.startDate ? format(recurring.startDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(
    recurring?.endDate ? format(recurring.endDate, 'yyyy-MM-dd') : ''
  );
  const [isActive, setIsActive] = useState(recurring?.isActive ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      frequency,
      startDate: parseInputDate(startDate),
      endDate: endDate ? parseInputDate(endDate) : undefined,
      isActive,
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
          {recurring ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
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
                {availableCategories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.name}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
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
            />

            <FormControl fullWidth disabled={loading}>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={frequency}
                label="Frequency"
                onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
              >
                <MenuItem value="daily">Daily</MenuItem>
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

            <TextField
              label="End Date (Optional)"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              disabled={loading}
              slotProps={{
                inputLabel: { shrink: true },
              }}
              helperText="Leave empty for no end date"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Active"
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
            {loading ? 'Saving...' : recurring ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

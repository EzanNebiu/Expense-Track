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
  Grid,
} from '@mui/material';
import type { Category } from '../types/Category';
import type { TransactionType } from '../../transactions/types/TransactionType';
import { validateRequired } from '../../../shared/utils/validators';

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  category?: Category;
  loading?: boolean;
}

export interface CategoryFormData {
  name: string;
  color: string;
  icon: string;
  type: TransactionType | 'both';
}

const PREDEFINED_COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#6366f1',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#64748b',
];

const PREDEFINED_ICONS = [
  '💰', '💵', '💳', '🏦', '📊', '📈', '📉', '💼', '🎯', '💎',
  '🍔', '🚗', '🏠', '💡', '🛍️', '🎬', '⚕️', '📚', '✈️', '🎁',
  '💪', '🎮', '📱', '💻', '☕', '🍕', '🎵', '🏃', '🎨', '📝',
];

export const CategoryForm = ({
  open,
  onClose,
  onSubmit,
  category,
  loading = false,
}: CategoryFormProps) => {
  const [name, setName] = useState(category?.name || '');
  const [color, setColor] = useState(category?.color || PREDEFINED_COLORS[0]);
  const [icon, setIcon] = useState(category?.icon || PREDEFINED_ICONS[0]);
  const [type, setType] = useState<TransactionType | 'both'>(category?.type || 'expense');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    const nameValidation = validateRequired(name);
    if (!nameValidation.valid) {
      newErrors.name = nameValidation.message || '';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit({ name, color, icon, type });
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    setName(category?.name || '');
    setColor(category?.color || PREDEFINED_COLORS[0]);
    setIcon(category?.icon || PREDEFINED_ICONS[0]);
    setType(category?.type || 'expense');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {category ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
              fullWidth
              disabled={loading}
              autoFocus
            />

            <FormControl fullWidth disabled={loading}>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                label="Type"
                onChange={(e) => setType(e.target.value as TransactionType | 'both')}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="both">Both</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <InputLabel sx={{ mb: 1 }}>Color</InputLabel>
              <Grid container spacing={1}>
                {PREDEFINED_COLORS.map((c) => (
                  <Grid key={c} size={{ xs: 2.4 }}>
                    <Box
                      onClick={() => setColor(c)}
                      sx={{
                        width: '100%',
                        height: 50,
                        bgcolor: c,
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: color === c ? '3px solid' : '2px solid',
                        borderColor: color === c ? 'primary.main' : 'divider',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box>
              <InputLabel sx={{ mb: 1 }}>Icon</InputLabel>
              <Grid container spacing={1}>
                {PREDEFINED_ICONS.map((i) => (
                  <Grid key={i} size={{ xs: 2.4 }}>
                    <Box
                      onClick={() => setIcon(i)}
                      sx={{
                        width: '100%',
                        height: 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: icon === i ? '3px solid' : '2px solid',
                        borderColor: icon === i ? 'primary.main' : 'divider',
                        bgcolor: 'background.paper',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          bgcolor: 'action.hover',
                        },
                      }}
                    >
                      {i}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                bgcolor: 'action.hover',
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: color,
                  borderRadius: 2,
                  fontSize: '2rem',
                }}
              >
                {icon}
              </Box>
              <Box>
                <InputLabel>Preview</InputLabel>
                <Box sx={{ fontSize: '1.1rem', fontWeight: 600 }}>{name || 'Category Name'}</Box>
              </Box>
            </Box>
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
            {loading ? 'Saving...' : category ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

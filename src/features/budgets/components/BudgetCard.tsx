import { Card, CardContent, Box, Typography, LinearProgress, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Budget } from '../types/Budget';
import { formatCurrency } from '../../../shared/utils/formatters';

interface BudgetCardProps {
  budget: Budget;
  categoryName: string;
  categoryIcon: string;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export const BudgetCard = ({
  budget,
  categoryName,
  categoryIcon,
  spent,
  remaining,
  percentage,
  isOverBudget,
  onEdit,
  onDelete,
}: BudgetCardProps) => {
  const getProgressColor = (): 'success' | 'warning' | 'error' => {
    if (isOverBudget) return 'error';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  const getPeriodLabel = (period: string): string => {
    return period.charAt(0).toUpperCase() + period.slice(1);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: isOverBudget ? 'error.light' : 'primary.light',
              borderRadius: 2,
              fontSize: '1.5rem',
              mr: 2,
            }}
          >
            {categoryIcon}
          </Box>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {categoryName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getPeriodLabel(budget.period)} Budget
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={() => onEdit(budget)} sx={{ color: 'primary.main' }}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete(budget)} sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Spent
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatCurrency(spent)} / {formatCurrency(budget.amount)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            color={getProgressColor()}
            sx={{ height: 8, borderRadius: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {percentage.toFixed(0)}% used
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: isOverBudget ? 'error.main' : remaining < budget.amount * 0.2 ? 'warning.main' : 'success.main',
              }}
            >
              {isOverBudget ? 'Over by ' : 'Remaining: '}
              {formatCurrency(Math.abs(remaining))}
            </Typography>
          </Box>
        </Box>

        {isOverBudget && (
          <Box
            sx={{
              p: 1,
              bgcolor: 'error.light',
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: 'error.dark', fontWeight: 600 }}>
              ⚠️ Budget exceeded!
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

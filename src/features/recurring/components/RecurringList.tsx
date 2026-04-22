import { Card, CardContent, Box, Typography, IconButton, Chip, Switch } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import type { RecurringTransaction } from '../types/RecurringTransaction';
import { formatCurrency } from '../../../shared/utils/formatters';
import { formatDate } from '../../../shared/utils/dateUtils';

interface RecurringListProps {
  recurring: RecurringTransaction[];
  categoryIcons: Record<string, string>;
  onEdit: (recurring: RecurringTransaction) => void;
  onDelete: (recurring: RecurringTransaction) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

export const RecurringList = ({
  recurring,
  categoryIcons,
  onEdit,
  onDelete,
  onToggleActive,
}: RecurringListProps) => {
  const getFrequencyLabel = (frequency: string): string => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {recurring.map((item) => {
        const isIncome = item.type === 'income';
        const categoryIcon = categoryIcons[item.category] || '📝';

        return (
          <Card key={item.id} sx={{ opacity: item.isActive ? 1 : 0.6 }}>
            <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: isIncome ? 'success.light' : 'error.light',
                    color: isIncome ? 'success.dark' : 'error.dark',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}
                >
                  {categoryIcon}
                </Box>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {item.description}
                    </Typography>
                    {!item.isActive && (
                      <Chip label="Inactive" size="small" variant="outlined" />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={item.category}
                      size="small"
                      sx={{
                        bgcolor: isIncome ? 'success.light' : 'error.light',
                        color: isIncome ? 'success.dark' : 'error.dark',
                      }}
                    />
                    <Chip
                      label={getFrequencyLabel(item.frequency)}
                      size="small"
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Starting {formatDate(item.startDate)}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 0.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: isIncome ? 'success.main' : 'error.main',
                    }}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(item.amount)}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                    <Switch
                      size="small"
                      checked={item.isActive}
                      onChange={(e) => onToggleActive(item.id, e.target.checked)}
                    />
                    <IconButton
                      size="small"
                      onClick={() => onEdit(item)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(item)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

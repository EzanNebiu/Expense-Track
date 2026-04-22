import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import type { Transaction } from '../types/Transaction';
import { formatCurrency } from '../../../shared/utils/formatters';
import { formatDate } from '../../../shared/utils/dateUtils';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  categoryIcon?: string;
  categoryColor?: string;
}

export const TransactionItem = ({
  transaction,
  onEdit,
  onDelete,
  categoryIcon,
  categoryColor,
}: TransactionItemProps) => {
  const isIncome = transaction.type === 'income';

  return (
    <Card
      sx={{
        mb: 1.5,
        '&:hover': {
          boxShadow: 3,
          transition: 'box-shadow 0.2s',
        },
      }}
    >
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
            {categoryIcon || (isIncome ? <TrendingUpIcon /> : <TrendingDownIcon />)}
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {transaction.description}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={transaction.category}
                size="small"
                sx={{
                  bgcolor: categoryColor || (isIncome ? 'success.light' : 'error.light'),
                  color: isIncome ? 'success.dark' : 'error.dark',
                  fontWeight: 500,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatDate(transaction.date)}
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
              {formatCurrency(transaction.amount)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => onEdit(transaction)}
                sx={{ color: 'primary.main' }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(transaction)}
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
};

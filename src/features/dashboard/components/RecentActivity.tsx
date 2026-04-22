import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, Chip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Transaction } from '../../transactions/types/Transaction';
import type { Category } from '../../categories/types/Category';
import { getRecentTransactions } from '../../transactions/utils/transactionUtils';
import { formatCurrency } from '../../../shared/utils/formatters';
import { formatDate } from '../../../shared/utils/dateUtils';
import { EmptyState } from '../../../shared/components/ui/EmptyState';
import HistoryIcon from '@mui/icons-material/History';

interface RecentActivityProps {
  transactions: Transaction[];
  categories: Category[];
  limit?: number;
}

export const RecentActivity = ({ transactions, categories, limit = 5 }: RecentActivityProps) => {
  const recentTransactions = getRecentTransactions(transactions, limit);

  if (recentTransactions.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <EmptyState
            icon={<HistoryIcon />}
            title="No recent activity"
            description="Your recent transactions will appear here"
          />
        </CardContent>
      </Card>
    );
  }

  const getCategoryIcon = (categoryName: string) => {
    return categories.find((cat) => cat.name === categoryName)?.icon || '📝';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <List disablePadding>
          {recentTransactions.map((transaction, index) => {
            const isIncome = transaction.type === 'income';
            const isLast = index === recentTransactions.length - 1;

            return (
              <ListItem
                key={transaction.id}
                sx={{
                  px: 0,
                  borderBottom: isLast ? 'none' : '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: isIncome ? 'success.light' : 'error.light',
                    mr: 2,
                    fontSize: '1.25rem',
                  } as SxProps<Theme>}
                >
                  {getCategoryIcon(transaction.category)}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {transaction.description}
                      </Typography>
                      <Chip
                        label={transaction.category}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem' } as SxProps<Theme>}
                      />
                    </Box>
                  }
                  secondary={formatDate(transaction.date)}
                />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700, color: isIncome ? 'success.main' : 'error.main' }}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </Typography>
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

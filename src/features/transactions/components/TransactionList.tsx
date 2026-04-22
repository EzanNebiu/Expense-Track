import { Box } from '@mui/material';
import type { Transaction } from '../types/Transaction';
import type { Category } from '../../categories/types/Category';
import { TransactionItem } from './TransactionItem';
import { EmptyState } from '../../../shared/components/ui/EmptyState';
import ReceiptIcon from '@mui/icons-material/Receipt';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionList = ({
  transactions,
  categories,
  onEdit,
  onDelete,
}: TransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<ReceiptIcon />}
        title="No transactions found"
        description="Start by adding your first transaction"
      />
    );
  }

  const getCategoryDetails = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    return {
      icon: category?.icon,
      color: category?.color,
    };
  };

  return (
    <Box>
      {transactions.map((transaction) => {
        const { icon, color } = getCategoryDetails(transaction.category);
        return (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
            categoryIcon={icon}
            categoryColor={color}
          />
        );
      })}
    </Box>
  );
};

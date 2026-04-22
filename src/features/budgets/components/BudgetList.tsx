import { Box } from '@mui/material';
import type { Budget } from '../types/Budget';
import type { Category } from '../../categories/types/Category';
import { BudgetCard } from './BudgetCard';

interface BudgetListProps {
  budgets: Array<{
    budget: Budget;
    spent: number;
    remaining: number;
    percentage: number;
    isOverBudget: boolean;
  }>;
  categories: Category[];
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

export const BudgetList = ({ budgets, categories, onEdit, onDelete }: BudgetListProps) => {
  const getCategoryDetails = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return {
      name: category?.name || 'Unknown',
      icon: category?.icon || '📝',
    };
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
      {budgets.map(({ budget, spent, remaining, percentage, isOverBudget }) => {
        const { name, icon } = getCategoryDetails(budget.categoryId);
        return (
          <BudgetCard
            key={budget.id}
            budget={budget}
            categoryName={name}
            categoryIcon={icon}
            spent={spent}
            remaining={remaining}
            percentage={percentage}
            isOverBudget={isOverBudget}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </Box>
  );
};

import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Transaction } from '../../transactions/types/Transaction';
import type { Category } from '../../categories/types/Category';
import { calculateCategoryTotals } from '../../../shared/utils/calculations';
import { formatCurrency } from '../../../shared/utils/formatters';
import { EmptyState } from '../../../shared/components/ui/EmptyState';
import PieChartIcon from '@mui/icons-material/PieChart';

interface CategoryBreakdownProps {
  transactions: Transaction[];
  categories: Category[];
}

export const CategoryBreakdown = ({ transactions, categories }: CategoryBreakdownProps) => {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const categoryTotals = calculateCategoryTotals(expenseTransactions);

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => {
      const category = categories.find((cat) => cat.name === name);
      return {
        name,
        value,
        color: category?.color || '#6366f1',
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  if (data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Spending by Category
          </Typography>
          <EmptyState
            icon={<PieChartIcon />}
            title="No expense data"
            description="Add some expenses to see category breakdown"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Spending by Category
        </Typography>
        <Box sx={{ height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => {
                  const pct = percent !== undefined ? percent : 0;
                  return `${name} ${(pct * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

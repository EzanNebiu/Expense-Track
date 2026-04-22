import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { MonthlyData } from '../types/MonthlyData';
import { formatCurrency, formatCompactCurrency } from '../../../shared/utils/formatters';
import { EmptyState } from '../../../shared/components/ui/EmptyState';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface SpendingTrendsProps {
  data: MonthlyData[];
}

export const SpendingTrends = ({ data }: SpendingTrendsProps) => {
  const hasData = data.some((d) => d.income > 0 || d.expenses > 0);

  if (!hasData) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Spending Trends
          </Typography>
          <EmptyState
            icon={<TrendingUpIcon />}
            title="No trend data"
            description="Add transactions to see spending trends over time"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Spending Trends
        </Typography>
        <Box sx={{ height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickFormatter={(value: string) => {
                  const parts = value.split(' ');
                  return parts[0].substring(0, 3);
                }}
              />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCompactCurrency} />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                labelStyle={{ color: '#000' }}
                contentStyle={{ backgroundColor: '#fff' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

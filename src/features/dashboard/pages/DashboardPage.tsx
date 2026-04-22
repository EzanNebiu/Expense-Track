import { Container, Grid, Alert } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon from '@mui/icons-material/Savings';
import { PageHeader } from '../../../shared/components/ui/PageHeader';
import { LoadingSpinner } from '../../../shared/components/ui/LoadingSpinner';
import { SummaryCard } from '../components/SummaryCard';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { SpendingTrends } from '../components/SpendingTrends';
import { RecentActivity } from '../components/RecentActivity';
import { useTransactions } from '../../transactions/hooks/useTransactions';
import { useCategories } from '../../categories/hooks/useCategories';
import { useDashboardData } from '../hooks/useDashboardData';
import { useMonthlyStats } from '../hooks/useMonthlyStats';
import { formatCurrency } from '../../../shared/utils/formatters';
import { getCurrentMonthRange } from '../../../shared/utils/dateUtils';

export const DashboardPage = () => {
  const { transactions, loading: transactionsLoading, error: transactionsError } = useTransactions();
  const { categories, loading: categoriesLoading } = useCategories();
  const dashboardData = useDashboardData(transactions);
  const monthlyStats = useMonthlyStats(transactions, 6);

  const currentMonthRange = getCurrentMonthRange();
  const currentMonthTransactions = transactions.filter(
    (t) => t.date >= currentMonthRange.start && t.date <= currentMonthRange.end
  );

  if (transactionsLoading || categoriesLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your financial health"
      />

      {transactionsError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {transactionsError}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Current Balance"
            value={formatCurrency(dashboardData.currentBalance)}
            icon={<AccountBalanceWalletIcon fontSize="large" />}
            color={dashboardData.currentBalance >= 0 ? 'primary' : 'error'}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Total Income"
            value={formatCurrency(dashboardData.totalIncome)}
            subtitle="This month"
            icon={<TrendingUpIcon fontSize="large" />}
            color="success"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Total Expenses"
            value={formatCurrency(dashboardData.totalExpenses)}
            subtitle="This month"
            icon={<TrendingDownIcon fontSize="large" />}
            color="error"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="Net Change"
            value={formatCurrency(Math.abs(dashboardData.netChange))}
            subtitle="vs last month"
            icon={<SavingsIcon fontSize="large" />}
            color={dashboardData.netChange >= 0 ? 'success' : 'warning'}
            trend={{
              value: dashboardData.netChangePercent,
              isPositive: dashboardData.netChangePercent >= 0,
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <SpendingTrends data={monthlyStats} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <CategoryBreakdown
            transactions={currentMonthTransactions}
            categories={categories}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <RecentActivity transactions={transactions} categories={categories} limit={8} />
        </Grid>
      </Grid>
    </Container>
  );
};


import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ROUTES } from '../../../routes/routes';

const mobileMenuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
  { label: 'Transactions', icon: <ReceiptIcon />, path: ROUTES.TRANSACTIONS },
  { label: 'Budgets', icon: <AccountBalanceWalletIcon />, path: ROUTES.BUDGETS },
  { label: 'More', icon: <MoreHorizIcon />, path: ROUTES.CATEGORIES },
];

export const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = mobileMenuItems.findIndex(item => {
    if (item.label === 'More') {
      return location.pathname === ROUTES.CATEGORIES || location.pathname === ROUTES.RECURRING;
    }
    return item.path === location.pathname;
  });

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        borderTop: 1,
        borderColor: 'divider',
      }}
      elevation={8}
    >
      <BottomNavigation
        value={currentIndex !== -1 ? currentIndex : false}
        onChange={(_, newValue) => {
          navigate(mobileMenuItems[newValue].path);
        }}
        showLabels
        sx={{
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px',
          },
        }}
      >
        {mobileMenuItems.map((item) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

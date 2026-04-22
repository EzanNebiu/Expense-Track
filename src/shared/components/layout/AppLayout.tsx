import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { useTheme } from '../../context/ThemeContext';

export const AppLayout = () => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleTheme } = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Navbar
        onMenuClick={handleDrawerToggle}
        themeMode={mode}
        onThemeToggle={toggleTheme}
      />
      
      <Box sx={{ display: 'flex', flex: 1, mt: 8 }}>
        {!isMobile && <Sidebar open variant="permanent" />}
        {isMobile && (
          <Sidebar open={mobileOpen} onClose={handleDrawerToggle} variant="temporary" />
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', md: `calc(100% - 240px)` },
          }}
        >
          <Box sx={{ flex: 1, p: 3, pb: isMobile ? 2 : 3 }}>
            <Outlet />
          </Box>
          <Footer />
        </Box>
      </Box>

      {isMobile && <MobileNav />}
    </Box>
  );
};

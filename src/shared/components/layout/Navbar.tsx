import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { APP_NAME } from '../../../config/constants';

interface NavbarProps {
  onMenuClick: () => void;
  themeMode?: 'light' | 'dark';
  onThemeToggle?: () => void;
}

export const Navbar = ({ onMenuClick, themeMode = 'light', onThemeToggle }: NavbarProps) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
          aria-label="Open menu"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ fontWeight: 600, flexGrow: { xs: 1, md: 0 } }}>
          {APP_NAME}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {onThemeToggle && (
          <IconButton onClick={onThemeToggle} color="inherit" aria-label="Toggle theme">
            {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        )}

        <IconButton 
          color="inherit" 
          sx={{ ml: 1, display: { xs: 'none', md: 'inline-flex' } }} 
          aria-label="Account"
        >
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

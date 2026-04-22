import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { ThemeProvider, useTheme } from './shared/context/ThemeContext';
import { lightTheme, darkTheme } from './config/theme';
import { AppRouter } from './routes/AppRouter';
import { ErrorBoundary } from './shared/components/ui/ErrorBoundary';

function AppContent() {
  const { mode } = useTheme();
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

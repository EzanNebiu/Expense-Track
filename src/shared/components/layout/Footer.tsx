import { useState, useEffect } from 'react';
import { Box, Container, Typography, IconButton, Fab, Link, useMediaQuery, useTheme } from '@mui/material';
import { GitHub, LinkedIn, Email, KeyboardArrowUp } from '@mui/icons-material';

const SOCIAL_LINKS = {
  github: 'https://github.com/EzanNebiu',
  linkedin: 'https://www.linkedin.com/in/ezan-nebiu-2b0966311 ',
  email: 'ezannebiu8@gmail.com',
};

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Budgets', href: '/budgets' },
  { label: 'Categories', href: '/categories' },
];

export const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Box
        component="footer"
        sx={{
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          py: isMobile ? 3 : 4,
          mt: isMobile ? 2 : 4,
          mb: isMobile ? 8 : 0,
        }}
      >
        <Container maxWidth="lg">
          {!isMobile ? (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 3 }}>
                <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Expense Tracker
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    A modern personal finance application to track your income and expenses.
                  </Typography>
                </Box>

                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Quick Links
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        underline="hover"
                        color="text.secondary"
                        sx={{
                          fontSize: '0.875rem',
                          '&:hover': { color: 'primary.main' },
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Connect
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      component="a"
                      href={`mailto:${SOCIAL_LINKS.email}`}
                      aria-label="Email"
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      <Email fontSize="small" />
                    </IconButton>
                    <IconButton
                      component="a"
                      href={SOCIAL_LINKS.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      <LinkedIn fontSize="small" />
                    </IconButton>
                    <IconButton
                      component="a"
                      href={SOCIAL_LINKS.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      <GitHub fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  pt: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                  © {currentYear} Expense Tracker. All rights reserved.
                </Typography>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                <IconButton
                  component="a"
                  href={`mailto:${SOCIAL_LINKS.email}`}
                  aria-label="Email"
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <Email fontSize="small" />
                </IconButton>
                <IconButton
                  component="a"
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <LinkedIn fontSize="small" />
                </IconButton>
                <IconButton
                  component="a"
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <GitHub fontSize="small" />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                © {currentYear} Expense Tracker
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {showScrollTop && (
        <Fab
          onClick={handleScrollTop}
          size="small"
          aria-label="Scroll to top"
          sx={{
            position: 'fixed',
            bottom: isMobile ? 80 : 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      )}
    </>
  );
};

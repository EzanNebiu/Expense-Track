import { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  IconButton,
  Collapse,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import type { TransactionFilters as ITransactionFilters } from '../types/TransactionFilters';
import type { Category } from '../../categories/types/Category';
import { useIsMobile } from '../../../shared/hooks/useMediaQuery';

interface TransactionFiltersProps {
  filters: ITransactionFilters;
  onFiltersChange: (filters: ITransactionFilters) => void;
  categories: Category[];
}

export const TransactionFilters = ({
  filters,
  onFiltersChange,
  categories,
}: TransactionFiltersProps) => {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);

  const handleTypeChange = (_: unknown, newType: string | null) => {
    if (newType !== null) {
      onFiltersChange({ ...filters, type: newType as 'income' | 'expense' | 'all' });
    }
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category: category || undefined });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, searchQuery: search || undefined });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy: sortBy as 'date' | 'amount' | 'category' });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      type: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.category ||
    filters.searchQuery ||
    filters.sortBy !== 'date';

  const filterContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <ToggleButtonGroup
          value={filters.type || 'all'}
          exclusive
          onChange={handleTypeChange}
          size="small"
          fullWidth={isMobile}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="income" color="success">
            Income
          </ToggleButton>
          <ToggleButton value="expense" color="error">
            Expense
          </ToggleButton>
        </ToggleButtonGroup>

        {hasActiveFilters && (
          <IconButton
            onClick={handleClearFilters}
            size="small"
            color="error"
            sx={{ ml: 'auto' }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <TextField
          label="Search"
          placeholder="Search transactions..."
          value={filters.searchQuery || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          size="small"
          fullWidth
        />

        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 180 } }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category || ''}
            label="Category"
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.name}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 } }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy || 'date'}
            label="Sort By"
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="amount">Amount</MenuItem>
            <MenuItem value="category">Category</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <IconButton onClick={() => setExpanded(!expanded)} size="small">
            <FilterListIcon />
          </IconButton>
          <TextField
            label="Search"
            placeholder="Quick search..."
            value={filters.searchQuery || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            size="small"
            fullWidth
          />
        </Box>
        <Collapse in={expanded}>
          <Paper sx={{ p: 2, mb: 2 }}>{filterContent}</Paper>
        </Collapse>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      {filterContent}
    </Paper>
  );
};

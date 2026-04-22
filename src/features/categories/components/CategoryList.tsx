import { Card, CardContent, Box, Typography, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Category } from '../types/Category';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export const CategoryList = ({ categories, onEdit, onDelete }: CategoryListProps) => {
  const getTypeLabel = (type: string) => {
    if (type === 'both') return 'Income & Expense';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getTypeColor = (type: string): 'success' | 'error' | 'primary' => {
    if (type === 'income') return 'success';
    if (type === 'expense') return 'error';
    return 'primary';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {categories.map((category) => (
        <Card key={category.id}>
          <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: category.color,
                  borderRadius: 2,
                  fontSize: '2rem',
                  flexShrink: 0,
                }}
              >
                {category.icon}
              </Box>

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  {category.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    label={getTypeLabel(category.type)}
                    size="small"
                    color={getTypeColor(category.type)}
                  />
                  {category.isDefault && (
                    <Chip label="Default" size="small" variant="outlined" />
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => onEdit(category)}
                  sx={{ color: 'primary.main' }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDelete(category)}
                  disabled={category.isDefault}
                  sx={{ color: category.isDefault ? 'action.disabled' : 'error.main' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

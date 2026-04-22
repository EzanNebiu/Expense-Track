import { Chip } from '@mui/material';

interface CategoryChipProps {
  name: string;
  icon: string;
  color: string;
  size?: 'small' | 'medium';
}

export const CategoryChip = ({ name, icon, color, size = 'medium' }: CategoryChipProps) => {
  return (
    <Chip
      label={
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>{icon}</span>
          <span>{name}</span>
        </span>
      }
      size={size}
      sx={{
        bgcolor: color,
        color: '#fff',
        fontWeight: 500,
        '& .MuiChip-label': {
          px: 1.5,
        },
      }}
    />
  );
};

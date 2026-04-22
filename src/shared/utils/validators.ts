export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true };
};

export const validateAmount = (amount: number): { valid: boolean; message?: string } => {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, message: 'Amount must be greater than 0' };
  }
  return { valid: true };
};

export const validateRequired = (value: string): { valid: boolean; message?: string } => {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: 'This field is required' };
  }
  return { valid: true };
};

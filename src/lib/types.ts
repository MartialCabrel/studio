export type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
};

export type Category = {
  id:string;
  name: string;
  icon: string; // Lucide icon name
};

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
};

export type Asset = {
  id: string;
  name: string;
  value: number;
  type: 'Investment' | 'Property' | 'Vehicle' | 'Other';
};

export type Liability = {
  id: string;
  name: string;
  balance: number;
  type: 'Loan' | 'Mortgage' | 'Credit Card' | 'Other';
};

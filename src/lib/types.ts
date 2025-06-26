export type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string; // Lucide icon name
};

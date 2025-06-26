import type { Category, Expense, Goal } from '@/lib/types';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Groceries', icon: 'ShoppingCart' },
  { id: 'cat-2', name: 'Dining Out', icon: 'UtensilsCrossed' },
  { id: 'cat-3', name: 'Transport', icon: 'Car' },
  { id: 'cat-4', name: 'Entertainment', icon: 'Film' },
  { id: 'cat-5', name: 'Utilities', icon: 'Lightbulb' },
  { id: 'cat-6', name: 'Housing', icon: 'Home' },
  { id: 'cat-7', name: 'Subscriptions', icon: 'Repeat' },
  { id: 'cat-8', name: 'Shopping', icon: 'ShoppingBag' },
  { id: 'cat-9', name: 'Health', icon: 'HeartPulse' },
  { id: 'cat-10', name: 'Travel', icon: 'Plane' },
];

export const expenses: Expense[] = [
  {
    id: 'exp-1',
    amount: 55.43,
    category: 'Groceries',
    date: new Date(2024, 6, 15).toISOString(),
    description: 'Weekly grocery shopping at corner store',
  },
  {
    id: 'exp-2',
    amount: 25.0,
    category: 'Dining Out',
    date: new Date(2024, 6, 14).toISOString(),
    description: 'Lunch with colleagues',
  },
  {
    id: 'exp-3',
    amount: 15.5,
    category: 'Transport',
    date: new Date(2024, 6, 14).toISOString(),
    description: 'Bus fare to work',
  },
  {
    id: 'exp-4',
    amount: 42.0,
    category: 'Entertainment',
    date: new Date(2024, 6, 13).toISOString(),
    description: 'Movie tickets for new blockbuster',
  },
  {
    id: 'exp-5',
    amount: 120.0,
    category: 'Utilities',
    date: new Date(2024, 6, 10).toISOString(),
    description: 'Electricity bill for July',
  },
  {
    id: 'exp-6',
    amount: 1200.0,
    category: 'Housing',
    date: new Date(2024, 6, 1).toISOString(),
    description: 'Monthly rent payment',
  },
  {
    id: 'exp-7',
    amount: 12.99,
    category: 'Subscriptions',
    date: new Date(2024, 6, 5).toISOString(),
    description: 'Streaming service subscription',
  },
  {
    id: 'exp-8',
    amount: 78.9,
    category: 'Groceries',
    date: new Date(2024, 6, 8).toISOString(),
    description: 'Restocking pantry',
  },
  {
    id: 'exp-9',
    amount: 45.3,
    category: 'Dining Out',
    date: new Date(2024, 6, 9).toISOString(),
    description: 'Dinner with friends at Italian restaurant',
  },
  {
    id: 'exp-10',
    amount: 250.75,
    category: 'Shopping',
    date: new Date(2024, 6, 11).toISOString(),
    description: 'New pair of shoes',
  },
  {
    id: 'exp-11',
    amount: 30.0,
    category: 'Health',
    date: new Date(2024, 6, 7).toISOString(),
    description: 'Pharmacy co-pay',
  },
];

export const goals: Goal[] = [
  { id: 'goal-1', name: 'Vacation to Hawaii', targetAmount: 5000, currentAmount: 1250 },
  { id: 'goal-2', name: 'New Laptop', targetAmount: 2000, currentAmount: 1800 },
  { id: 'goal-3', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 4000 },
];

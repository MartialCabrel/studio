import type {
  Expense as PrismaExpense,
  Category as PrismaCategory,
  Goal as PrismaGoal,
  Asset as PrismaAsset,
  Liability as PrismaLiability,
  NetWorthHistory as PrismaNetWorthHistory,
} from '@prisma/client';

export type Expense = Omit<PrismaExpense, 'categoryId'> & {
  category: string;
};

export type Category = PrismaCategory;

export type Goal = PrismaGoal;

export type Asset = PrismaAsset;

export type Liability = PrismaLiability;

export type NetWorthHistory = PrismaNetWorthHistory;

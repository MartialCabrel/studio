'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import type { Asset, Liability, Goal, Expense, Budget } from './types';
import { defaultCategories } from './data';
import { countries } from './countries';
import { subDays, isAfter } from 'date-fns';

// --- AUTH ACTIONS ---

export async function login(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect('/login?message=Could not authenticate user');
  }

  return redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const countryCode = formData.get('country') as string;
  const emailConsent = formData.get('emailConsent') === 'on';

  const selectedCountry = countries.find((c) => c.code === countryCode);
  const currency = selectedCountry ? selectedCountry.currency : 'USD';

  const {
    data: { user },
    error: signUpError,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        currency: currency,
        email_consent: emailConsent,
      },
    },
  });

  if (signUpError) {
    console.error(signUpError);
    return redirect('/signup');
  }

  if (user) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        currency: currency,
        emailConsent: emailConsent,
        categories: {
          create: defaultCategories.map((cat) => ({
            name: cat.name,
            icon: cat.icon,
          })),
        },
        savingsAccount: {
          create: {
            balance: 0,
          },
        },
      },
    });
  }

  return redirect('/dashboard');
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect('/login');
}

// --- DATA ACTIONS ---

async function getUser() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect('/login');
  }
  return data.user;
}

// Expenses
export async function addExpense(expense: Omit<Expense, 'id' | 'date'> & { date: Date }) {
  const user = await getUser();
  const { amount, category, date, description } = expense;

  const categoryRecord = await prisma.category.findFirst({
    where: { name: category, userId: user.id },
  });

  if (!categoryRecord) {
    throw new Error('Category not found');
  }

  await prisma.expense.create({
    data: {
      amount,
      description,
      date,
      userId: user.id,
      categoryId: categoryRecord.id,
    },
  });
  revalidatePath('/dashboard');
  revalidatePath('/budget');
}

// Goals
export async function addGoal(goal: Omit<Goal, 'id' | 'currentAmount'>) {
  const user = await getUser();
  await prisma.goal.create({
    data: { ...goal, userId: user.id },
  });
  revalidatePath('/goals');
}

// Assets
export async function addAsset(asset: Omit<Asset, 'id'>) {
  const user = await getUser();
  await prisma.asset.create({
    data: { ...asset, userId: user.id },
  });
  revalidatePath('/net-worth');
}

// Liabilities
export async function addLiability(liability: Omit<Liability, 'id'>) {
  const user = await getUser();
  await prisma.liability.create({
    data: { ...liability, userId: user.id },
  });
  revalidatePath('/net-worth');
}

// Categories
export async function addCategory(name: string, icon: string) {
  const user = await getUser();
  await prisma.category.create({
    data: { name, icon, userId: user.id },
  });
  revalidatePath('/settings');
}

export async function updateCategory(id: string, name: string) {
  const user = await getUser();
  await prisma.category.update({
    where: { id, userId: user.id },
    data: { name },
  });
  revalidatePath('/settings');
}

export async function deleteCategory(id: string) {
  const user = await getUser();
  await prisma.category.delete({
    where: { id, userId: user.id },
  });
  revalidatePath('/settings');
}

// Budget
export async function setBudget(budget: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  const user = await getUser();
  const { amount, period } = budget;

  const existingBudget = await prisma.budget.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  if (existingBudget) {
    const twentyFourHoursAgo = subDays(new Date(), 1);
    const canUpdate = isAfter(existingBudget.createdAt, twentyFourHoursAgo);

    if (canUpdate) {
      await prisma.budget.update({
        where: { id: existingBudget.id },
        data: { amount, period },
      });
      revalidatePath('/budget');
      return { success: true, message: 'Budget updated successfully.' };
    } else {
      // Logic to check if new budget can be created based on period end
      // For now, we'll throw an error to prevent creating a new one while another is "active"
      // This will be expanded later.
      throw new Error('Cannot update budget after 24 hours. Please wait for the current period to end.');
    }
  }

  // Create new budget if none exists
  await prisma.budget.create({
    data: {
      amount,
      period,
      userId: user.id,
    },
  });

  revalidatePath('/budget');
  return { success: true, message: 'Budget set successfully.' };
}

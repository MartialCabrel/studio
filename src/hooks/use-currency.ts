'use client';

import { useState, useEffect } from 'react';

const defaultCurrency = 'USD';

export function useCurrency() {
  const [currency, setCurrency] = useState<string>(defaultCurrency);

  useEffect(() => {
    try {
      const storedCurrency = localStorage.getItem('userCurrency');
      if (storedCurrency && typeof storedCurrency === 'string') {
        setCurrency(storedCurrency);
      }
    } catch (error) {
        console.warn("Could not access localStorage.", error);
        // Stick with the default currency if localStorage is not available
    }
  }, []);

  const formatCurrency = (amount: number) => {
    try {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    } catch(e) {
        // Fallback for invalid currency code
        console.warn(`Invalid currency code '${currency}'. Falling back to '${defaultCurrency}'.`);
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: defaultCurrency,
        }).format(amount);
    }
  };

  return { currency, formatCurrency };
}

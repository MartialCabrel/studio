'use client';

const defaultCurrency = 'USD';

export function useCurrency(currencyCode?: string | null) {
  const effectiveCurrency = currencyCode || defaultCurrency;

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: effectiveCurrency,
      }).format(amount);
    } catch (e) {
      // Fallback for invalid currency code
      console.warn(
        `Invalid currency code '${effectiveCurrency}'. Falling back to '${defaultCurrency}'.`
      );
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: defaultCurrency,
      }).format(amount);
    }
  };

  return { currency: effectiveCurrency, formatCurrency };
}

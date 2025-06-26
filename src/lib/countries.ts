export type Country = {
  code: string;
  name: string;
  currency: string;
};

export const countries: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'IN', name: 'India', currency: 'INR' },
];

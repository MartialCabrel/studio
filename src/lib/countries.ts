export type Country = {
  code: string;
  name: string;
  currency: string;
};

export const countries: Country[] = [
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'BR', name: 'Brazil', currency: 'BRL' },
  { code: 'CM', name: 'Cameroon', currency: 'XAF' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'EG', name: 'Egypt', currency: 'EGP' },
  { code: 'ET', name: 'Ethiopia', currency: 'ETB' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'GH', name: 'Ghana', currency: 'GHS' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'KE', name: 'Kenya', currency: 'KES' },
  { code: 'MA', name: 'Morocco', currency: 'MAD' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'US', name: 'United States', currency: 'USD' },
];

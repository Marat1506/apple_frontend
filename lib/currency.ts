export type Currency = 'USD' | 'EUR' | 'RUB' | 'AED';

export const CURRENCIES: Record<Currency, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  RUB: { symbol: '₽', rate: 92.5 },
  AED: { symbol: 'د.إ', rate: 3.67 },
};

export const formatPrice = (price: number, currency: Currency = 'USD'): string => {
  const { symbol, rate } = CURRENCIES[currency];
  const convertedPrice = price * rate;
  
  if (currency === 'RUB' || currency === 'AED') {
    return `${symbol}${Math.round(convertedPrice).toLocaleString()}`;
  }
  
  return `${symbol}${convertedPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const convertPrice = (price: number, currency: Currency = 'USD'): number => {
  return price * CURRENCIES[currency].rate;
};


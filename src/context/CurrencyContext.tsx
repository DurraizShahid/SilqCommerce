import React, { createContext, useContext, useMemo, useState } from "react";

type Currency = "USD" | "EUR" | "GBP";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amountUSD: number) => string;
  convert: (amountUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const rates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>("USD");

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      convert: (amountUSD) => amountUSD * rates[currency],
      formatPrice: (amountUSD) => {
        const converted = amountUSD * rates[currency];
        return new Intl.NumberFormat("en", {
          style: "currency",
          currency,
        }).format(converted);
      },
    }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};


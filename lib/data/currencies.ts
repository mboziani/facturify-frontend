export interface Currency {
    code: string;
    name: string;
    symbol: string;
    decimalPlaces: number;
    symbolPosition: 'before' | 'after';
}

export const CURRENCIES: Currency[] = [
    // North America
    { code: 'USD', name: 'US Dollar', symbol: '$', decimalPlaces: 2, symbolPosition: 'before' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimalPlaces: 2, symbolPosition: 'before' },
    { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', decimalPlaces: 2, symbolPosition: 'before' },

    // Latin America
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimalPlaces: 2, symbolPosition: 'before' },
    { code: 'ARS', name: 'Argentine Peso', symbol: 'AR$', decimalPlaces: 2, symbolPosition: 'before' },
    { code: 'COP', name: 'Colombian Peso', symbol: 'CO$', decimalPlaces: 2, symbolPosition: 'before' },
    { code: 'CLP', name: 'Chilean Peso', symbol: 'CL$', decimalPlaces: 0, symbolPosition: 'before' },
    { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', decimalPlaces: 2, symbolPosition: 'before' },
    { code: 'VES', name: 'Venezuelan Bolivar', symbol: 'Bs.', decimalPlaces: 2, symbolPosition: 'before' },
    { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', decimalPlaces: 2, symbolPosition: 'before' },
    { code: 'PYG', name: 'Paraguayan Guarani', symbol: '₲', decimalPlaces: 0, symbolPosition: 'before' },
    { code: 'CRC', name: 'Costa Rican Colon', symbol: '₡', decimalPlaces: 2, symbolPosition: 'before' },

    // Europe
    { code: 'EUR', name: 'Euro', symbol: '€', decimalPlaces: 2, symbolPosition: 'before' },
    { code: 'GBP', name: 'British Pound', symbol: '£', decimalPlaces: 2, symbolPosition: 'before' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimalPlaces: 2, symbolPosition: 'before' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimalPlaces: 2, symbolPosition: 'after' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', decimalPlaces: 2, symbolPosition: 'after' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr', decimalPlaces: 2, symbolPosition: 'after' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', decimalPlaces: 2, symbolPosition: 'after' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', decimalPlaces: 2, symbolPosition: 'after' },

    // MENA
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', decimalPlaces: 2, symbolPosition: 'after' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', decimalPlaces: 2, symbolPosition: 'after' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: '£', decimalPlaces: 2, symbolPosition: 'before' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.', decimalPlaces: 2, symbolPosition: 'after' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت', decimalPlaces: 3, symbolPosition: 'after' },
    { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج', decimalPlaces: 2, symbolPosition: 'after' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼', decimalPlaces: 2, symbolPosition: 'after' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', decimalPlaces: 3, symbolPosition: 'after' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', decimalPlaces: 3, symbolPosition: 'before' },
    { code: 'OMR', name: 'Omani Rial', symbol: '﷼', decimalPlaces: 3, symbolPosition: 'after' },
    { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا', decimalPlaces: 3, symbolPosition: 'after' },
    { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل', decimalPlaces: 2, symbolPosition: 'after' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺', decimalPlaces: 2, symbolPosition: 'before' },
];

// Helper function to get currency by code
export const getCurrencyByCode = (code: string): Currency | undefined => {
    return CURRENCIES.find(c => c.code === code);
};

// Helper function to format amount with currency
export const formatCurrency = (amount: number, currencyCode: string): string => {
    const currency = getCurrencyByCode(currencyCode);
    if (!currency) return `${amount}`;

    const formatted = amount.toFixed(currency.decimalPlaces);

    if (currency.symbolPosition === 'before') {
        return `${currency.symbol}${formatted}`;
    } else {
        return `${formatted} ${currency.symbol}`;
    }
};

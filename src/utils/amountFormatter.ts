export interface FormatAmountOptions {
    currency?: string;
    locale?: string;
    fraction?: number;
    hide?: boolean;
}

export const formatAmount = (
    amount: number | string | null | undefined,
    options: FormatAmountOptions = {},
): string => {
    const {
        currency = "TON",
        locale = "de-CH",
        fraction = 2,
        hide = false,
    } = options;

    if (amount == null || amount === 0) return "-";

    if (typeof amount === "string") {
        amount = parseFloat(amount);
    }

    const formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: fraction,
    });

    const formattedAmount = formatter
        .format(amount)
        .replace(/’/g, " ");

    if (hide) {
        return formattedAmount;
    }

    return `${formattedAmount} ${currency}`;
};

export const formatAmountRange = (
    minAmount: number | string | null | undefined,
    maxAmount: number | string | null | undefined,
    options: FormatAmountOptions = {},
    separator: string = " - ",
): string => {
    const {
        currency = "TON",
        locale = "de-CH",
        fraction = 2,
        hide = false,
    } = options;

    if (minAmount == null || maxAmount == null) return "-";

    if (typeof minAmount === "string") {
        minAmount = parseFloat(minAmount);
    }

    if (typeof maxAmount === "string") {
        maxAmount = parseFloat(maxAmount);
    }

    const formatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: fraction,
    });

    const formattedMin = formatter.format(minAmount).replace(/’/g, " ");
    const formattedMax = formatter.format(maxAmount).replace(/’/g, " ");

    const amountRange = `${formattedMin}${separator}${formattedMax}`;

    if (hide) {
        return amountRange;
    }

    return `${amountRange} ${currency}`;
};

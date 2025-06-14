export interface FormatAmountOptions {
  currency?: string
  locale?: string
  fraction?: number
  hide?: boolean
}

export const formatAmount = (
  amount: number | string | null | undefined,
  options?: FormatAmountOptions,
): string => {
  if (amount == null || amount === "") return "-"

  if (!options) {
    return String(amount)
  }

  const {
    currency = "TON",
    locale = "de-CH",
    fraction = 2,
    hide = false,
  } = options

  const num = typeof amount === "string" ? parseFloat(amount) : amount

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fraction,
  })

  const formatted = formatter.format(num).replace(/’/g, " ")

  return hide ? formatted : `${formatted} ${currency}`
}

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
  } = options

  if (minAmount == null || maxAmount == null) return "-"

  if (typeof minAmount === "string") {
    minAmount = parseFloat(minAmount)
  }

  if (typeof maxAmount === "string") {
    maxAmount = parseFloat(maxAmount)
  }

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fraction,
  })

  const formattedMin = formatter.format(minAmount).replace(/’/g, " ")
  const formattedMax = formatter.format(maxAmount).replace(/’/g, " ")

  const amountRange = `${formattedMin}${separator}${formattedMax}`

  if (hide) {
    return amountRange
  }

  return `${amountRange} ${currency}`
}

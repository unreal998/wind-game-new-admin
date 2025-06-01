// Tremor cx [v0.0.0]

import { formatAmount, formatAmountRange } from "@/utils/amountFormatter";
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

// Tremor focusInput [v0.0.1]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-indigo-200 focus:dark:ring-indigo-700/30",
  // border color
  "focus:!border-indigo-500 focus:dark:!border-indigo-700",
  // disabled & readonly focus styles
  // "disabled:focus:ring-gray-200 disabled:focus:dark:ring-gray-800/30",
  // "disabled:focus:border-gray-300 disabled:focus:dark:border-gray-800",
  "read-only:focus:!ring-transparent read-only:focus:dark:!ring-transparent",
  "read-only:focus:!border-gray-300 read-only:focus:dark:!border-gray-800",
];

// Tremor focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-indigo-500 dark:outline-indigo-500",
];

// Tremor hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "!border-red-500 dark:!border-red-700",
  // ring color
  "!ring-red-200 dark:!ring-red-700/30",
];

// Formatter functions

export const numberFormatter = (number: number, decimals = 0) =>
  Intl.NumberFormat("us", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
    .format(Number(number))
    .toString();

export const percentageFormatter = (number: number, decimals = 1) => {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
  const symbol = number > 0 && number !== Infinity ? "+" : "";

  return `${symbol}${formattedNumber}`;
};

export const millionFormatter = (number: number, decimals = 1) => {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
  return `${formattedNumber}M`;
};

export const formatters: { [key: string]: any } = {
  unit: numberFormatter,
  percentage: percentageFormatter,
  million: millionFormatter,
  currency: formatAmount,
  currencyRange: formatAmountRange,
};

import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

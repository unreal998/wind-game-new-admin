import { Check, Copy, Eye, EyeOff, Search } from "lucide-react"
import React, { useState, ReactNode } from "react"
import { PhoneInput } from "react-international-phone"
import "react-international-phone/style.css"
import { tv, type VariantProps } from "tailwind-variants"

import { cx, focusInput, focusRing, hasErrorInput } from "@/lib/utils"

const inputStyles = tv({
  base: [
    // base
    "relative block w-full appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm",
    // border color
    "border-gray-300 dark:border-gray-800",
    // text color
    "text-gray-900 dark:text-gray-50",
    // placeholder color
    "placeholder-gray-400 dark:placeholder-gray-500",
    // background color
    "bg-white dark:bg-gray-950",
    // disabled & readonly
    "disabled:opacity-100 disabled:cursor-default disabled:bg-transparent read-only:opacity-100 read-only:cursor-default read-only:bg-transparent",
    "disabled:hover:bg-transparent disabled:dark:hover:bg-transparent read-only:hover:bg-transparent read-only:dark:hover:bg-transparent",
    "disabled:border-gray-300 disabled:dark:border-gray-800 read-only:border-gray-300 read-only:dark:border-gray-800",
    "disabled:text-gray-900 disabled:dark:text-gray-50 read-only:text-gray-900 read-only:dark:text-gray-50",
    // focus
    focusInput,
    // invalid (optional)
    "aria-[invalid=true]:dark:ring-red-400/20 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-200 aria-[invalid=true]:border-red-500 invalid:ring-2 invalid:ring-red-200 invalid:border-red-500",
    // file
    [
      "file:-my-2 file:-ml-2.5 file:cursor-pointer file:rounded-l-[5px] file:rounded-r-none file:border-0 file:px-3 file:py-2 file:outline-none focus:outline-none disabled:pointer-events-none file:disabled:pointer-events-none",
      "file:border-solid file:border-gray-300 file:bg-gray-50 file:text-gray-500 file:hover:bg-gray-100 file:dark:border-gray-800 file:dark:bg-gray-950 file:hover:dark:bg-gray-900/20 file:disabled:dark:border-gray-700",
      "file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem]",
      "file:disabled:bg-gray-100 file:disabled:text-gray-500 file:disabled:dark:bg-gray-800",
    ],
  ],
  variants: {
    hasError: {
      true: hasErrorInput,
    },
    // number input
    enableStepper: {
      false:
        "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
    },
  },
})

const localeToCountryIso2: { [key: string]: string } = {
  ar: "sa",
  bn: "bd",
  cs: "cz",
  de: "de",
  en: "gb",
  es: "es",
  fi: "fi",
  fr: "fr",
  hi: "in",
  hu: "hu",
  id: "id",
  it: "it",
  pl: "pl",
  pt: "pt",
  ro: "ro",
  ru: "ru",
  th: "th",
  tr: "tr",
  uk: "ua",
  zh: "cx",
}

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputStyles> {
  inputClassName?: string
  copySuccessMessage?: string
  // onPhoneChange?: (phone: string, data: any) => void
  icon?: ReactNode 
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputClassName,
      hasError,
      enableStepper = true,
      type,
      copySuccessMessage,
      // onPhoneChange,
      icon,
      ...props
    }: InputProps,
    forwardedRef,
    ) => {
    const locale = 'uk'

    const [typeState, setTypeState] = React.useState(type)
    const [isCopied, setIsCopied] = useState(false)

    const isPassword = type === "password"
    const isSearch = type === "search"
    const isCopy = type === "copy"
    const isPhone = type === "phone"

    const handleCopy = () => {
      if (props.value) {
        navigator.clipboard.writeText(props.value.toString())
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 1000)
      }
    }

    if (isPhone) {
      return (
        <PhoneInput
          {...props}
          defaultCountry={locale ? localeToCountryIso2[locale] || "au" : "au"}
          disableFormatting={true}
          // prefix=""
          // disableDialCodePrefill={true}
          // disableDialCodeAndPrefix={true}
          // showDisabledDialCodeAndPrefix={true}
          value={props.value as string}
          onChange={(phone) => {
            // onPhoneChange?.(phone, data)
            props.onChange?.(
              { target: { value: phone } } as React.ChangeEvent<HTMLInputElement>
            )
          }}
          className={cx("relative", className)}
          dialCodePreviewStyleProps={{
            className: "dark:!text-gray-50 dark:!bg-gray-950 dark:!border-gray-800 !border-l-0 !h-[42px] sm:!h-[38px] sm:!text-sm",
          }}
          inputClassName={cx(
            "dark:!text-gray-50 dark:!bg-gray-950 dark:!border-gray-800 transition !h-[42px] sm:!h-[38px] !rounded-r-md !text-base sm:!text-sm",
            inputClassName,
            inputStyles({ hasError }),
          )}
          countrySelectorStyleProps={{
            className: "!static",
            buttonClassName: "dark:!text-gray-50 dark:!bg-gray-950 dark:!border-gray-800 !h-[42px] sm:!h-[38px] !rounded-l-md",
            dropdownStyleProps: {
              className: "!w-full !shadow-xl rounded-md border border-gray-200 dark:!text-gray-50 dark:!bg-gray-950 dark:!border-gray-800",
              listItemClassName: "transition-colors dark:!text-gray-50 dark:!bg-gray-950 dark:!border-gray-800 hover:dark:!bg-gray-900",
            }
          }}
        />
      )
    }

    return (
      <div className={cx("relative w-full", className)} tremor-id="tremor-raw">
        <input
          ref={forwardedRef}
          type={isPassword ? typeState : isCopy ? "text" : type}
          className={cx(
            {
              "!pl-8": isSearch || icon, // Додаємо відступ зліва, якщо є іконка
              "!pr-10": isPassword || isCopy,
            },
            inputClassName,
            inputStyles({ hasError, enableStepper })
          )}
          readOnly={isCopy}
          {...props}
        />
        {icon && ( // Додаємо відображення користувацької іконки
          <div
            className={cx(
              "pointer-events-none absolute bottom-0 left-2 flex h-full items-center justify-center",
              "text-gray-400 dark:text-gray-600",
            )}
          >
            {icon}
          </div>
        )}
        {isSearch && !icon && ( // Показуємо іконку пошуку, тільки якщо не встановлена користувацька іконка
          <div
            className={cx(
              "pointer-events-none absolute bottom-0 left-2 flex h-full items-center justify-center",
              "text-gray-400 dark:text-gray-600",
            )}
          >
            <Search className="size-[1.125rem] shrink-0" aria-hidden="true" />
          </div>
        )}
        {isPassword && (
          <div
            className={cx(
              "absolute bottom-0 right-0 flex h-full items-center justify-center px-3",
            )}
          >
            <button
              aria-label="Change password visibility"
              className={cx(
                "h-fit w-fit rounded-sm outline-none transition-all",
                "text-gray-400 dark:text-gray-600",
                "hover:text-gray-500 hover:dark:text-gray-500",
                focusRing,
              )}
              type="button"
              onClick={() => {
                setTypeState(typeState === "password" ? "text" : "password")
              }}
            >
              <span className="sr-only">
                {typeState === "password" ? "Show password" : "Hide password"}
              </span>
              {typeState === "password" ? (
                <Eye aria-hidden="true" className="size-5 shrink-0" />
              ) : (
                <EyeOff aria-hidden="true" className="size-5 shrink-0" />
              )}
            </button>
          </div>
        )}
        {isCopy && (
          <div
            className={cx(
              "absolute bottom-0 right-0 flex h-full items-center justify-center px-3",
            )}
          >
            <button
              aria-label="Copy to clipboard"
              className={cx(
                "h-fit w-fit rounded-sm outline-none transition-all",
                "text-gray-400 dark:text-gray-600",
                "hover:text-gray-500 hover:dark:text-gray-500",
                focusRing,
              )}
              type="button"
              onClick={handleCopy}
            >
              <span className="sr-only">
                {isCopied ? "Copied" : "Copy to clipboard"}
              </span>
              {isCopied ? (
                <Check
                  aria-hidden="true"
                  className="size-5 shrink-0 text-green-500"
                />
              ) : (
                <Copy aria-hidden="true" className="size-5 shrink-0" />
              )}
            </button>
          </div>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"

export { Input, inputStyles, type InputProps }

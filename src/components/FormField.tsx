import React, { useEffect } from "react"
import { Controller, FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { RiErrorWarningLine } from "@remixicon/react"

interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  type?: string;
  placeholder: string;
  min?: number;
  max?: number;
  step?: number;
  form: UseFormReturn<T>;
  error?: string;
  defaultValue?: any;
  disabled?: boolean;
  className?: string;
  // onPhoneChange?: (value: string, country: any) => void;
  // onBlur?: () => void;
}

export function FormField<T extends FieldValues>({ 
  name, 
  label, 
  type = "text", 
  placeholder, 
  min,
  max,
  step = 1,
  form,
  error,
  defaultValue,
  disabled,
  className,
  // onPhoneChange,
  // onBlur,
}: FormFieldProps<T>) {
  const { control, formState: { touchedFields }, trigger } = form;

  useEffect(() => {
    if (touchedFields[name as keyof typeof touchedFields]) {
      trigger(name);
    }
  }, [touchedFields, name, trigger]);

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor={name} className="font-medium">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field, fieldState: { error: fieldError, isTouched } }) => {
          // if (type === 'phone') {
            // console.log('⚪️ Field state:', { 
            //   name: field.name,
            //   value: field.value,
            //   isTouched,
            //   error: error,
            //   fieldError: fieldError,
            //   fieldState: field,
            //   formState: form.formState
            // })
          // }
          
          // const handlePhoneChange = (phone: string, data: any) => {
          //   console.log('🟡 Phone change:', { phone, data })
            
          //   const input = document.createElement('input')
          //   input.value = phone
          //   const event = new Event('input', { bubbles: true })
          //   Object.defineProperty(event, 'target', { value: input })
            
          //   field.onChange(event)
            
          //   form.setValue(name, phone as PathValue<T, typeof name>, {
          //     shouldValidate: true,
          //     shouldDirty: true,
          //     shouldTouch: true
          //   })
            
          //   onPhoneChange?.(phone, data)
          // }
          
          return (
            <div>
              <Input
                {...field}
                type={type}
                id={name}
                placeholder={placeholder}
                className={className}
                hasError={!!fieldError || !!error}
                value={field.value ?? ''}
                min={type === "number" ? min : undefined}
                max={type === "number" ? max : undefined}
                step={step}
                disabled={disabled}
                // onPhoneChange={handlePhoneChange}
                // onBlur={() => {
                //   console.log('🟥 Blur:', { name: field.name, value: field.value })
                //   field.onBlur()  
                //   // if (type === 'phone') {
                //   //   form.setValue(name, field.value as PathValue<T, typeof name>, {
                //   //     shouldValidate: true,
                //   //     shouldDirty: true,
                //   //     shouldTouch: true
                //   //   })
                //   // }
                //   // onBlur && onBlur()
                // }}
                // onChange={(e) => {
                //   console.log('🟪 Change:', { name: field.name, value: field.value })
                //   field.onChange(e)
                //   if (isTouched) {
                //     trigger(name)
                //   }
                // }}
              />
              {(fieldError || error) && isTouched && (
                <p className="mt-1 text-xs text-red-700 flex items-start">
                  <RiErrorWarningLine className="mr-1 flex-shrink-0 mt-0.5 w-3 h-3" />
                  <span>{fieldError?.message as string || error || ''}</span>
                </p>
              )}
            </div>
          )
        }}
      />
    </div>
  );
}
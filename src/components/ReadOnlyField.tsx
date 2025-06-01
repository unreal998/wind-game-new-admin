import React from "react";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";

interface ReadOnlyFieldProps {
  label: string;
  value: string | null;
}

export function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div className="flex flex-col space-y-2">
      <Label className="font-medium">{label}</Label>
      <Input value={value ?? ''} readOnly />
    </div>
  );
}
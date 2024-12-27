import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConfigSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  className?: string;
}

const ConfigSelect = ({ label, value, onValueChange, placeholder, options, className }: ConfigSelectProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-white">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={`bg-transparent border-b-2 border-white/50 rounded-none text-white ${className}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ConfigSelect;
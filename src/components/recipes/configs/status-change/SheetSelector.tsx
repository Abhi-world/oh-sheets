import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';

interface SheetSelectorProps {
  selectedSheet: string;
  onSheetSelect: (sheetId: string) => void;
  className?: string;
}

const SheetSelector = ({ selectedSheet, onSheetSelect, className }: SheetSelectorProps) => {
  const { sheets, isLoading } = useGoogleSheets();

  return (
    <Select value={selectedSheet} onValueChange={onSheetSelect}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={isLoading ? "Loading..." : "select sheet"} />
      </SelectTrigger>
      <SelectContent className="bg-navy-dark border-none">
        {sheets.map((s) => (
          <SelectItem 
            key={s.id} 
            value={s.id} 
            className="text-white hover:bg-white/10"
          >
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SheetSelector;
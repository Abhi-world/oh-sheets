import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';

interface SpreadsheetSelectorProps {
  selectedSpreadsheet: string;
  onSpreadsheetSelect: (spreadsheetId: string) => void;
}

const SpreadsheetSelector = ({ selectedSpreadsheet, onSpreadsheetSelect }: SpreadsheetSelectorProps) => {
  const { spreadsheets, isLoading, fetchSpreadsheets } = useGoogleSheets();

  return (
    <Select value={selectedSpreadsheet} onValueChange={onSpreadsheetSelect}>
      <SelectTrigger 
        className="w-[180px] inline-flex bg-navy-light border-none text-white focus:ring-white/20"
        onClick={() => fetchSpreadsheets()}
      >
        <SelectValue placeholder={isLoading ? "Loading..." : "Select spreadsheet"} />
      </SelectTrigger>
      <SelectContent className="bg-navy-light border-none">
        {spreadsheets.map((s) => (
          <SelectItem key={s.id} value={s.id} className="text-white hover:bg-white/10">
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SpreadsheetSelector;
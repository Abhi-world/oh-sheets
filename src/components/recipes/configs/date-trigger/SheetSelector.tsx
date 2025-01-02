import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SheetSelectorProps {
  spreadsheets: Array<{ id: string; name: string }>;
  sheets: Array<{ id: string; name: string }>;
  selectedSpreadsheet: string;
  selectedSheet: string;
  onSpreadsheetSelect: (id: string) => void;
  onSheetSelect: (id: string) => void;
}

const SheetSelector = ({
  spreadsheets,
  sheets,
  selectedSpreadsheet,
  selectedSheet,
  onSpreadsheetSelect,
  onSheetSelect
}: SheetSelectorProps) => {
  return (
    <span className="inline-flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <button className="text-white underline decoration-dotted hover:decoration-solid">
            {selectedSpreadsheet ? spreadsheets.find(s => s.id === selectedSpreadsheet)?.name : 'spreadsheet'}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] bg-[#1F2937] border-none text-white">
          <div className="p-2">
            <Input
              placeholder="Search spreadsheets..."
              className="mb-2 bg-transparent border-white/20"
            />
            {spreadsheets.map(sheet => (
              <Button
                key={sheet.id}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10"
                onClick={() => onSpreadsheetSelect(sheet.id)}
              >
                {sheet.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {' / '}
      <Popover>
        <PopoverTrigger asChild>
          <button className="text-white underline decoration-dotted hover:decoration-solid">
            {selectedSheet ? sheets.find(s => s.id === selectedSheet)?.name : 'sheet'}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] bg-[#1F2937] border-none text-white">
          <div className="p-2">
            <Input
              placeholder="Search sheets..."
              className="mb-2 bg-transparent border-white/20"
            />
            {sheets.map(sheet => (
              <Button
                key={sheet.id}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-white/10"
                onClick={() => onSheetSelect(sheet.id)}
              >
                {sheet.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </span>
  );
};

export default SheetSelector;
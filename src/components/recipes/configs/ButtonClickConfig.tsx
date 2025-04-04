import React, { useState } from 'react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { useGoogleSheetsStatus } from '@/hooks/useGoogleSheetsStatus';
import BoardSelector from './status-change/BoardSelector';
import ValueSelector from '@/components/shared/ValueSelector';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus } from 'lucide-react';
import ColumnCenterModal from './button-click/ColumnCenterModal';
import SheetSelector from '@/components/shared/SheetSelector';

const ButtonClickConfig = () => {
  const [buttonName, setButtonName] = useState('');
  const [values, setValues] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [isColumnCenterOpen, setIsColumnCenterOpen] = useState(false);
  const { isConnected } = useGoogleSheetsStatus();
  const {
    spreadsheets,
    sheets,
    selectedSpreadsheet,
    selectedSheet,
    setSelectedSpreadsheet,
    setSelectedSheet,
  } = useGoogleSheets();

  const handleColumnSelect = (columnType: string) => {
    setButtonName('New Button');
    setIsColumnCenterOpen(false);
  };

  return (
    <div className="space-y-12">
      <div className="bg-navy-dark/40 p-6 rounded-lg border border-google-green/20">
        <p className="text-2xl leading-relaxed text-white">
          When{' '}
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-2xl text-white underline decoration-dotted hover:decoration-solid">
                {buttonName || 'button'}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] bg-navy-dark border-none p-2">
              <div className="space-y-2">
                <div className="px-2 py-1.5 text-white/70 text-2xl">Select a column</div>
                <button
                  className="w-full flex items-center gap-2 text-left px-2 py-1.5 text-2xl text-white hover:bg-white/10 rounded"
                  onClick={() => setIsColumnCenterOpen(true)}
                >
                  <Plus className="h-5 w-5" />
                  Add a new column
                </button>
              </div>
            </PopoverContent>
          </Popover>
          {' '}is clicked in{' '}
          <span className="inline-block">
            <button 
              onClick={() => setIsColumnCenterOpen(true)}
              className="text-2xl text-white underline decoration-dotted hover:decoration-solid"
            >
              {selectedBoard ? 'board' : 'board'}
            </button>
          </span>
          {', '}add a row in{' '}
          <SheetSelector
            items={spreadsheets}
            selectedId={selectedSpreadsheet}
            onSelect={setSelectedSpreadsheet}
            placeholder="spreadsheet"
            className="text-2xl"
          />
          {' / '}
          <SheetSelector
            items={sheets}
            selectedId={selectedSheet}
            onSelect={setSelectedSheet}
            placeholder="sheet"
            className="text-2xl"
          />
          {' '}with these{' '}
          <div className="inline-block w-[120px]">
            <ValueSelector
              value={values}
              onChange={setValues}
              placeholder="values"
              className="text-2xl text-white underline decoration-dotted hover:decoration-solid"
            />
          </div>
        </p>
      </div>

      <ColumnCenterModal
        isOpen={isColumnCenterOpen}
        onClose={() => setIsColumnCenterOpen(false)}
        onSelect={handleColumnSelect}
      />
    </div>
  );
};

export default ButtonClickConfig;
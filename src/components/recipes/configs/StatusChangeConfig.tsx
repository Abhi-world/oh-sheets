import React, { useState, useEffect } from 'react';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import ValueSelector from '@/components/shared/ValueSelector';
import { getMondayApiKey } from '@/utils/monday';
import { toast } from 'sonner';
import BoardSelector from './status-change/BoardSelector';
import SpreadsheetSelector from './status-change/SpreadsheetSelector';
import SheetSelector from './status-change/SheetSelector';
import { Info } from 'lucide-react';

const StatusChangeConfig = () => {
  const [values, setValues] = useState('');
  const [columns, setColumns] = useState<any[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>('status');
  const [selectedBoard, setSelectedBoard] = useState('');
  
  const {
    spreadsheets,
    sheets,
    selectedSpreadsheet,
    selectedSheet,
    setSelectedSpreadsheet,
    setSelectedSheet,
    isLoading,
    fetchSpreadsheets
  } = useGoogleSheets();

  useEffect(() => {
    // Mock columns for testing with required 'type' property
    const mockColumns = [
      { id: 'status', title: 'Status', type: 'status' },
      { id: 'priority', title: 'Priority', type: 'color' },
      { id: 'text', title: 'Text', type: 'text' },
      { id: 'person', title: 'Person', type: 'person' },
      { id: 'date', title: 'Date', type: 'date' },
      { id: 'numbers', title: 'Numbers', type: 'number' },
      { id: 'dropdown', title: 'Dropdown', type: 'dropdown' }
    ];
    setColumns(mockColumns);
  }, [selectedBoard]);

  // Find the selected column's title
  const selectedColumnTitle = columns.find(col => col.id === selectedColumn)?.title || selectedColumn;

  return (
    <div className="space-y-12">
      <div className="bg-navy-dark/40 p-6 rounded-lg border border-google-green/20">
        <p className="text-xl leading-relaxed text-white">
          When <strong className="text-google-green">Status</strong> changes in{' '}
          <BoardSelector
            selectedBoard={selectedBoard}
            onBoardSelect={setSelectedBoard}
            className="min-w-[180px] bg-[#1F2937] border-none text-white"
          />
          {' / '}
          <SpreadsheetSelector
            selectedSpreadsheet={selectedSpreadsheet}
            onSpreadsheetSelect={setSelectedSpreadsheet}
          />
          {' / '}
          <SheetSelector
            selectedSheet={selectedSheet}
            onSheetSelect={setSelectedSheet}
          />
        </p>

        {/* Information box */}
        <div className="mt-6 bg-navy-light/30 p-4 rounded-lg border border-google-green/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-google-green mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-white/90">
                This automation will trigger whenever <strong>Status</strong> changes to <strong>any value</strong> in Monday.com, not just the predefined ones.
              </p>
              <p className="text-white/80 text-sm">
                The values shown above are common examples, but you can add custom values or leave them empty. The automation will still work with any value change in the selected column.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeConfig;
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { useGoogleSheetsStatus } from '@/hooks/useGoogleSheetsStatus';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { ConfigComponentProps } from '@/types/recipe';

const PeriodicExportConfig = ({ onConfigValid }: ConfigComponentProps) => {
  const [interval, setInterval] = useState('');
  const [exportTime, setExportTime] = useState('09:00');
  const { isConnected } = useGoogleSheetsStatus();
  const {
    spreadsheets,
    sheets,
    selectedSpreadsheet,
    selectedSheet,
    setSelectedSpreadsheet,
    setSelectedSheet,
    fetchSpreadsheets,
  } = useGoogleSheets();

  useEffect(() => {
    fetchSpreadsheets();
  }, [fetchSpreadsheets]);

  useEffect(() => {
    // Check if all required fields are filled
    const isValid = Boolean(interval && selectedSpreadsheet && selectedSheet);
    onConfigValid?.(isValid);
  }, [interval, selectedSpreadsheet, selectedSheet, onConfigValid]);

  return (
    <div className="space-y-8">
      {/* Main configuration sentence */}
      <p className="text-xl leading-relaxed text-white">
        Every{' '}
        <Select value={interval} onValueChange={setInterval}>
          <SelectTrigger className="w-32 inline-flex bg-transparent border-google-green focus:ring-google-green/50">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="bg-navy-light border border-google-green">
            <SelectItem value="hourly" className="text-white">Hour</SelectItem>
            <SelectItem value="daily" className="text-white">Day</SelectItem>
            <SelectItem value="weekly" className="text-white">Week</SelectItem>
            <SelectItem value="monthly" className="text-white">Month</SelectItem>
          </SelectContent>
        </Select>
        , add a row in{' '}
        <Select value={selectedSpreadsheet} onValueChange={setSelectedSpreadsheet}>
          <SelectTrigger className="w-40 inline-flex bg-transparent border-google-green focus:ring-google-green/50">
            <SelectValue placeholder="Select spreadsheet" />
          </SelectTrigger>
          <SelectContent className="bg-navy-light border border-google-green">
            {spreadsheets.map((s) => (
              <SelectItem key={s.id} value={s.id} className="text-white">
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {' / '}
        <Select value={selectedSheet} onValueChange={setSelectedSheet}>
          <SelectTrigger className="w-32 inline-flex bg-transparent border-google-green focus:ring-google-green/50">
            <SelectValue placeholder="Select sheet" />
          </SelectTrigger>
          <SelectContent className="bg-navy-light border border-google-green">
            {sheets.map((s) => (
              <SelectItem key={s.id} value={s.id} className="text-white">
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </p>

      {/* Export Schedule Settings - directly beneath without a card */}
      <div className="space-y-4 pl-6">
        <div className="flex items-center gap-2 text-white">
          <Clock className="w-5 h-5" />
          <h3 className="text-lg font-medium">Export Schedule Settings</h3>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white">Export Time</Label>
          <Input
            type="time"
            value={exportTime}
            onChange={(e) => setExportTime(e.target.value)}
            className="bg-transparent border-google-green focus:ring-google-green/50 text-white max-w-[200px]"
          />
          <p className="text-sm text-white/60">
            Set the time when the export should run each {interval || 'period'}
          </p>
        </div>
      </div>

      {/* How it works section */}
      <div className="mt-8 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white">?</span>
          </div>
          <h3 className="text-lg font-medium text-white">How does this automation work?</h3>
        </div>
        <p className="text-white/80 leading-relaxed pl-8">
          This automation will export data from your Monday.com board to Google Sheets 
          at the specified interval and time. It will automatically create a new row 
          in your chosen Google Sheet with the latest data from your board.
        </p>
      </div>
    </div>
  );
};

export default PeriodicExportConfig;
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { toast } from 'sonner';

const DateTriggerConfig = () => {
  const [triggerDate, setTriggerDate] = useState('');
  const [values, setValues] = useState('');
  const {
    spreadsheets,
    sheets,
    selectedSpreadsheet,
    selectedSheet,
    setSelectedSpreadsheet,
    setSelectedSheet,
  } = useGoogleSheets();

  const handleCreateAutomation = () => {
    if (!triggerDate || !selectedSpreadsheet || !selectedSheet || !values) {
      toast.error('Please fill in all fields');
      return;
    }
    
    toast.success('Automation created successfully');
  };

  return (
    <div className="space-y-12">
      <p className="text-2xl leading-relaxed text-[#1A1F2C]">
        On{' '}
        <Input
          type="date"
          value={triggerDate}
          onChange={(e) => setTriggerDate(e.target.value)}
          className="w-40 inline-block mx-1 bg-transparent border-b border-t-0 border-x-0 rounded-none text-[#1A1F2C] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-[#6E59A5]"
        />
        , add a row in{' '}
        <Select value={selectedSpreadsheet} onValueChange={setSelectedSpreadsheet}>
          <SelectTrigger className="w-40 inline-flex bg-transparent border-b border-t-0 border-x-0 rounded-none text-[#1A1F2C]">
            <SelectValue placeholder="Select spreadsheet" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {spreadsheets.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {' / '}
        <Select value={selectedSheet} onValueChange={setSelectedSheet}>
          <SelectTrigger className="w-32 inline-flex bg-transparent border-b border-t-0 border-x-0 rounded-none text-[#1A1F2C]">
            <SelectValue placeholder="Select sheet" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {sheets.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {' '}with these{' '}
        <Input
          value={values}
          onChange={(e) => setValues(e.target.value)}
          className="w-40 inline-block mx-1 bg-transparent border-b border-t-0 border-x-0 rounded-none text-[#1A1F2C] placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-[#6E59A5]"
          placeholder="values"
        />
      </p>

      <Button
        onClick={handleCreateAutomation}
        className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:opacity-90 text-white px-8"
        size="lg"
      >
        Create automation
      </Button>
    </div>
  );
};

export default DateTriggerConfig;
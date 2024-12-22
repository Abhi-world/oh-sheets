import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoogleSheets } from '@/hooks/useGoogleSheets';
import { toast } from 'sonner';

const ColumnChangeConfig = () => {
  const [columnName, setColumnName] = useState('');
  const [searchValues, setSearchValues] = useState('');
  const [values, setValues] = useState('');
  const {
    spreadsheets,
    sheets,
    selectedSpreadsheet,
    selectedSheet,
    setSelectedSpreadsheet,
    setSelectedSheet,
  } = useGoogleSheets();

  return (
    <div className="space-y-12">
      <div className="bg-navy-dark/40 p-6 rounded-lg border border-google-green/20">
        <p className="text-xl leading-relaxed">
          When column{' '}
          <Input
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            className="w-40 inline-block mx-1 bg-navy-light border-google-green focus-visible:ring-google-green/50"
            placeholder="column name"
          />
          {' '}changes to{' '}
          <Input
            value={searchValues}
            onChange={(e) => setSearchValues(e.target.value)}
            className="w-40 inline-block mx-1 bg-navy-light border-google-green focus-visible:ring-google-green/50"
            placeholder="search values"
          />
          {', '}add a row in{' '}
          <Select value={selectedSpreadsheet} onValueChange={setSelectedSpreadsheet}>
            <SelectTrigger className="w-40 inline-flex bg-navy-light border-google-green focus:ring-google-green/50">
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
            <SelectTrigger className="w-32 inline-flex bg-navy-light border-google-green focus:ring-google-green/50">
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
          {' '}with these{' '}
          <Input
            value={values}
            onChange={(e) => setValues(e.target.value)}
            className="w-40 inline-block mx-1 bg-navy-light border-google-green focus-visible:ring-google-green/50"
            placeholder="values"
          />
        </p>
      </div>
    </div>
  );
};

export default ColumnChangeConfig;
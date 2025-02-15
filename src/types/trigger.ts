import { Json } from '@/integrations/supabase/types';

export interface TriggerConfig {
  triggerDate: string;
  mondayBoardId: string;
  spreadsheetId: string;
  sheetId: string;
}

export interface MondayBoard {
  id: string;
  name: string;
}

export interface ColumnMapping {
  source: string;
  target: string;
  type: string;
  [key: string]: string; // Add index signature
}

export interface ColumnMappingData {
  sourceColumn: string;
  targetColumn: string;
  dataType: string;
}

export const convertToColumnMapping = (data: ColumnMappingData): ColumnMapping => ({
  source: data.sourceColumn,
  target: data.targetColumn,
  type: data.dataType
});

export const convertToJson = (mappings: ColumnMapping[]): Json => {
  return mappings as unknown as Json;
};
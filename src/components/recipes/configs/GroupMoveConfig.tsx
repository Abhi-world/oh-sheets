import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const GroupMoveConfig = () => {
  return (
    <div className="space-y-6">
      <p className="text-lg">
        When item moves to{' '}
        <Input
          type="text"
          className="w-40 inline-block mx-1 underline"
          placeholder="Group name"
        />
        , add row in{' '}
        <Input
          type="text"
          className="w-40 inline-block mx-1 underline"
          placeholder="Spreadsheet"
        />
        {' '}/{' '}
        <Input
          type="text"
          className="w-40 inline-block mx-1 underline"
          placeholder="Sheet"
        />
        {' '}with these{' '}
        <Input
          type="text"
          className="w-40 inline-block mx-1 underline"
          placeholder="values"
        />
      </p>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <Label className="text-sm text-gray-600">Preview</Label>
        <p className="mt-2 text-sm">
          When an item is moved to [Group], a new row will be added to [Spreadsheet]/[Sheet] with [values].
        </p>
      </div>
    </div>
  );
};

export default GroupMoveConfig;
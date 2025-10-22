/**
 * React Component for Auto-Save Status Display
 */

import React from 'react';
import { formatLastSaved } from '@/lib/persistence/localStorage';

interface AutoSaveStatusProps {
  isAutoSaving: boolean;
  lastSaved?: string;
}

export function AutoSaveStatus({ isAutoSaving, lastSaved }: AutoSaveStatusProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      {isAutoSaving ? (
        <>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Saving...</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>{lastSaved ? formatLastSaved(lastSaved) : 'Ready to save'}</span>
        </>
      )}
    </div>
  );
}

export default AutoSaveStatus;
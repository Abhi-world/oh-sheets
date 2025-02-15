
import React from 'react';
import { useMonday } from '@/hooks/useMonday';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle, FileSpreadsheet, Puzzle, MoreHorizontal } from "lucide-react";
import MondayBoardSkeleton from './skeletons/MondayBoardSkeleton';

const MondayBoards = () => {
  const { data, isLoading, error } = useMonday();
  const boards = data?.data?.boards || [];

  console.log("Monday connection status:", {
    isLoading,
    hasError: !!error,
    errorMessage: error?.message,
    hasData: !!data,
    boardsCount: boards?.length,
    rawData: data
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-monday-blue" />
            Google Sheets Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Loading your boards...</AlertTitle>
            <AlertDescription>
              Please wait while we fetch your Monday.com boards.
            </AlertDescription>
          </Alert>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Connected Boards</h3>
            <ScrollArea className="h-[400px]">
              <MondayBoardSkeleton />
              <MondayBoardSkeleton />
              <MondayBoardSkeleton />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-monday-blue" />
            Google Sheets Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription className="mt-2">
              {error.message}
              <br />
              Please make sure you:
              <ul className="list-disc ml-6 mt-2">
                <li>Have installed the app in your Monday.com workspace</li>
                <li>Have granted the necessary permissions</li>
                <li>Have added the app through the Monday.com Marketplace</li>
              </ul>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Installation Steps:</h4>
                <ol className="list-decimal ml-4">
                  <li>Click your avatar/profile icon in the top-right corner</li>
                  <li>Select "Admin" from the dropdown menu</li>
                  <li>Navigate to "Apps" in the admin panel</li>
                  <li>Click "Visit Marketplace"</li>
                  <li>Search for "Oh Sheets" in the marketplace</li>
                  <li>Click "Install" and follow the prompts</li>
                  <li>Grant the requested permissions</li>
                  <li>Return to your board and refresh the page</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-monday-blue" />
          Google Sheets Integration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>How to Use Oh Sheets in Your Board</AlertTitle>
          <AlertDescription className="space-y-4">
            <div className="flex items-start gap-2 mt-2">
              <div>
                <p className="font-semibold mb-2">To sync items to Google Sheets:</p>
                <ol className="list-decimal ml-4">
                  <li>Click on any item in your board</li>
                  <li>Look for the "Oh Sheets" tab in the item's side panel</li>
                  <li>Click "Configure Sync" to set up the Google Sheets connection</li>
                </ol>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div>
                <p className="font-semibold mb-2">To sync multiple items at once:</p>
                <ol className="list-decimal ml-4">
                  <li>Select multiple items in your board</li>
                  <li>Click the "Batch Actions" menu (three dots)</li>
                  <li>Choose "Oh Sheets - Sync to Google Sheets"</li>
                </ol>
              </div>
            </div>

            <Alert variant="default" className="mt-4 bg-blue-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Quick Tip</AlertTitle>
              <AlertDescription>
                If you don't see the Oh Sheets options, try refreshing your board or re-adding the app through the integrations menu.
              </AlertDescription>
            </Alert>
          </AlertDescription>
        </Alert>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Connected Boards</h3>
          <ScrollArea className="h-[400px]">
            {boards?.length > 0 ? (
              boards.map((board: any) => (
                <div key={board.id} className="mb-4 p-4 border rounded hover:border-monday-blue transition-colors">
                  <h3 className="text-lg font-semibold">{board.name}</h3>
                  <div className="mt-2">
                    <h4 className="font-medium mb-2">Items:</h4>
                    {board.items?.map((item: any) => (
                      <div key={item.id} className="ml-4 mb-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 p-4">
                No boards connected yet. Add the integration to a board to get started.
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default MondayBoards;

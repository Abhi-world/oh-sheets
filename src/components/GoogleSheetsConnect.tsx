import { useState, useEffect } from 'react';
import { googleSheetsService } from '@/integrations/google/sheets';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, RefreshCw } from 'lucide-react';

export function GoogleSheetsConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    try {
      setConnectionError(null);
      const hasStoredCredentials = await googleSheetsService.initializeWithStoredCredentials();
      
      if (hasStoredCredentials) {
        // Verify the connection by attempting to fetch spreadsheets and drive files
        try {
          // Check Google Sheets access
          const sheetsResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets?fields=spreadsheetId', {
            headers: {
              'Authorization': `Bearer ${await googleSheetsService.getAccessToken()}`,
              'Accept': 'application/json',
            },
          });
          
          // Check Google Drive access
          const driveResponse = await fetch('https://www.googleapis.com/drive/v3/files?q=mimeType=\'application/vnd.google-apps.spreadsheet\'&fields=files(id,name)&pageSize=1', {
            headers: {
              'Authorization': `Bearer ${await googleSheetsService.getAccessToken()}`,
              'Accept': 'application/json',
            },
          });
          
          if (!sheetsResponse.ok || !driveResponse.ok) {
            throw new Error(`Google API error: Sheets ${sheetsResponse.status}, Drive ${driveResponse.status}`);
          }
          
          console.log('Successfully verified Google Sheets and Drive connection');
          setIsConnected(true);
        } catch (verifyError) {
          console.error('Error verifying Google connection:', verifyError);
          // If verification fails, we need to reconnect
          setIsConnected(false);
          setConnectionError('Your Google connection needs to be refreshed. Please reconnect.');
          toast({
            title: 'Connection Issue',
            description: 'Your Google Sheets and Drive connection needs to be refreshed. Please reconnect.',
            variant: 'destructive'
          });
        }
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error checking Google connection:', error);
      setIsConnected(false);
      setConnectionError('Failed to check Google connection. Please try again.');
    }
  }

  async function handleConnect() {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      const authUrl = googleSheetsService.getAuthUrl();
      
      // Open popup for authentication instead of redirecting
      const popup = window.open(
        authUrl,
        'Google Sheets Authorization',
        'width=800,height=600,menubar=no,toolbar=no,location=no,status=no'
      );
      
      // Set up message listener for the OAuth callback
      window.addEventListener('message', async (event) => {
        // Verify origin for security
        if (event.data && event.data.type === 'GOOGLE_AUTH_CALLBACK') {
          const { code } = event.data;
          
          try {
            await googleSheetsService.handleAuthCallback(code);
            setIsConnected(true);
            toast({
              title: 'Connection Successful',
              description: 'Successfully connected to Google Sheets and Drive.',
            });
            
            if (popup) {
              popup.close();
            }
          } catch (callbackError) {
            console.error('Error handling auth callback:', callbackError);
            setConnectionError('Failed to complete authentication. Please try again.');
            toast({
              title: 'Authentication Error',
              description: 'Failed to complete Google authentication. Please try again.',
              variant: 'destructive'
            });
          }
        }
      }, { once: true });
      
    } catch (error) {
      console.error('Error connecting to Google Sheets:', error);
      setConnectionError('Failed to connect to Google Sheets. Please try again.');
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to Google Sheets. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  }
  
  async function handleRefreshConnection() {
    setIsRefreshing(true);
    try {
      await checkConnection();
      toast({
        title: 'Connection Refreshed',
        description: isConnected ? 'Google Sheets connection is active.' : 'Please reconnect to Google Sheets.',
      });
    } catch (error) {
      console.error('Error refreshing connection:', error);
      toast({
        title: 'Refresh Error',
        description: 'Failed to refresh connection status. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <Card className="w-full p-6 shadow-lg">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.07 8.93l-4-4A1 1 0 0014 4.5H7a2.5 2.5 0 00-2.5 2.5v10A2.5 2.5 0 007 19.5h10a2.5 2.5 0 002.5-2.5V9.5a1 1 0 00-.43-.57zM14 5.5l3.5 3.5H14z" fill="#0F9D58"/>
            <path d="M14 12.75H8.5v-1.5H14zM16 15.5H8.5V14H16z" fill="#FFFFFF"/>
          </svg>
          <h2 className="text-2xl font-bold">Connect to Google Sheets</h2>
        </div>
        
        {connectionError && (
          <Alert className="w-full border-yellow-500 bg-yellow-500/10">
            <Info className="h-4 w-4 text-yellow-500" />
            <AlertTitle>Connection Issue</AlertTitle>
            <AlertDescription>{connectionError}</AlertDescription>
          </Alert>
        )}
        
        {isConnected ? (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="flex items-center gap-2 text-green-600 text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Connected to Google Sheets</span>
            </div>
            
            <Button
              onClick={handleRefreshConnection}
              disabled={isRefreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh Connection
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex items-center gap-2 bg-[#0F9D58] hover:bg-[#0F9D58]/90 text-white"
            size="lg"
          >
            {isConnecting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101"
                  />
                </svg>
                <span>Connect Google Sheets</span>
              </>
            )}
          </Button>
        )}
        
        <div className="text-sm text-gray-500 mt-4 text-center">
          <p>Connecting to Google Sheets allows you to automatically export data from Monday.com boards.</p>
          <p className="mt-1">Your connection is secure and you can disconnect at any time.</p>
        </div>
      </div>
    </Card>
  );
}
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const ConnectMonday = () => {
  const handleOAuthConnect = () => {
    try {
      // Redirect to Monday.com OAuth endpoint
      const clientId = import.meta.env.VITE_MONDAY_CLIENT_ID;
      const redirectUri = `${window.location.origin}/oauth/monday`;
      const scope = 'boards:read boards:write me:read';
      
      console.log('Initiating OAuth connection with client ID:', clientId);
      console.log('Redirect URI:', redirectUri);
      
      if (!clientId) {
        console.error('Monday.com client ID is not configured');
        toast.error('Monday.com integration is not properly configured. Please contact support.');
        return;
      }

      // Add state parameter for security
      const state = Math.random().toString(36).substring(7);
      sessionStorage.setItem('monday_oauth_state', state);
      
      const authUrl = `https://auth.monday.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
      
      console.log('Redirecting to Monday.com OAuth URL:', authUrl);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating OAuth connection:', error);
      toast.error('Failed to connect to Monday.com. Please try again.');
    }
  };

  useEffect(() => {
    // If this is opened in Monday.com's context, auto-initiate OAuth
    const isInMondayContext = window.location.href.includes('monday.com') || 
                             document.referrer.includes('monday.com');
    
    console.log('Checking Monday.com context:', isInMondayContext);
    
    if (isInMondayContext) {
      handleOAuthConnect();
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card className="border-0 shadow-none">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Connect Monday.com</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600 text-center">
            Click below to securely connect your Monday.com account. No manual API token needed!
          </p>
          <Button 
            onClick={handleOAuthConnect}
            className="w-full bg-[#ff3d57] hover:bg-[#ff3d57]/90 text-white py-6 text-lg font-medium"
          >
            Connect Monday.com
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectMonday;
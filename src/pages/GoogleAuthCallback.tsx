import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function GoogleAuthCallback() {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      // Send the auth code to the parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_CALLBACK',
          code
        }, window.location.origin);
        
        // Close this window after a short delay
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        console.error('No opener window found');
      }
    }
  }, [searchParams]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Complete</h1>
        <p className="text-gray-600">
          Successfully authenticated with Google. This window will close automatically.
        </p>
        <div className="mt-4 animate-pulse">
          <div className="w-8 h-8 mx-auto border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
# Adding Environment Variables to Netlify

This guide will walk you through the process of adding your environment variables to Netlify for your Oh Sheets application.

## Environment Variables to Add

Based on your `.env` file, you'll need to add the following environment variables to Netlify:

### Monday.com Integration
- `VITE_MONDAY_CLIENT_ID` - Your Monday.com client ID
- `MONDAY_CLIENT_ID` - Same as above (needed for both frontend and backend)
- `VITE_MONDAY_CLIENT_SECRET` - Your Monday.com client secret
- `MONDAY_CLIENT_SECRET` - Same as above (needed for both frontend and backend)
- `VITE_MONDAY_API_TOKEN` - Your Monday.com API token
- `MONDAY_API_TOKEN` - Same as above (needed for both frontend and backend)

### Google OAuth Integration
- `VITE_GOOGLE_CLIENT_ID` - Your Google client ID
- `VITE_GOOGLE_CLIENT_SECRET` - Your Google client secret
- `VITE_APP_URL` - Your Netlify app URL (e.g., https://your-app-name.netlify.app) - This is used for the Google OAuth redirect URI

### Application URLs
- `VITE_APP_URL` - Your Netlify app URL (e.g., https://your-app-name.netlify.app)
- `APP_URL` - Same as above (needed for both frontend and backend)

### Supabase Integration
- `VITE_SUPABASE_URL` - Your Supabase URL
- `SUPABASE_URL` - Same as above (needed for both frontend and backend)
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_ANON_KEY` - Same as above (needed for both frontend and backend)
- `SUPABASE_PUBLISHABLE_KEY` - Your Supabase publishable key

### Other
- `NODE_ENV` - Set to `production` for production deployment
- `PUBLIC_URL` - Your Netlify app URL (same as APP_URL)

## Steps to Add Environment Variables to Netlify

1. **Log in to your Netlify account**
   - Go to [https://app.netlify.com/](https://app.netlify.com/) and log in

2. **Select your site**
   - From the dashboard, click on the site you want to configure

3. **Access Environment Variables**
   - Click on **Site settings** in the top navigation
   - In the left sidebar, click on **Environment variables**

4. **Add Environment Variables**
   - Click on **Add a variable**
   - You can add variables individually or import from a .env file
   
   ### Option 1: Add variables individually
   - For each variable listed above:
     - Click **Add a variable**
     - Enter the key (e.g., `VITE_MONDAY_CLIENT_ID`)
     - Enter the value (your actual Monday.com client ID)
     - Click **Save**
   
   ### Option 2: Import from .env file
   - Click **Import from .env**
   - Upload your .env file (make sure it contains your actual values, not placeholders)
   - Review the variables and click **Import**

5. **Update Application URLs**
   - Make sure to update `VITE_APP_URL`, `APP_URL`, and `PUBLIC_URL` to your Netlify URL
   - Format: `https://your-site-name.netlify.app`

6. **Set NODE_ENV to production**
   - Add `NODE_ENV` with value `production`

7. **Deploy Your Site**
   - After adding all environment variables, redeploy your site
   - Go to the **Deploys** tab and click **Trigger deploy** > **Deploy site**

## Setting Up Google OAuth for Sheets Integration

1. **Create Google Cloud Project**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Library"
   - Enable the "Google Sheets API" and "Google Drive API"

2. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Select the appropriate user type (External or Internal)
   - Fill in the required information (App name, user support email, etc.)
   - Add the necessary scopes (`.../auth/spreadsheets` and `.../auth/drive.file`)
   - Add your email as a test user if using External user type

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the application type
   - Add a name for your OAuth client
   - Add authorized JavaScript origins: `https://your-netlify-app-url.netlify.app`
   - Add authorized redirect URIs: `https://your-netlify-app-url.netlify.app/auth/google/callback`
   - Click "Create"
   - Copy the Client ID and Client Secret for use in your environment variables

## Important Notes

1. **Sensitive Information**: Environment variables in Netlify are encrypted and secure. However, variables prefixed with `VITE_` will be exposed to the browser. Only use the `VITE_` prefix for variables that are safe to expose to the client.

2. **Redirect URIs**: If you're using OAuth (like with Monday.com and Google), make sure to update the redirect URIs in their respective developer consoles to point to your Netlify domain.

3. **Function Environment Variables**: The environment variables will be available to both your frontend application and Netlify Functions.

4. **Build Environment**: These variables will be available during build time. If you need to access them at runtime, make sure they are prefixed with `VITE_` for Vite applications.

5. **Verification**: After deployment, verify that your application can connect to Monday.com, Google, and Supabase correctly.
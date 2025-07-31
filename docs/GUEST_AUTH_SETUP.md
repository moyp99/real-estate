# Guest Authentication Setup

This document explains how to set up and use the guest authentication feature in Estate Navigator.

## Overview

The guest authentication feature allows users to browse properties without creating an account. Guest sessions are valid for 24 hours and provide limited access to the application.

## How It Works

1. **With Supabase**: If Supabase is properly configured, the app will use Supabase's anonymous authentication
2. **Without Supabase**: If Supabase is not configured or anonymous auth is not enabled, the app falls back to a local storage-based guest session

## Setting Up Guest Authentication

### Option 1: Using Supabase (Recommended for Production)

1. **Enable Anonymous Sign-ins in Supabase Dashboard**:
   - Go to your Supabase project dashboard
   - Navigate to Authentication → Settings
   - Under "Auth Providers", enable "Anonymous Sign-ins"
   - Save the changes

2. **Configure Environment Variables**:
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Option 2: Local Development (No Supabase Required)

The app automatically falls back to local storage-based guest sessions when:
- Supabase is not configured
- Anonymous authentication is not enabled in Supabase
- There's an error connecting to Supabase

## Guest User Features

Guest users can:
- Browse all property listings
- View property details
- Use the map view
- Apply filters and search
- View agent contact information

Guest users cannot:
- Save properties to favorites
- Send messages to agents
- Schedule property tours
- Access personalized features

## Implementation Details

### Guest Session Structure
```javascript
{
  id: "guest_[timestamp]_[random]",
  email: "guest@estate-navigator.com",
  name: "Guest User",
  type: "guest",
  timestamp: Date.now()
}
```

### Session Duration
- Guest sessions expire after 24 hours
- Expired sessions are automatically cleared on app load
- Users can continue as guest again after expiration

### Code Implementation

The guest login is handled in `AuthContext.tsx`:
- Attempts Supabase anonymous authentication first
- Falls back to local storage implementation
- Maintains session persistence across page reloads

## Testing Guest Authentication

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **On the login page**, click "Continue as Guest"

3. **Verify guest access**:
   - You should be redirected to the main property listing page
   - The user menu should show "Guest User"
   - You should be able to browse properties

## Troubleshooting

### Guest login not working with Supabase
- Ensure anonymous sign-ins are enabled in Supabase dashboard
- Check that environment variables are correctly set
- Look for errors in the browser console

### Session not persisting
- Check browser's local storage settings
- Ensure cookies and local storage are not blocked
- Try clearing browser cache and trying again

## Security Considerations

- Guest sessions are stored in browser local storage
- No sensitive data is stored for guest users
- Guest users have read-only access to public data
- Consider implementing rate limiting for guest users in production
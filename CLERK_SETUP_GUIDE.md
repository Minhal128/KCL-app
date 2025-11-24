# Clerk Google & Apple Sign-In Setup Guide for KCL Frontend

## Overview
This guide explains how to set up and use Clerk authentication with Google and Apple sign-in in the KCL frontend application.

## What Was Implemented

### 1. **Dependencies Added**
- `@clerk/clerk-expo`: ^2.17.0 - Clerk authentication library for Expo
- `expo-secure-store`: ^15.0.7 - Secure token storage
- `react-native-toast-message`: ^2.3.3 - Toast notifications for user feedback

### 2. **Configuration Files**

#### `app.config.js`
- Added iOS associated domains for Clerk deep linking
- Added scheme configuration for OAuth callbacks

#### `config.js` (New)
- Centralized configuration for Clerk and backend endpoints
- Clerk publishable key: `pk_test_YWJvdmUtZ29yaWxsYS04OC5jbGVyay5hY2NvdW50cy5kZXYk`
- Backend OAuth endpoints configured

#### `app/_layout.tsx`
- Wrapped app with `ClerkProvider`
- Configured token cache using `expo-secure-store` for secure token storage
- Maintains existing Stripe and UserProvider setup

### 3. **Components Created**

#### `components/auth/ClerkGoogleSignInButton.jsx`
Features:
- Handles Google OAuth flow via Clerk
- Automatic session clearing if user already signed in
- Extracts user data from Clerk response
- Sends data to backend for verification/account creation
- Stores tokens and user data locally
- Integrates with UserContext for app-wide auth state
- Comprehensive error handling and logging
- Toast notifications for user feedback

#### `components/auth/ClerkAppleSignInButton.jsx`
Features:
- Handles Apple OAuth flow via Clerk
- Similar session management as Google button
- Supports both signup and login flows via `isSignup` prop
- Extracts user data from Clerk response
- Sends data to backend for verification/account creation
- Stores tokens and user data locally
- Integrates with UserContext for app-wide auth state
- Comprehensive error handling and logging

### 4. **Updated Pages**

#### `app/login.jsx`
- Replaced old OAuth icon buttons with full-width Clerk buttons
- Integrated `ClerkGoogleSignInButton` and `ClerkAppleSignInButton`
- Updated styles for new button layout
- Maintains existing email/password login functionality

#### `app/register.jsx`
- Replaced old OAuth icon buttons with full-width Clerk buttons
- Integrated `ClerkGoogleSignInButton` and `ClerkAppleSignInButton` with `isSignup={true}`
- Updated styles for new button layout
- Maintains existing email registration functionality

## Backend Integration

The Clerk buttons expect your backend to have these endpoints:

### POST `/auth/clerk-google`
**Request Body:**
```json
{
  "clerkId": "user_xxx",
  "sessionId": "sess_xxx",
  "googleId": "google_id",
  "email": "user@example.com",
  "emailVerified": true,
  "name": "User Name",
  "firstName": "User",
  "lastName": "Name",
  "username": "username",
  "photo": "https://...",
  "phoneNumber": "+1234567890",
  "authMethod": "clerk_google",
  "provider": "google",
  "platform": "ios|android|web",
  "role": "customer",
  "appType": "customer"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    ...
  }
}
```

### POST `/auth/clerk-apple`
**Request Body:**
```json
{
  "clerkId": "user_xxx",
  "sessionId": "sess_xxx",
  "email": "user@example.com",
  "name": "User Name",
  "firstName": "User",
  "lastName": "Name",
  "photo": "https://...",
  "phoneNumber": "+1234567890",
  "authMethod": "clerk_apple",
  "provider": "apple",
  "platform": "ios|android|web",
  "role": "customer",
  "appType": "customer",
  "isSignup": false
}
```

**Expected Response:**
Same as Google endpoint

## Clerk Dashboard Configuration

### 1. **Create Clerk Account**
- Go to https://dashboard.clerk.com
- Create a new application

### 2. **Configure OAuth Providers**

#### Google OAuth
1. In Clerk Dashboard → Settings → OAuth Applications
2. Enable Google OAuth
3. Add your Google OAuth credentials from Google Cloud Console
4. Configure redirect URIs:
   - `https://kcl.clerk.accounts.dev/oauth/callback`
   - `kcl://oauth-callback` (for mobile deep linking)

#### Apple OAuth
1. In Clerk Dashboard → Settings → OAuth Applications
2. Enable Apple OAuth
3. Configure Apple Developer credentials
4. Configure redirect URIs:
   - `https://kcl.clerk.accounts.dev/oauth/callback`
   - `kcl://oauth-callback` (for mobile deep linking)

### 3. **Get Publishable Key**
- Copy your publishable key from Clerk Dashboard
- Update in `app/_layout.tsx` and `config.js` if needed

## Local Storage Keys

The components store the following data in AsyncStorage:

```
clerk_user_data          - Complete user data from Clerk
clerk_session_id         - Clerk session ID
auth_method              - "clerk_google" or "clerk_apple"
sign_in_time             - ISO timestamp of sign-in
user_email               - User's email
user_name                - User's full name
clerk_user_id            - Clerk user ID
google_id                - Google provider ID (Google only)
access_token             - Backend JWT token
backend_auth_token       - Backend JWT token (duplicate)
user_id                  - Backend user ID
backend_user_id          - Backend user ID (duplicate)
user_data                - Backend user data JSON
backend_user_data        - Backend user data JSON (duplicate)
```

## Usage Examples

### In Login Page
```jsx
import ClerkGoogleSignInButton from "../components/auth/ClerkGoogleSignInButton";
import ClerkAppleSignInButton from "../components/auth/ClerkAppleSignInButton";

export default function LoginPage() {
  return (
    <>
      <ClerkGoogleSignInButton />
      <ClerkAppleSignInButton isSignup={false} />
    </>
  );
}
```

### In Register Page
```jsx
export default function RegisterPage() {
  return (
    <>
      <ClerkGoogleSignInButton />
      <ClerkAppleSignInButton isSignup={true} />
    </>
  );
}
```

### With Custom Callbacks
```jsx
const handleSignInSuccess = (result) => {
  console.log("User signed in:", result.user);
  // Navigate or update state
};

const handleSignInError = (error) => {
  console.error("Sign-in failed:", error);
};

<ClerkGoogleSignInButton 
  onSuccess={handleSignInSuccess}
  onError={handleSignInError}
/>
```

## Troubleshooting

### "Already Signed In" Error
- The component automatically handles this by clearing the session
- First tap clears the session, second tap initiates sign-in
- Check console logs for detailed error information

### Network Errors
- Verify backend is running and accessible
- Check `BACKEND_URI` in `app.config.js`
- Ensure network connectivity on device

### No User Data
- Check Clerk Dashboard OAuth configuration
- Verify redirect URIs are correctly configured
- Check browser console for Clerk errors

### Token Storage Issues
- Ensure `expo-secure-store` is properly installed
- Check device has secure storage available
- Verify AsyncStorage permissions on Android

## Security Notes

1. **Never commit Clerk keys** - Use environment variables in production
2. **Secure token storage** - Tokens stored in secure storage, not AsyncStorage
3. **HTTPS only** - Ensure all backend endpoints use HTTPS in production
4. **Token refresh** - Backend should implement token refresh logic
5. **Session validation** - Backend should validate Clerk session IDs

## Testing Checklist

- [ ] Google sign-in works on iOS
- [ ] Google sign-in works on Android
- [ ] Apple sign-in works on iOS
- [ ] User data is correctly extracted
- [ ] Backend receives correct data
- [ ] Tokens are stored securely
- [ ] User is logged into app after sign-in
- [ ] Session clearing works on "already signed in" error
- [ ] Toast notifications display correctly
- [ ] Navigation works after successful sign-in

## Next Steps

1. **Configure Clerk Dashboard** with your OAuth providers
2. **Update backend endpoints** to handle Clerk authentication
3. **Test on physical devices** (OAuth requires real devices)
4. **Implement token refresh** logic in backend
5. **Add error tracking** (Sentry, LogRocket, etc.)
6. **Set up production Clerk keys** when deploying

## Support

For issues with:
- **Clerk**: https://clerk.com/docs
- **Expo**: https://docs.expo.dev
- **React Native**: https://reactnative.dev

## Files Modified/Created

### Created:
- `config.js` - Configuration file
- `components/auth/ClerkGoogleSignInButton.jsx` - Google sign-in component
- `components/auth/ClerkAppleSignInButton.jsx` - Apple sign-in component
- `CLERK_SETUP_GUIDE.md` - This file

### Modified:
- `package.json` - Added Clerk dependencies
- `app.config.js` - Added iOS associated domains and scheme
- `app/_layout.tsx` - Added ClerkProvider wrapper
- `app/login.jsx` - Integrated Clerk buttons
- `app/register.jsx` - Integrated Clerk buttons

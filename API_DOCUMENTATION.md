# KCL Backend API Integration Documentation

## Overview
This document provides a comprehensive guide to all backend APIs integrated with the React Native Expo frontend.

## Base URL
The base URL is configured in `constants/config.js` and loaded from environment variables.

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header. The token is automatically included by the axios interceptor in `services/api.js`.

---

## API Endpoints

### 1. Authentication APIs (`authAPI`)

#### POST /auth/signup
Register a new user account.

**Request Type:** `multipart/form-data`

**Body:**
```javascript
{
  name: string,
  country: string,
  dateOfBirth: Date,
  interests: string (comma-separated),
  password: string,
  avatar: File
}
```

**Response:**
```javascript
{
  success: boolean,
  message: string,
  user: Object,
  accessToken: string,
  refreshToken: string
}
```

**Frontend Usage:**
```javascript
import { authAPI } from '../services/api';
// Or use the hook
import { useAuth } from '../hooks/useAuth';

const { signUp } = useAuth();
const result = await signUp(formData);
```

---

#### POST /auth/signin
Sign in to an existing account.

**Body:**
```javascript
{
  email: string,
  password: string
}
```

**Response:**
```javascript
{
  success: boolean,
  user: Object,
  accessToken: string,
  refreshToken: string
}
```

**Frontend Usage:**
```javascript
const { signIn } = useAuth();
const result = await signIn({ email, password });
```

---

#### GET /auth/signout
Sign out the current user.

**Response:**
```javascript
{
  success: boolean,
  message: string
}
```

**Frontend Usage:**
```javascript
const { signOut } = useAuth();
await signOut();
```

---

#### POST /auth/forgot-password
Request a password reset.

**Body:**
```javascript
{
  email: string
}
```

**Response:**
```javascript
{
  success: boolean,
  message: string
}
```

---

#### POST /auth/verify-otp
Verify OTP for password reset.

**Body:**
```javascript
{
  email: string,
  otp: string
}
```

**Response:**
```javascript
{
  success: boolean,
  token: string,
  message: string
}
```

---

#### POST /auth/reset-password
Reset password with token.

**Body:**
```javascript
{
  token: string,
  newPassword: string
}
```

**Response:**
```javascript
{
  success: boolean,
  message: string
}
```

---

#### POST /auth/send-otp
Send OTP for email verification.

**Body:**
```javascript
{
  email: string
}
```

**Response:**
```javascript
{
  success: boolean,
  message: string
}
```

---

#### POST /auth/verify-email
Verify email with OTP.

**Body:**
```javascript
{
  email: string,
  otp: string
}
```

**Response:**
```javascript
{
  success: boolean,
  token: string,
  message: string
}
```

---

#### POST /auth/onboarding
Complete user onboarding.

**Body:**
```javascript
{
  email: string,
  token: string,
  name: string,
  country: string,
  dateOfBirth: Date
}
```

**Response:**
```javascript
{
  success: boolean,
  message: string
}
```

---

#### GET /auth/google
Redirect to Google OAuth login.

**Frontend Usage:**
```javascript
import { authAPI } from '../services/api';
const url = authAPI.googleAuth();
await Linking.openURL(url);
```

---

#### GET /auth/facebook
Redirect to Facebook OAuth login.

---

### 2. User APIs (`userAPI`)

All user endpoints require authentication.

#### GET /user
Get current user profile.

**Response:**
```javascript
{
  success: boolean,
  user: {
    _id: string,
    name: string,
    email: string,
    avatar: string,
    country: string,
    dateOfBirth: Date,
    interests: Array,
    language: string,
    // ... other fields
  }
}
```

**Frontend Usage:**
```javascript
import { useUserProfile } from '../hooks/useUserProfile';

const { getProfile } = useUserProfile();
const result = await getProfile();
```

---

#### POST /user/update
Update user profile.

**Request Type:** `multipart/form-data`

**Body:**
```javascript
{
  fullName: string,
  username: string,
  email: string,
  phoneNumber: string,
  country: string,
  avatar: File (optional)
}
```

**Response:**
```javascript
{
  success: boolean,
  user: Object,
  message: string
}
```

**Frontend Usage:**
```javascript
const { updateProfile } = useUserProfile();
const result = await updateProfile(formData);
```

---

#### PUT /user/avatar
Update user avatar only.

**Request Type:** `multipart/form-data`

**Body:**
```javascript
{
  avatar: File
}
```

---

#### PUT /user/password
Set/update user password.

**Body:**
```javascript
{
  currentPassword: string (optional),
  newPassword: string
}
```

---

#### PUT /user/interests
Update user interests.

**Body:**
```javascript
{
  interests: Array<string>
}
```

---

#### PUT /user/language
Set user language preference.

**Body:**
```javascript
{
  language: string
}
```

---

### 3. Profile APIs (`profileAPI`)

All profile endpoints require authentication.

#### POST /profiles/create
Create a new profile (for multi-profile feature).

**Request Type:** `multipart/form-data`

**Body:**
```javascript
{
  name: string,
  isKidsProfile: boolean,
  avatar: File,
  preferences: string,
  pinLock: string (optional)
}
```

**Response:**
```javascript
{
  success: boolean,
  profile: Object,
  message: string
}
```

**Frontend Usage:**
```javascript
import { useProfile } from '../hooks/useProfile';

const { createProfile } = useProfile();
const result = await createProfile(formData);
```

---

#### GET /profiles
Get all profiles for the current user.

**Response:**
```javascript
{
  success: boolean,
  profiles: Array<Object>
}
```

**Frontend Usage:**
```javascript
const { getProfiles, profiles } = useProfile();
await getProfiles();
// profiles state will be updated automatically
```

---

#### POST /profiles/verify-pin
Verify profile PIN lock.

**Body:**
```javascript
{
  profileId: string,
  pin: string
}
```

---

#### PUT /profiles/video-quality
Update video quality preference.

**Body:**
```javascript
{
  videoQuality: string // "Low", "Medium", "High", "Auto"
}
```

---

#### GET /profiles/watchlist
Get watchlist for current profile.

**Response:**
```javascript
{
  success: boolean,
  watchlist: Array<Object>
}
```

---

### 4. Two-Factor Authentication APIs (`twoFactorAPI`)

#### POST /2fa/login-verify
Verify 2FA code during login (no auth required).

**Body:**
```javascript
{
  email: string,
  code: string
}
```

---

#### POST /2fa/enable
Enable 2FA for user (requires auth).

**Response:**
```javascript
{
  success: boolean,
  qrCode: string,
  secret: string
}
```

**Frontend Usage:**
```javascript
import { use2FA } from '../hooks/use2FA';

const { enable2FA, qrCode } = use2FA();
const result = await enable2FA();
// Display qrCode to user
```

---

#### POST /2fa/verify
Verify 2FA setup.

**Body:**
```javascript
{
  code: string
}
```

---

#### POST /2fa/disable
Disable 2FA for user.

**Body:**
```javascript
{
  code: string
}
```

---

### 5. Subscription/Payment APIs (`subscriptionAPI`)

All subscription endpoints require authentication.

#### POST /payments/subscribe
Activate a subscription plan.

**Body:**
```javascript
{
  plan: string // "basic", "standard", "premium"
}
```

**Response:**
```javascript
{
  success: boolean,
  subscription: Object
}
```

**Frontend Usage:**
```javascript
import { useSubscription } from '../hooks/useSubscription';

const { activateSubscription } = useSubscription();
const result = await activateSubscription({ plan: "standard" });
```

---

#### POST /payments/trial
Create a trial subscription.

**Body:**
```javascript
{
  plan: string
}
```

---

#### GET /payments/:id
Get subscription details by ID.

**Response:**
```javascript
{
  success: boolean,
  subscription: Object
}
```

---

#### POST /payments/create-payment-intent
Create a Stripe payment intent.

**Body:**
```javascript
{
  plan: string
}
```

**Response:**
```javascript
{
  success: boolean,
  clientSecret: string,
  paymentIntentId: string
}
```

---

### 6. Device APIs (`deviceAPI`)

All device endpoints require authentication.

#### POST /devices/register
Register a new device.

**Body:**
```javascript
{
  deviceId: string,
  deviceName: string,
  deviceType: string // "mobile", "tablet", "tv", "web"
}
```

**Response:**
```javascript
{
  success: boolean,
  device: Object
}
```

**Frontend Usage:**
```javascript
import { useDevice } from '../hooks/useDevice';

const { registerDevice } = useDevice();
const result = await registerDevice({
  deviceId: "unique-device-id",
  deviceName: "iPhone 13",
  deviceType: "mobile"
});
```

---

#### POST /devices/remove
Remove a registered device.

**Body:**
```javascript
{
  deviceId: string
}
```

---

#### POST /devices/all
Get all devices and limits status.

**Response:**
```javascript
{
  success: boolean,
  devices: Array<Object>,
  limit: number,
  currentCount: number
}
```

---

## Error Handling

All API calls return errors in the following format:

```javascript
{
  success: false,
  message: string,
  error: string (optional)
}
```

The axios interceptor automatically handles 401 errors by clearing authentication tokens.

---

## Usage Examples

### Example 1: Login Flow
```javascript
import { useAuth } from '../hooks/useAuth';
import { router } from 'expo-router';
import { Alert } from 'react-native';

const LoginScreen = () => {
  const { signIn, loading } = useAuth();

  const handleLogin = async () => {
    const result = await signIn({ email, password });
    
    if (result.success) {
      router.push('/home');
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    // UI components
  );
};
```

---

### Example 2: Update Profile
```javascript
import { useUserProfile } from '../hooks/useUserProfile';

const EditProfileScreen = () => {
  const { updateProfile, loading } = useUserProfile();

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    // ... other fields

    const result = await updateProfile(formData);
    
    if (result.success) {
      Alert.alert('Success', 'Profile updated!');
    }
  };
};
```

---

### Example 3: Direct API Call (without hook)
```javascript
import { profileAPI } from '../services/api';

const fetchWatchlist = async () => {
  try {
    const response = await profileAPI.getWatchlist();
    console.log(response.data.watchlist);
  } catch (error) {
    console.error(error);
  }
};
```

---

## Files Structure

```
frontend/
├── services/
│   └── api.js              # Core API service with axios instance
├── hooks/
│   ├── useAuth.js          # Authentication hooks
│   ├── useProfile.js       # Profile management hooks
│   ├── useUserProfile.js   # User profile hooks
│   ├── useSubscription.js  # Subscription hooks
│   ├── useDevice.js        # Device management hooks
│   └── use2FA.js           # 2FA hooks
├── context/
│   └── UserContext.js      # Global user state management
└── constants/
    └── config.js           # API configuration
```

---

## Notes

1. All file uploads use `multipart/form-data` content type
2. Authentication tokens are stored in AsyncStorage
3. The axios interceptor automatically adds tokens to requests
4. 401 errors automatically clear stored tokens
5. All hooks provide loading states for UI feedback
6. Hooks automatically update global user context when appropriate

---

## Testing

To test the APIs, import Postman collection from `postman.json` at the root of the project.

---

## Support

For issues or questions, contact the development team.

# Quick API Reference Guide

## 🚀 Quick Start

### Import and Use Hooks
```javascript
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { useUserProfile } from '../hooks/useUserProfile';
import { useSubscription } from '../hooks/useSubscription';
import { useDevice } from '../hooks/useDevice';
import { use2FA } from '../hooks/use2FA';
```

---

## 📌 Common Operations

### 1. User Login
```javascript
const { signIn, loading } = useAuth();

const handleLogin = async (email, password) => {
  const result = await signIn({ email, password });
  if (result.success) {
    router.push('/home');
  } else {
    Alert.alert('Error', result.message);
  }
};
```

### 2. User Registration
```javascript
const { signUp, loading } = useAuth();

const handleRegister = async () => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  formData.append('country', country);
  formData.append('dateOfBirth', dateOfBirth);
  formData.append('interests', interests.join(','));
  formData.append('avatar', {
    uri: avatarUri,
    name: 'avatar.jpg',
    type: 'image/jpeg'
  });

  const result = await signUp(formData);
};
```

### 3. Forgot Password Flow
```javascript
// Step 1: Send reset email
const { forgotPassword } = useAuth();
const result = await forgotPassword(email);

// Step 2: Verify OTP
const { verifyForgotPasswordOTP } = useAuth();
const result = await verifyForgotPasswordOTP({ email, otp });

// Step 3: Reset password
const { resetPassword } = useAuth();
const result = await resetPassword({ token, newPassword });
```

### 4. Get User Profile
```javascript
const { getProfile, loading } = useUserProfile();
const { user } = useUser(); // From context

useEffect(() => {
  getProfile();
}, []);
```

### 5. Update User Profile
```javascript
const { updateProfile, loading } = useUserProfile();

const handleUpdate = async () => {
  const formData = new FormData();
  formData.append('fullName', fullName);
  formData.append('email', email);
  formData.append('phoneNumber', phone);
  formData.append('country', country);
  
  if (avatarUri) {
    formData.append('avatar', {
      uri: avatarUri,
      name: 'avatar.jpg',
      type: 'image/jpeg'
    });
  }

  const result = await updateProfile(formData);
};
```

### 6. Create Profile (Multi-Profile)
```javascript
const { createProfile, loading } = useProfile();

const handleCreateProfile = async () => {
  const formData = new FormData();
  formData.append('name', profileName);
  formData.append('isKidsProfile', isKids);
  formData.append('pinLock', pin);
  formData.append('avatar', {
    uri: avatarUri,
    name: 'profile.jpg',
    type: 'image/jpeg'
  });

  const result = await createProfile(formData);
};
```

### 7. Get All Profiles
```javascript
const { getProfiles, profiles, loading } = useProfile();

useEffect(() => {
  getProfiles();
}, []);

// profiles array is automatically populated
```

### 8. Subscription Management
```javascript
const { activateSubscription, createPaymentIntent, loading } = useSubscription();

// Create payment intent
const result = await createPaymentIntent({ plan: 'standard' });

// Activate subscription
const result = await activateSubscription({ plan: 'standard' });
```

### 9. Device Management
```javascript
const { registerDevice, removeDevice, getLimitsStatus, devices } = useDevice();

// Register new device
const result = await registerDevice({
  deviceId: 'unique-id',
  deviceName: 'iPhone 13',
  deviceType: 'mobile'
});

// Get all devices
await getLimitsStatus();
// devices array is automatically populated

// Remove device
const result = await removeDevice({ deviceId: 'device-id' });
```

### 10. Two-Factor Authentication
```javascript
const { enable2FA, verify2FA, disable2FA, qrCode } = use2FA();

// Enable 2FA
const result = await enable2FA();
// qrCode will be populated - display to user

// Verify 2FA setup
const result = await verify2FA({ code: '123456' });

// Disable 2FA
const result = await disable2FA({ code: '123456' });
```

### 11. Update Interests
```javascript
const { setInterests } = useUserProfile();

const result = await setInterests({
  interests: ['movies', 'music', 'sports']
});
```

### 12. Update Language
```javascript
const { setLanguage } = useUserProfile();

const result = await setLanguage({
  language: 'en'
});
```

### 13. Get Watchlist
```javascript
const { getWatchlist } = useProfile();

const result = await getWatchlist();
if (result.success) {
  console.log(result.data.watchlist);
}
```

### 14. Update Video Quality
```javascript
const { editVideoQuality } = useProfile();

const result = await editVideoQuality({
  videoQuality: 'High' // 'Low', 'Medium', 'High', 'Auto'
});
```

### 15. User Logout
```javascript
const { signOut } = useAuth();

const handleLogout = async () => {
  await signOut();
  router.replace('/login');
};
```

---

## 🎨 Direct API Calls (Without Hooks)

When you need more control or don't want to use hooks:

```javascript
import { authAPI, userAPI, profileAPI, subscriptionAPI, deviceAPI, twoFactorAPI } from '../services/api';

// Example: Direct login
try {
  const response = await authAPI.signIn({ email, password });
  console.log(response.data);
} catch (error) {
  console.error(error.response?.data?.message);
}

// Example: Get user profile
try {
  const response = await userAPI.getProfile();
  console.log(response.data.user);
} catch (error) {
  console.error(error);
}
```

---

## 🔄 Response Format

All hooks return a consistent format:

```javascript
{
  success: boolean,
  data: Object | Array, // API response data
  message: string       // Error or success message
}
```

Example:
```javascript
const result = await signIn({ email, password });

if (result.success) {
  console.log('User:', result.data.user);
  console.log('Token:', result.data.accessToken);
} else {
  console.log('Error:', result.message);
}
```

---

## 🎯 Loading States

All hooks provide a `loading` state:

```javascript
const { signIn, loading } = useAuth();

return (
  <TouchableOpacity 
    onPress={handleLogin}
    disabled={loading}
  >
    {loading ? (
      <ActivityIndicator color="white" />
    ) : (
      <Text>Login</Text>
    )}
  </TouchableOpacity>
);
```

---

## 📝 Form Data Examples

### Image Upload
```javascript
const formData = new FormData();
formData.append('avatar', {
  uri: imageUri,
  name: 'photo.jpg',
  type: 'image/jpeg'
});
```

### Multiple Fields
```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('interests', 'movies,music'); // comma-separated
```

---

## ⚠️ Error Handling

### Using Hooks (Automatic)
```javascript
const { signIn } = useAuth();
const result = await signIn({ email, password });

if (!result.success) {
  Alert.alert('Error', result.message);
}
```

### Direct API Calls
```javascript
try {
  const response = await authAPI.signIn({ email, password });
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred';
  Alert.alert('Error', message);
}
```

---

## 🔐 Authentication Context

### Access User Data
```javascript
import { useUser } from '../context/UserContext';

const { user, login, logout, fetchUserProfile, loadingUser } = useUser();

// user object contains all user data
console.log(user.name, user.email, user.avatar);
```

### Check Authentication
```javascript
const { user, loadingUser } = useUser();

if (loadingUser) {
  return <LoadingScreen />;
}

if (!user) {
  return <LoginScreen />;
}

return <HomeScreen />;
```

---

## 🎪 OAuth (Social Login)

```javascript
import * as Linking from 'expo-linking';
import { authAPI } from '../services/api';

// Google Login
const handleGoogleLogin = async () => {
  const url = authAPI.googleAuth();
  await Linking.openURL(url);
};

// Facebook Login
const handleFacebookLogin = async () => {
  const url = authAPI.facebookAuth();
  await Linking.openURL(url);
};
```

---

## 🚨 Common Patterns

### 1. Screen with API Call on Mount
```javascript
const MyScreen = () => {
  const { getProfile, loading } = useUserProfile();

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) return <ActivityIndicator />;

  return <View>...</View>;
};
```

### 2. Form Submission
```javascript
const MyForm = () => {
  const [formData, setFormData] = useState({});
  const { updateProfile, loading } = useUserProfile();

  const handleSubmit = async () => {
    const formDataObj = new FormData();
    Object.keys(formData).forEach(key => {
      formDataObj.append(key, formData[key]);
    });

    const result = await updateProfile(formDataObj);
    
    if (result.success) {
      Alert.alert('Success', 'Profile updated!');
      router.back();
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <View>
      {/* Form inputs */}
      <Button 
        onPress={handleSubmit} 
        disabled={loading}
      />
    </View>
  );
};
```

### 3. List with Refresh
```javascript
const MyList = () => {
  const { getProfiles, profiles, loading } = useProfile();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await getProfiles();
    setRefreshing(false);
  };

  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <FlatList
      data={profiles}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={({ item }) => <ProfileCard profile={item} />}
    />
  );
};
```

---

## 📚 File Locations

- **API Service:** `services/api.js`
- **Hooks:** `hooks/useAuth.js`, `hooks/useProfile.js`, etc.
- **Context:** `context/UserContext.js`
- **Config:** `constants/config.js`

---

## 🎓 Tips

1. **Always use hooks** for better code organization
2. **Check loading states** before making another request
3. **Handle errors gracefully** with Alert or Toast
4. **Use TypeScript** for better type safety (optional)
5. **Test with Postman** before implementing in frontend

---

## 🆘 Troubleshooting

### Token Issues
- Tokens are stored in AsyncStorage
- Check `access_token` key in AsyncStorage
- Interceptor automatically adds token to requests

### 401 Errors
- Interceptor automatically clears tokens on 401
- User will be logged out automatically

### Network Errors
- Check `BACKEND_URI` in config
- Ensure backend server is running
- Check network connection

---

For detailed documentation, see `API_DOCUMENTATION.md`

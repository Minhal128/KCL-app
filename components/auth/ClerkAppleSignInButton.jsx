import React, { useState, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Platform,
  Alert,
} from 'react-native';
import { useOAuth, useUser, useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { FontAwesome } from '@expo/vector-icons';
import config from '../../config';
import { useUser as useUserContext } from '../../context/UserContext';

/**
 * ClerkAppleSignInButton
 *
 * Props:
 *  - isSignup (boolean) : if true, treat this as a signup flow, otherwise login flow
 *  - onSuccess (func) : callback with result when auth succeeds
 *  - onError (func) : callback when auth fails
 *  - style (object) : optional style for button container
 *  - disabled (boolean) : disable the button
 *
 * Behavior:
 *  - Forces sign out of existing Clerk session to show account picker
 *  - Starts Clerk server-side OAuth for Apple (strategy: 'oauth_apple')
 *  - Activates session via setActive
 *  - Extracts Clerk user data, stores helpful fields in AsyncStorage
 *  - Calls backend endpoint `${config.baseUrl}/auth/clerk-apple` for verification/creation
 *  - On success: stores backend token/user and navigates to 'home' (or calls onSuccess)
 */

const ClerkAppleSignInButton = ({
  isSignup = false,
  onSuccess,
  onError,
  style,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });
  const { user: clerkUser } = useUser();
  const { signOut, isSignedIn, getToken } = useAuth();
  const { login, setAuthMethod } = useUserContext();

  // Helper function to get user from Clerk hook
  const getClerkUserData = useCallback(async () => {
    try {
      // Wait for clerkUser to be available from the hook
      let attempts = 0;
      while (!clerkUser && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        attempts++;
      }
      
      if (clerkUser) {
        console.log('✅ Got user from Clerk hook:', clerkUser.id);
        return clerkUser;
      }
      
      console.log('⚠️ Could not get user from Clerk hook after retries');
      return null;
    } catch (error) {
      console.log('⚠️ Error getting user from Clerk:', error.message);
      return null;
    }
  }, [clerkUser]);

  const handleAuthError = (err) => {
    console.error('❌ Clerk Apple Sign-In error:', err);
    const message = (err && err.message) ? err.message : 'Apple sign-in failed';
    Toast.show({ type: 'error', text1: 'Authentication Failed', text2: message });
    if (onError) onError(err);
  };

  const authenticateWithBackend = async (userData) => {
    try {
      const response = await fetch(`${config.baseUrl}/auth/clerk-apple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          clerkId: userData.clerkId,
          sessionId: userData.sessionId,
          email: userData.email,
          name: userData.name,
          firstName: userData.firstName,
          lastName: userData.lastName,
          photo: userData.photo,
          phoneNumber: userData.phoneNumber,
          authMethod: 'clerk_apple',
          provider: 'apple',
          platform: Platform.OS,
          role: 'customer',
          appType: 'customer',
          isSignup: isSignup,
        }),
      });

      const raw = await response.text();
      let result;
      try {
        result = raw ? JSON.parse(raw) : {};
      } catch (parseErr) {
        return { success: false, message: 'Server returned unexpected response (non-JSON).', rawResponse: raw, status: response.status };
      }

      // Map status codes to semantic results
      if (response.status === 404) {
        return { success: false, code: 'USER_NOT_FOUND', message: result.message || 'User not found' };
      }
      if (response.status === 409) {
        return { success: false, code: 'USER_EXISTS', message: result.message || 'User exists' };
      }
      if (!response.ok || !result.success) {
        return { success: false, message: result.message || 'Backend authentication failed', raw: result };
      }

      // Success
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Backend authentication error:', error);
      if (!error.message || error.message === 'Network request failed') {
        return { success: false, message: 'Network error. Please check your connection.' };
      }
      return { success: false, message: error.message || 'Server error' };
    }
  };

  const persistLocalData = async (userData, sessionId) => {
    try {
      const store = [
        AsyncStorage.setItem('clerk_user_data', JSON.stringify(userData)),
        AsyncStorage.setItem('clerk_session_id', sessionId),
        AsyncStorage.setItem('auth_method', 'clerk_apple'),
        AsyncStorage.setItem('sign_in_time', new Date().toISOString()),
      ];
      if (userData.email) store.push(AsyncStorage.setItem('user_email', userData.email));
      if (userData.name) store.push(AsyncStorage.setItem('user_name', userData.name));
      await Promise.all(store);
    } catch (e) {
      console.warn('⚠️ Error persisting clerk local data:', e);
    }
  };

  const handleSuccessFlow = async (clerkUserObj, sessionId) => {
    try {
      const userData = {
        clerkId: clerkUserObj.id,
        sessionId,
        id: clerkUserObj.id,
        email: clerkUserObj.emailAddresses?.[0]?.emailAddress || '',
        emailVerified: clerkUserObj.emailAddresses?.[0]?.verification?.status === 'verified',
        name: `${clerkUserObj.firstName || ''} ${clerkUserObj.lastName || ''}`.trim() || clerkUserObj.username || '',
        firstName: clerkUserObj.firstName || '',
        lastName: clerkUserObj.lastName || '',
        username: clerkUserObj.username || '',
        photo: clerkUserObj.imageUrl || '',
        phoneNumber: clerkUserObj.phoneNumbers?.[0]?.phoneNumber || '',
        createdAt: clerkUserObj.createdAt,
        updatedAt: clerkUserObj.updatedAt,
        signInTime: new Date().toISOString(),
      };

      // Persist local clerk info
      await persistLocalData(userData, sessionId);

      console.log('✅ Using Clerk-only authentication (no backend)');

      // Get Clerk JWT token
      const clerkToken = await getToken();
      console.log('🔑 Got Clerk token:', clerkToken ? 'Yes' : 'No');

      // Store Clerk token
      if (clerkToken) {
        await AsyncStorage.setItem('access_token', clerkToken);
        await AsyncStorage.setItem('clerk_token', clerkToken);
      }

      // Store auth method
      await setAuthMethod('clerk_apple');
      
      // Use UserContext to login with Clerk data
      await login({
        accessToken: clerkToken || sessionId,
        user: {
          _id: clerkUserObj.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.photo,
          clerkId: userData.clerkId,
        },
      });

      Toast.show({ type: 'success', text1: 'Welcome!', text2: `Signed in as ${userData.name || userData.email}` });

      const finalResult = {
        success: true,
        user: userData,
        clerkUser: clerkUserObj,
        sessionId,
      };

      if (onSuccess) {
        onSuccess(finalResult);
      } else {
        // Default navigation target: home
        router.replace('home');
      }
    } catch (err) {
      handleAuthError(err);
    }
  };

  const clearSessionAndStorage = async () => {
    try {
      // Attempt to clear Clerk-related secure items and AsyncStorage keys
      try {
        await SecureStore.deleteItemAsync('__clerk_client_jwt');
        await SecureStore.deleteItemAsync('__clerk_session');
        await SecureStore.deleteItemAsync('__clerk_client');
      } catch (secureErr) {
        // non-fatal
      }
      await AsyncStorage.multiRemove([
        'clerk_user_data',
        'clerk_session_id',
        'auth_method',
        'sign_in_time',
        'user_email',
        'user_name',
      ]);
    } catch (e) {
      console.warn('⚠️ Error clearing session storage:', e);
    }
  };

  const handlePress = async () => {
    if (disabled || loading) return;

    setLoading(true);
    try {
      // If a user is already signed in via Clerk, sign out first to force account picker
      try {
        if (isSignedIn) {
          await signOut();
          await clearSessionAndStorage();
          // slight delay to allow Clerk state to settle
          await new Promise((r) => setTimeout(r, 600));
        }
      } catch (signOutErr) {
        console.warn('⚠️ Error signing out existing Clerk session:', signOutErr);
        // continue anyway
      }

      // Start Clerk OAuth flow for Apple
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow();

      if (!createdSessionId) {
        throw new Error('Authentication cancelled or no session created');
      }

      // Activate session
      await setActive({ session: createdSessionId });

      // Wait for the user hook to update with the new session
      let clerkUserObj = null;
      let attempts = 0;
      const maxAttempts = 20;

      while (!clerkUserObj && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 300));
        attempts++;

        // First try to get from signIn/signUp (most reliable)
        const authResult = signIn || signUp;
        if (authResult?.user) {
          clerkUserObj = authResult.user;
          console.log(`✅ Got user from auth result on attempt ${attempts}`);
          break;
        }

        // Then try to get user from the hook (it should update after setActive)
        if (clerkUser) {
          clerkUserObj = clerkUser;
          console.log(`✅ Got user from hook on attempt ${attempts}`);
          break;
        }
      }

      if (!clerkUserObj) {
        throw new Error('No user data received from Clerk after multiple attempts');
      }

      // Process success flow (persist data, call backend, navigate)
      await handleSuccessFlow(clerkUserObj, createdSessionId);
    } catch (error) {
      // Handle specific "already signed in" style errors by trying to clear session and asking user to retry
      const errMsg = String(error?.message || error || '');
      if (errMsg.toLowerCase().includes('already signed in')) {
        try {
          await signOut();
          await clearSessionAndStorage();
          Toast.show({ type: 'info', text1: 'Session cleared', text2: 'Tap the button again to continue' });
        } catch (e) {
          // fallback to normal handler
          handleAuthError(error);
        }
      } else {
        handleAuthError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style, disabled ? { opacity: 0.6 } : null]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <FontAwesome name="apple" size={28} color="white" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E3F6D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appleIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default ClerkAppleSignInButton;

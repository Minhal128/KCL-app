import React, { useState, useCallback } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Image,
  Platform,
  Alert,
} from "react-native";
import { useOAuth, useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import config from "../../config";
import { useUser as useUserContext } from "../../context/UserContext";

const ClerkGoogleSignInButton = ({
  onSuccess,
  onError,
  style,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { user: clerkUser, isLoaded } = useUser();
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
        console.log("✅ Got user from Clerk hook:", clerkUser.id);
        return clerkUser;
      }
      
      console.log("⚠️ Could not get user from Clerk hook after retries");
      return null;
    } catch (error) {
      console.log("⚠️ Error getting user from Clerk:", error.message);
      return null;
    }
  }, [clerkUser]);

  const handleClerkGoogleSignIn = async () => {
    if (disabled || loading) return;

    try {
      setLoading(true);
      console.log("🚀 Starting Clerk Google Sign-In...");

      // Always clear any existing session first to avoid conflicts
      try {
        if (isSignedIn) {
          console.log("⚠️ User already signed in, signing out first...");
          await signOut();
          console.log("✅ Previous session cleared");
          // Wait a moment for the sign out to complete
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (signOutError) {
        console.log(
          "⚠️ Error during sign out (continuing anyway):",
          signOutError.message,
        );
      }

      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        console.log(
          "✅ Clerk OAuth successful, session created:",
          createdSessionId,
        );

        // Set the active session
        await setActive({ session: createdSessionId });

        // Wait for the user hook to update with the new session
        let user = null;
        let attempts = 0;
        const maxAttempts = 20;

        while (!user && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          attempts++;

          // First try to get from signIn/signUp (most reliable)
          const authResult = signIn || signUp;
          if (authResult?.user) {
            user = authResult.user;
            console.log(`✅ Got user from auth result on attempt ${attempts}`);
            break;
          }

          // Then try to get user from the hook (it should update after setActive)
          if (clerkUser) {
            user = clerkUser;
            console.log(`✅ Got user from hook on attempt ${attempts}`);
            break;
          }
        }

        console.log("🔍 Auth result:", {
          hasSignIn: !!signIn,
          hasSignUp: !!signUp,
          hasUser: !!user,
          hasClerkUser: !!clerkUser,
          attempts: attempts,
        });

        if (user) {
          await handleAuthSuccess(user, createdSessionId);
        } else {
          throw new Error(
            "No user data received from Clerk after multiple attempts",
          );
        }
      } else {
        console.log("❌ No session created - user may have cancelled");
        throw new Error("Authentication was cancelled or failed");
      }
    } catch (error) {
      console.error("❌ Clerk Google Sign-In error:", error);
      console.error("❌ Error type:", error?.constructor?.name);
      console.error("❌ Error message:", error?.message);
      console.error("❌ Error string:", String(error));

      // Handle "already signed in" error
      const errorStr = String(error).toLowerCase();
      const errorMsg = (error?.message || "").toLowerCase();

      if (
        errorStr.includes("already signed in") ||
        errorMsg.includes("already signed in")
      ) {
        console.log(
          '🔄 Detected "already signed in" error, clearing session...',
        );

        try {
          // Force sign out
          await signOut();

          // Clear SecureStore items
          try {
            await SecureStore.deleteItemAsync("__clerk_client_jwt");
            await SecureStore.deleteItemAsync("__clerk_session");
            await SecureStore.deleteItemAsync("__clerk_client");
          } catch (secureStoreError) {
            console.log(
              "⚠️ SecureStore clear error:",
              secureStoreError.message,
            );
          }

          console.log("✅ Session cleared successfully");

          Toast.show({
            type: "success",
            text1: "Session Cleared",
            text2: "Please tap sign-in again to continue",
            visibilityTime: 4000,
          });

          setLoading(false);
          return; // Exit without showing error
        } catch (clearError) {
          console.error("❌ Error clearing session:", clearError);
        }
      }

      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = async (clerkUser, sessionId) => {
    try {
      console.log(
        "✅ Processing Clerk user data:",
        JSON.stringify(clerkUser, null, 2),
      );

      // Extract user data from Clerk user object
      const userData = {
        // Clerk data
        clerkId: clerkUser.id,
        sessionId: sessionId,

        // Google OAuth data
        id: clerkUser.id,
        googleId:
          clerkUser.externalAccounts?.[0]?.providerUserId || clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
        emailVerified:
          clerkUser.emailAddresses?.[0]?.verification?.status === "verified",

        // Profile data
        name:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          clerkUser.username ||
          "",
        displayName:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          clerkUser.username ||
          "",
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        username: clerkUser.username || "",
        photo: clerkUser.imageUrl || "",
        photoURL: clerkUser.imageUrl || "",

        // Name parsing for backward compatibility
        givenName: clerkUser.firstName || "",
        familyName: clerkUser.lastName || "",

        // Metadata
        createdAt: clerkUser.createdAt,
        updatedAt: clerkUser.updatedAt,

        // Timestamps
        signInTime: new Date().toISOString(),

        // Auth method
        authMethod: "clerk_google",
        provider: "google",

        // Phone number if available
        phoneNumber: clerkUser.phoneNumbers?.[0]?.phoneNumber || "",
      };

      console.log("✅ Complete user data extracted:", userData);

      // Store comprehensive data locally (only store non-undefined values)
      const storagePromises = [
        AsyncStorage.setItem("clerk_user_data", JSON.stringify(userData)),
        AsyncStorage.setItem("clerk_session_id", sessionId),
        AsyncStorage.setItem("auth_method", "clerk_google"),
        AsyncStorage.setItem("sign_in_time", userData.signInTime),
      ];

      // Only store values that are not undefined or empty
      if (userData.googleId) {
        storagePromises.push(
          AsyncStorage.setItem("google_id", userData.googleId),
        );
      }
      if (userData.email) {
        storagePromises.push(
          AsyncStorage.setItem("user_email", userData.email),
        );
      }
      if (userData.name) {
        storagePromises.push(AsyncStorage.setItem("user_name", userData.name));
      }
      if (userData.clerkId) {
        storagePromises.push(
          AsyncStorage.setItem("clerk_user_id", userData.clerkId),
        );
      }

      await Promise.all(storagePromises);

      // Send to backend for verification and account creation/login
      const backendResult = await authenticateWithBackend(userData);

      if (backendResult.success) {
        // Store backend tokens
        if (backendResult.data?.token) {
          await AsyncStorage.setItem('backend_token', backendResult.data.token);
          await AsyncStorage.setItem('access_token', backendResult.data.token);
        }
        if (backendResult.data?.user?._id) {
          await AsyncStorage.setItem(
            'backend_user_id',
            backendResult.data.user._id,
          );
          await AsyncStorage.setItem('user_id', backendResult.data.user._id);
        }

        // Use UserContext to login
        await login({
          accessToken: backendResult.data.token,
          user: backendResult.data.user,
        });

        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: `Signed in as ${userData.name || userData.email}`,
          visibilityTime: 3000,
        });

        const finalResult = {
          success: true,
          user: userData,
          clerkUser: clerkUser,
          sessionId: sessionId,
          backendData: backendResult.data,
          tokens: {
            clerkSessionId: sessionId,
            backendToken: backendResult.data?.token,
          },
        };

        if (onSuccess) {
          onSuccess(finalResult);
        } else {
          // Default navigation to home
          router.replace('home');
        }
        // Stop further execution so we don't fallthrough to the signup/register fallback
        return;
      } else {
        // Backend authentication failed - throw error
        console.error('❌ Backend authentication failed:', backendResult.message);
        throw new Error(backendResult.message || 'Backend authentication failed');
      }
    } catch (error) {
      console.error("❌ Auth success handling error:", error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (error) => {
    console.error("❌ Authentication error:", error);

    let errorMessage = "Google sign-in failed";
    let errorTitle = "Sign-in Failed";

    // Handle specific Clerk error types
    if (error?.errors && Array.isArray(error.errors)) {
      const clerkError = error.errors[0];
      errorMessage =
        clerkError.message || clerkError.longMessage || errorMessage;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    // Handle "already signed in" error
    if (errorMessage.toLowerCase().includes("already signed in")) {
      errorTitle = "Session Cleared";
      errorMessage = "Please tap the sign-in button again";
      // Don't show error toast for this case, just info
      return;
    }

    // Handle common error scenarios
    if (errorMessage.toLowerCase().includes("cancelled")) {
      errorMessage = "Sign-in was cancelled";
      errorTitle = "Cancelled";
    } else if (errorMessage.toLowerCase().includes("network")) {
      errorMessage = "Network error. Please check your internet connection.";
    }

    Toast.show({
      type: "error",
      text1: errorTitle,
      text2: errorMessage,
      visibilityTime: 5000,
    });

    if (onError) {
      onError(errorMessage);
    }

    setLoading(false);
  };

  // Authenticate with your backend
  const authenticateWithBackend = async (clerkUserData) => {
    try {
      console.log("🔄 Authenticating with backend...");
      console.log("📤 Sending user data:", {
        email: clerkUserData.email,
        name: clerkUserData.name,
        clerkId: clerkUserData.clerkId,
      });

      const response = await fetch(`${config.baseUrl}/auth/clerk-google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // Clerk data
          clerkId: clerkUserData.clerkId,
          sessionId: clerkUserData.sessionId,

          // Google OAuth data
          googleId: clerkUserData.googleId || clerkUserData.id,

          // Profile data
          email: clerkUserData.email,
          emailVerified: clerkUserData.emailVerified,
          name: clerkUserData.name,
          displayName: clerkUserData.displayName || clerkUserData.name,
          firstName: clerkUserData.firstName,
          lastName: clerkUserData.lastName,
          username: clerkUserData.username,
          photo: clerkUserData.photo,
          photoURL: clerkUserData.photoURL || clerkUserData.photo,

          // Name components for backward compatibility
          givenName: clerkUserData.givenName || clerkUserData.firstName,
          familyName: clerkUserData.familyName || clerkUserData.lastName,

          // Phone number
          phoneNumber: clerkUserData.phoneNumber,

          // Metadata
          createdAt: clerkUserData.createdAt,
          updatedAt: clerkUserData.updatedAt,
          signInTime: clerkUserData.signInTime,

          // App specific
          authMethod: "clerk_google",
          provider: "google",
          platform: Platform.OS,
          appVersion: config.appVersion,
          role: "customer",
          userType: "customer",
          appType: "customer",
          forceRoleUpdate: true,
        }),
      });

      console.log("📡 Backend response status:", response.status);

      // Read raw text once to avoid 'Already read' errors, then parse
      const raw = await response.text();
      let result;
      try {
        result = raw ? JSON.parse(raw) : {};
      } catch (parseError) {
        return {
          success: false,
          message: "Server returned unexpected response (non-JSON).",
          rawResponse: raw,
          status: response.status,
        };
      }

      console.log("📥 Backend response:", result);

      if (response.ok && result.success) {
        // Store backend auth data
        if (result.token) {
          await AsyncStorage.setItem("access_token", result.token);
          await AsyncStorage.setItem("backend_auth_token", result.token);
        }

        if (result.user?._id) {
          await AsyncStorage.setItem("user_id", result.user._id);
          await AsyncStorage.setItem("backend_user_id", result.user._id);
        }

        if (result.user) {
          await AsyncStorage.setItem("user_data", JSON.stringify(result.user));
          await AsyncStorage.setItem(
            "backend_user_data",
            JSON.stringify(result.user),
          );
        }

        console.log("✅ Backend authentication successful");
        return { success: true, data: result };
      } else {
        throw new Error(result.message || "Backend authentication failed");
      }
    } catch (error) {
      console.error("❌ Backend authentication error:", error);

      // Handle network errors
      if (!error.message || error.message === "Network request failed") {
        return {
          success: false,
          message:
            "Network error. Please check your internet connection and try again.",
        };
      }

      return { success: false, message: error.message };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={handleClerkGoogleSignIn}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Image
          source={{
            uri: "https://developers.google.com/identity/images/g-logo.png",
          }}
          style={styles.googleIcon}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E3F6D",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    width: 28,
    height: 28,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default ClerkGoogleSignInButton;

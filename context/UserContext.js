// context/UserContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userAPI, authAPI } from "../services/api";

const UserContext = createContext({
  user: null,
  loadingUser: true,
  login: async () => {},
  logout: async () => {},
  fetchUserProfile: async () => {},
});

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [initialised, setInitialised] = useState(false);

  // Tokens are now handled by the API service interceptors

  // load stored tokens & user on app start
  useEffect(() => {
    const init = async () => {
      try {
        setLoadingUser(true);
        const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);

        if (token) {
          // option 1: if you have cached user, set it immediately for UX
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          // still validate with backend to ensure token valid and fetch fresh profile
          await fetchUserProfile();
        } else if (storedUser) {
          // if token missing but user cached, set cached user (less secure)
          setUser(JSON.parse(storedUser));
        }

        setInitialised(true);
      } catch (err) {
        console.error("UserProvider init error:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch profile from backend and persist user & token if provided
  const fetchUserProfile = useCallback(async () => {
    try {
      console.log("📡 Fetching user profile...");
      setLoadingUser(true);
      
      // Check if we have a valid backend token (not a Clerk session ID)
      const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      const authMethod = await AsyncStorage.getItem("auth_method");
      
      // If using Clerk auth (no backend token), skip backend fetch and use cached user
      if (authMethod === "clerk_google" || authMethod === "clerk_apple") {
        console.log("📡 Using Clerk authentication, skipping backend profile fetch");
        const storedUser = await AsyncStorage.getItem(USER_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log("✅ Using cached Clerk user data");
        }
        setLoadingUser(false);
        return;
      }
      
      const res = await userAPI.getProfile();
      console.log("📡 Profile response:", {
        hasUser: !!res.data?.user,
        userName: res.data?.user?.name,
        userAvatar: res.data?.user?.avatar,
      });
      
      if (res.data?.user) {
        setUser(res.data.user);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        console.log("✅ User profile fetched and stored:", res.data.user.name);
      } else {
        // backend didn't return a user; clear local
        console.log("❌ No user in response, clearing local data");
        setUser(null);
        await AsyncStorage.removeItem(USER_KEY);
        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    } catch (error) {
      console.log(
        "❌ fetchUserProfile failed:",
        error?.response?.data || error.message
      );
      // For Clerk auth, keep the user data even if backend fetch fails
      const authMethod = await AsyncStorage.getItem("auth_method");
      if (authMethod === "clerk_google" || authMethod === "clerk_apple") {
        console.log("📡 Clerk auth detected, keeping cached user data despite backend error");
        const storedUser = await AsyncStorage.getItem(USER_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // Called after login success: store tokens + user
  const login = useCallback(
    async ({ accessToken, refreshToken, user: userData }) => {
      try {
        console.log("🔐 UserContext login called with:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasUser: !!userData,
          userName: userData?.name,
          userAvatar: userData?.avatar,
        });

        if (accessToken) {
          await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
          console.log("✅ Access token stored");
        }
        if (refreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
          console.log("✅ Refresh token stored");
        }
        if (userData) {
          setUser(userData);
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
          console.log("✅ User data stored:", userData.name);
        }
      } catch (err) {
        console.error("❌ login persistence error:", err);
      }
    },
    []
  );

  // Helper to set auth method (called from Clerk sign-in)
  const setAuthMethod = useCallback(async (method) => {
    try {
      await AsyncStorage.setItem("auth_method", method);
      console.log("✅ Auth method stored:", method);
    } catch (err) {
      console.error("❌ Error storing auth method:", err);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // try inform backend
      await authAPI.signOut();
    } catch (err) {
      // ignore error but log it
      console.error("logout request error:", err?.message || err);
    } finally {
      setUser(null);
      await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      logout,
      fetchUserProfile,
      setAuthMethod,
      loadingUser,
      initialised,
    }),
    [user, login, logout, fetchUserProfile, setAuthMethod, loadingUser, initialised]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);

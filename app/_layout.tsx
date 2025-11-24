import "react-native-gesture-handler";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
// Prop debug helper - logs when components receive string "true"/"false" for boolean-like props
import "../utils/propDebug";
import { UserProvider, useUser } from "../context/UserContext";
import { useEffect } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

// Clerk token cache using SecureStore
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Small helper component that calls fetchUserProfile() after the user provider is mounted.
function FetchProfileOnMount() {
  const { fetchUserProfile } = useUser();

  useEffect(() => {
    // best-effort fetch; UserProvider should handle auth/token state
    if (fetchUserProfile) fetchUserProfile();
  }, [fetchUserProfile]);

  return null;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return null;

  return (
    <ClerkProvider
      publishableKey="pk_test_YWJvdmUtZ29yaWxsYS04OC5jbGVyay5hY2NvdW50cy5kZXYk"
      tokenCache={tokenCache}
    >
      <ThemeProvider value={DarkTheme}>
        <StripeProvider publishableKey="pk_test_51QhxcRAtSFeuCmPAJW6zwkpg6sFPGFpU4i5W1RAijd7bUcKYoWAalsIx3xNn4WToyDxEYKmHNzSOsHb14PXH8k1U002Cj7ZQg3">
          <UserProvider>
            <FetchProfileOnMount />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                animationTypeForReplace: "push",
                contentStyle: { backgroundColor: "rgb(1, 1, 1)" },
              }}
            />
          </UserProvider>
        </StripeProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ClerkProvider>
  );
}
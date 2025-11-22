import { useEffect } from "react";
import { router, Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";

const ProtectRoute = ({ children, user, redirect = "/login" }) => {
  useEffect(() => {
    if (!user) {
      router.replace(redirect);
    }
  }, [user]);

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0F294F",
        }}
      >
        <ActivityIndicator size="large" color="#129B7F" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {children}
    </>
  );
};

export default ProtectRoute;

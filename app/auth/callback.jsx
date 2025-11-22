import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthCallback() {
  const { token, name } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const saveAuth = async () => {
      if (token) {
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("userName", name || "");
        router.replace("/home"); // or wherever your main page is
      } else {
        router.replace("/login?error=invalid_token");
      }
    };

    saveAuth();
  }, [token]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#21477C",
      }}
    >
      <ActivityIndicator size="large" color="#fff" />
      <Text style={{ color: "white", marginTop: 10 }}>
        Logging you in, please wait...
      </Text>
    </View>
  );
}

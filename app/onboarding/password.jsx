import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { userAPI } from "../../services/api";

const Password = () => {
  // State to toggle password visibility for the first input
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  // State to toggle password visibility for the confirm input
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!password || !confirm)
      return Alert.alert("Error", "Please enter and confirm your password.");

    if (password.length < 8)
      return Alert.alert(
        "Error",
        "Password must be at least 8 characters long."
      );

    if (password !== confirm)
      return Alert.alert("Error", "Passwords do not match.");

    try {
      setLoading(true);
      const res = await userAPI.setPassword({ password });

      if (res.data.success) {
        Alert.alert("Success", "Password set successfully!");
        router.push("/onboarding/profile_image");
      }
    } catch (err) {
      console.log("Password API Error:", err?.response?.data || err.message);
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraScrollHeight={50}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        {/* Header / Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Title and Subtitle */}
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Create a new password</Text>
          <Text style={styles.subtitle}>
            Choose a secure password that&apos;s at least 8 characters long
          </Text>
        </View>

        {/* --- New Password Input --- */}
        <Text style={styles.inputLabel}>New password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#B4C1D4"
            secureTextEntry={!isNewPasswordVisible} // Toggle based on state
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)} // Toggle function
          >
            <FontAwesome5
              name={isNewPasswordVisible ? "eye" : "eye-slash"} // Change icon based on state
              size={18}
              color="#B4C1D4"
            />
          </TouchableOpacity>
        </View>

        {/* --- Confirm New Password Input --- */}
        <Text style={styles.inputLabel}>Confirm New password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#B4C1D4"
            secureTextEntry={!isConfirmPasswordVisible} // Toggle based on state
            value={confirm}
            onChangeText={setConfirm}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            } // Toggle function
          >
            <FontAwesome5
              name={isConfirmPasswordVisible ? "eye" : "eye-slash"} // Change icon based on state
              size={18}
              color="#B4C1D4"
            />
          </TouchableOpacity>
        </View>

        {/* Continue Button (Green Gradient) */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={loading}
          style={styles.continueButton}
        >
          <LinearGradient
            colors={["#18B451", "#08B451"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientButton}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F294F",
    paddingHorizontal: 30,
    paddingTop: 130,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 30,
    backgroundColor: "#1E3F6D",
    padding: 8,
    borderRadius: 50,
    zIndex: 10,
  },
  headerTextContainer: {
    width: "100%",
    marginBottom: 40,
    paddingLeft: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#B4C1D4",
  },
  inputLabel: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    marginBottom: 10,
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3F6D",
    borderRadius: 15,
    paddingHorizontal: 20,
    height: 55,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  eyeIcon: {
    paddingLeft: 10,
    paddingVertical: 5, // make the touch target easier
  },
  continueButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 60, // Space before the button
    shadowColor: "#18B451",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10,
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Password;

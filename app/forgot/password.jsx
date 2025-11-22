import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PasswordSuccessModal from "../../components/PasswordSuccessModal";
import { router, useLocalSearchParams } from "expo-router";
import { authAPI } from "../../services/api";

const SetNewPassword = () => {
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [showSucessModal, setShowSucessModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useLocalSearchParams();

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.resetPassword({
        token,
        newPassword,
      });

      if (response.data.success) {
        setShowSucessModal(true);
        // setTimeout(() => {
        //   setShowSucessModal(false);
        //   router.push("/login");
        // }, 2000);
      } else {
        Alert.alert("Error", response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to reset password"
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
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Set a new password</Text>
          <Text style={styles.subtitle}>
            Choose a secure password that's at least 8 characters long
          </Text>
        </View>

        <Text style={styles.inputLabel}>New password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#B4C1D4"
            secureTextEntry={!isNewPasswordVisible}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
          >
            <FontAwesome5
              name={isNewPasswordVisible ? "eye" : "eye-slash"}
              size={18}
              color="#B4C1D4"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.inputLabel}>Confirm New password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#B4C1D4"
            secureTextEntry={!isConfirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            }
          >
            <FontAwesome5
              name={isConfirmPasswordVisible ? "eye" : "eye-slash"}
              size={18}
              color="#B4C1D4"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleResetPassword}
          disabled={loading}
          style={styles.continueButton}
        >
          <LinearGradient
            colors={["#18B451", "#08B451"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {showSucessModal && (
        <PasswordSuccessModal
          isVisible={showSucessModal}
          hide={() => setShowSucessModal(false)}
        />
      )}
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
    paddingVertical: 5,
  },
  continueButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 60,
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

export default SetNewPassword;

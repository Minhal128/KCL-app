import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { authAPI } from "../../services/api";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";

const ResetEmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your email address");
      setShowErrorModal(true);
      return;
    }

    try {
      setLoading(true);

      const res = await authAPI.forgotPassword(email);

      setLoading(false);

      // ✅ On success
      setShowSuccessModal(true);
    } catch (err) {
      setLoading(false);

      console.log(err.response?.data || err.message);
      setErrorMessage(err.response?.data?.message || "Failed to send reset email");
      setShowErrorModal(true);
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
        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter the email associated with your account
          </Text>
        </View>

        <Text style={styles.inputLabel}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            placeholderTextColor="#B4C1D4"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.continueButton}
          disabled={loading}
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

        <SuccessModal
          visible={showSuccessModal}
          title="Success"
          message="Reset link sent to your email!"
          buttonText="OK"
          onClose={() => {
            setShowSuccessModal(false);
            router.push({
              pathname: "/forgot/otp",
              params: { email },
            });
          }}
        />

        <ErrorModal
          visible={showErrorModal}
          title="Error"
          message={errorMessage}
          buttonText="OK"
          onClose={() => setShowErrorModal(false)}
        />
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

export default ResetEmail;

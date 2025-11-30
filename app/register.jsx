import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import apple_logo from "../assets/images/auth/apple_logo.png";
import fb_logo from "../assets/images/auth/fb_logo.png";
import google_logo from "../assets/images/auth/google_logo.png";
import header_bg from "../assets/images/auth/header_bg.png";
import { useState } from "react";
import { authAPI } from "../services/api";
import ClerkGoogleSignInButton from "../components/auth/ClerkGoogleSignInButton";
import ClerkAppleSignInButton from "../components/auth/ClerkAppleSignInButton";
import ClerkFacebookSignInButton from "../components/auth/ClerkFacebookSignInButton";
import { BACKEND_URI } from "../constants/config";
import axios from "axios";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";

const Register = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      setShowErrorModal(true);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      setShowErrorModal(true);
      return;
    }

    try {
      setLoading(true);
      console.log("📧 Sending OTP to:", email.trim());
      console.log("🌐 Backend URI:", BACKEND_URI);
      
      // Test connection first
      try {
        console.log("🧪 Testing backend connection...");
        const testRes = await axios.get(`${BACKEND_URI}/auth/test`, {
          timeout: 5000
        });
        console.log("✅ Backend test successful:", testRes.data);
      } catch (testErr) {
        console.error("❌ Backend test failed:", testErr.message);
        throw new Error("Cannot connect to server. Please check your network.");
      }
      
      const res = await authAPI.sendOTP(email.trim());

      console.log("✅ OTP Response:", res.data);
      if (res.data?.success) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(res.data?.message || "Failed to send OTP");
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error("❌ OTP Error Full:", err);
      console.error("❌ OTP Error Response:", err?.response);
      console.error("❌ OTP Error Data:", err?.response?.data);
      console.error("❌ OTP Error Message:", err.message);
      
      let errMsg = "Network error. Please check your connection.";
      
      if (err?.response?.data?.message) {
        errMsg = err.response.data.message;
      } else if (err.message) {
        errMsg = err.message;
      }
      
      setErrorMessage(errMsg);
      setShowErrorModal(true);
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
      <ImageBackground
        source={header_bg}
        resizeMode="cover"
        style={styles.headerBackground}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Hello there,</Text>
          <Text style={styles.title}>Welcome to KCL movies</Text>
          <Text style={styles.subtitle}>
            Sign in to start enjoying your movies
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.formContainer}>
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
          style={styles.continueButton}
          onPress={handleSendOtp}
          disabled={loading}
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

        <Text style={styles.orSignIn}>Or sign up with</Text>

        <View style={styles.socialButtonsContainer}>
          <ClerkGoogleSignInButton 
            style={styles.socialButton}
          />
          <ClerkAppleSignInButton 
            isSignup={true}
            style={styles.socialButton}
          />
          <ClerkFacebookSignInButton 
            isSignup={true}
            style={styles.socialButton}
          />
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("login")}>
            <Text style={styles.signUpLink}>Sign in</Text>
          </TouchableOpacity>
        </View>

        <SuccessModal
          visible={showSuccessModal}
          title="Success"
          message="OTP sent successfully! Check your email."
          buttonText="OK"
          onClose={() => {
            setShowSuccessModal(false);
            router.push(`/onboarding?email=${encodeURIComponent(email.trim())}`);
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
  headerBackground: {
    width: "100%",
    height: 250,
    paddingBottom: 20,
    position: "relative",
  },
  headerContent: {
    paddingHorizontal: 30,
    paddingTop: 100,
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 30,
    backgroundColor: "#21477C",
    padding: 8,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "#B4C1D4",
    marginTop: 5,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#0F294F",
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
  },
  inputLabel: {
    fontSize: 16,
    color: "white",
    marginBottom: 8,
    marginTop: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3F6D",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  eyeIcon: {
    paddingLeft: 10,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: "#B4C1D4",
    fontSize: 14,
  },
  continueButton: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#18B451",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10,
    marginTop: 30,
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
  orSignIn: {
    textAlign: "center",
    color: "#B4C1D4",
    fontSize: 16,
    marginVertical: 30,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 40,
    marginTop: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1E3F6D",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  signUpText: {
    color: "#B4C1D4",
    fontSize: 15,
  },
  signUpLink: {
    color: "#08B451",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default Register;

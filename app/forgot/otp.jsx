import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authAPI } from "../../services/api";

const OTP_LENGTH = 6;

const ResetOtpVerification = () => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (text, index) => {
    if (isNaN(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < OTP_LENGTH - 1) inputRefs.current[index + 1].focus();
    if (!text && index > 0) inputRefs.current[index - 1].focus();
  };

  const renderOtpInputs = () =>
    otp.map((digit, index) => (
      <TextInput
        key={index}
        ref={(el) => (inputRefs.current[index] = el)}
        style={[
          styles.otpInput,
          digit ? styles.otpInputFilled : styles.otpInputEmpty,
        ]}
        keyboardType="number-pad"
        maxLength={1}
        value={digit}
        onChangeText={(text) => handleOtpChange(text, index)}
        onKeyPress={({ nativeEvent }) => {
          if (nativeEvent.key === "Backspace" && !digit && index > 0) {
            inputRefs.current[index - 1].focus();
          }
        }}
      />
    ));

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== OTP_LENGTH) {
      Alert.alert("Error", "Please enter the full 6-digit OTP code.");
      return;
    }

    try {
      setLoading(true);
      const res = await authAPI.verifyForgotPasswordOTP({
        email,
        otp: enteredOtp,
      });

      setLoading(false);

      Alert.alert("Success", res.data?.message || "OTP verified!");

      router.push({
        pathname: "/forgot/password",
        params: { token: res.data.token },
      });
    } catch (err) {
      setLoading(false);
      console.log(err.response?.data || err.message);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Invalid or expired OTP"
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.headerTextContainer}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          Enter the code sent to your email address
        </Text>
      </View>

      <View style={styles.otpContainer}>{renderOtpInputs()}</View>

      <TouchableOpacity
        onPress={handleVerifyOtp}
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

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive code? </Text>
        <TouchableOpacity>
          <Text style={styles.resendLink}>Resend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F294F",
    paddingHorizontal: 30,
    paddingTop: 130,
    alignItems: "center",
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
    marginBottom: 50,
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 40,
  },
  otpInput: {
    width: 45,
    height: 50,
    fontSize: 20,
    textAlign: "center",
    borderRadius: 60,
    color: "white",
  },
  otpInputEmpty: {
    backgroundColor: "#1E3F6D",
    borderWidth: 1,
    borderColor: "#1E3F6D",
  },
  otpInputFilled: {
    backgroundColor: "#1E3F6D",
    borderWidth: 1,
    borderColor: "white",
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
    marginBottom: 30,
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
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  resendText: {
    color: "#B4C1D4",
    fontSize: 15,
  },
  resendLink: {
    color: "#08B451",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default ResetOtpVerification;

import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ErrorModal = ({
  visible,
  title = "Error",
  message = "Something went wrong",
  buttonText = "OK",
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Gradient Border Effect */}
          <LinearGradient
            colors={["#FF6B6B", "#EE5A5A", "#1E3F6D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.modalContent}>
              {/* Error Icon with Glow */}
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={["#FF6B6B", "#EE5A5A"]}
                  style={styles.iconGradient}
                >
                  <Ionicons name="close" size={32} color="white" />
                </LinearGradient>
                {/* Glow effect */}
                <View style={styles.iconGlow} />
              </View>

              {/* Title */}
              <Text style={styles.title}>{title}</Text>

              {/* Message */}
              <Text style={styles.message}>{message}</Text>

              {/* Divider */}
              <View style={styles.divider} />

              {/* OK Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={onClose}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FF6B6B", "#EE5A5A"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>{buttonText}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 41, 79, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    maxWidth: 340,
    borderRadius: 24,
    overflow: "hidden",
    // Shadow
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },
  gradientBorder: {
    padding: 2,
    borderRadius: 24,
  },
  modalContent: {
    backgroundColor: "#0F294F",
    borderRadius: 22,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
    marginBottom: 20,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  iconGlow: {
    position: "absolute",
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 40,
    backgroundColor: "rgba(255, 107, 107, 0.2)",
    zIndex: -1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#B4C1D4",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(30, 63, 109, 0.8)",
    marginVertical: 24,
  },
  button: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default ErrorModal;

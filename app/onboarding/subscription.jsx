import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import subscription_bg from "../../assets/images/auth/subscription_bg.png";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { BACKEND_URI } from "../../constants/config";

const PLAN_DETAILS = {
  "Basic Plan": {
    price: "$9",
    features: [
      "Watch on 1 screen at a time",
      "Good video quality",
      "Download on 1 device",
      "Affordable monthly price",
    ],
  },
  Standard: {
    price: "$12",
    features: [
      "Watch on 2 screens simultaneously",
      "Full HD available",
      "Download on 2 devices",
      "Great for couples or roommates",
    ],
  },
  Premium: {
    price: "$15",
    features: [
      "Watch on 4 screens at once",
      "Ultra HD + HDR",
      "Download on 4 devices",
      "Best for families and binge-watchers",
    ],
  },
};

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState("Standard");
  const currentPlan = PLAN_DETAILS[selectedPlan];
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();

  const initializeGooglePay = async () => {
    // Google Pay initialization - temporarily disabled for testing
    console.log("Google Pay initialization skipped");
  };
  
  useEffect(() => {
    // Temporarily disabled Google Pay initialization
    // initializeGooglePay();
  }, []);

  const handleSkip = () => {
    router.push("/home");
  };

  // 🔹 Handle payment - temporarily disabled, just skip to home
  const handlePayment = () => {
    Alert.alert("Success", "Subscription setup skipped for testing!");
    router.push("/home");
  };

  const renderPlanTab = (planName) => {
    const isSelected = selectedPlan === planName;
    const content = <Text style={styles.planTabText}>{planName}</Text>;

    return isSelected ? (
      <LinearGradient
        key={planName}
        colors={["#18B451", "#08B451"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.selectedPlanTab}
      >
        {content}
      </LinearGradient>
    ) : (
      <TouchableOpacity
        key={planName}
        style={styles.unselectedPlanTab}
        onPress={() => setSelectedPlan(planName)}
      >
        {content}
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={subscription_bg}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            Choose the plan that{"\n"}best works for you
          </Text>
          <Text style={styles.subtitle}>
            Let&apos;s help you personalize your experience
          </Text>
        </View>

        <View style={styles.planTabsContainer}>
          {Object.keys(PLAN_DETAILS).map(renderPlanTab)}
        </View>

        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>{selectedPlan}</Text>
            <Text style={styles.planPrice}>
              {currentPlan.price}
              <Text style={styles.planMonth}>/Month</Text>
            </Text>
          </View>

          {currentPlan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#08B451"
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.trialButton}>
            <Text style={styles.trialText}>Try 3 days free trial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePayment}
            style={styles.continueButton}
            disabled={loading}
          >
            <LinearGradient
              colors={["#18B451", "#08B451"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>
                {loading ? "Processing..." : "Continue with Google Pay"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#0F294F",
  },
  container: {
    flex: 1,
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
    marginBottom: 30,
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
  planTabsContainer: {
    flexDirection: "row",
    backgroundColor: "#1E3F6D",
    borderRadius: 30,
    padding: 5,
    marginBottom: 30,
  },
  selectedPlanTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  unselectedPlanTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  planTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  planCard: {
    backgroundColor: "#1E3F6D",
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 20,
    marginBottom: 30,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  planName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  planPrice: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  planMonth: {
    fontSize: 16,
    fontWeight: "500",
    color: "#B4C1D4",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#21477C",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  trialButton: {
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  trialText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  continueButton: {
    width: "100%",
    borderRadius: 30,
    marginTop: 20,
    overflow: "hidden",
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
  skipButton: {
    marginTop: 20,
    alignItems: "center",
  },
  skipText: {
    color: "#B4C1D4",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default Subscription;

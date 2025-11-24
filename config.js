import Constants from "expo-constants";

// Get backend URI from app.config.js extra
const BACKEND_URI = Constants.expoConfig.extra.BACKEND_URI;

// Clerk configuration
const CLERK_PUBLISHABLE_KEY = "pk_test_YWJvdmUtZ29yaWxsYS04OC5jbGVyay5hY2NvdW50cy5kZXYk";

const config = {
  baseUrl: BACKEND_URI,
  clerkPublishableKey: CLERK_PUBLISHABLE_KEY,
  
  // OAuth endpoints
  clerkGoogleEndpoint: `${BACKEND_URI}/auth/clerk-google`,
  clerkAppleEndpoint: `${BACKEND_URI}/auth/clerk-apple`,
  
  // App configuration
  appName: "KCL",
  appVersion: "1.0.0",
  appType: "rider",
  userType: "customer",
};

export default config;

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
  clerkFacebookEndpoint: `${BACKEND_URI}/auth/clerk-facebook`,
  
  // App configuration
  appName: "KCL",
  appVersion: "1.0.0",
  appType: "rider",
  userType: "customer",
};

// Log configuration on load
console.log("🔧 Config loaded:");
console.log("  - BACKEND_URI:", BACKEND_URI);
console.log("  - baseUrl:", config.baseUrl);

export default config;

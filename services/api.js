import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKEND_URI } from "../constants/config";

// Create axios instance
const api = axios.create({
  baseURL: `${BACKEND_URI}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      await AsyncStorage.multiRemove([
        "access_token",
        "refresh_token",
        "user",
      ]);
    }
    return Promise.reject(error);
  }
);

// ==================== AUTHENTICATION APIs ====================

export const authAPI = {
  // Sign up user
  signUp: (formData) => {
    return api.post("/auth/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Sign in user
  signIn: (credentials) => {
    return api.post("/auth/signin", credentials);
  },

  // Sign out user
  signOut: () => {
    return api.get("/auth/signout");
  },

  // Forgot password
  forgotPassword: (email) => {
    return api.post("/auth/forgot-password", { email });
  },

  // Verify OTP for forgot password
  verifyForgotPasswordOTP: (data) => {
    return api.post("/auth/verify-otp", data);
  },

  // Reset password
  resetPassword: (data) => {
    return api.post("/auth/reset-password", data);
  },

  // Send OTP for email verification
  sendOTP: (email) => {
    return api.post("/auth/send-otp", { email });
  },

  // Verify email OTP
  verifyEmailOTP: (data) => {
    return api.post("/auth/verify-email", data);
  },

  // Onboarding user
  onboarding: (data) => {
    return api.post("/auth/onboarding", data);
  },

  // Google OAuth
  googleAuth: () => {
    return `${BACKEND_URI}/auth/google`;
  },

  // Facebook OAuth
  facebookAuth: () => {
    return `${BACKEND_URI}/auth/facebook`;
  },
};

// ==================== USER APIs ====================

export const userAPI = {
  // Get user profile
  getProfile: () => {
    return api.get("/user");
  },

  // Update user profile
  updateProfile: (formData) => {
    return api.post("/user/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Update avatar
  updateAvatar: (formData) => {
    return api.put("/user/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Set password
  setPassword: (data) => {
    return api.put("/user/password", data);
  },

  // Set interests
  setInterests: (data) => {
    return api.put("/user/interests", data);
  },

  // Set language
  setLanguage: (data) => {
    return api.put("/user/language", data);
  },
};

// ==================== PROFILE APIs ====================

export const profileAPI = {
  // Create profile
  createProfile: (formData) => {
    return api.post("/profiles/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Get all profiles
  getProfiles: () => {
    return api.get("/profiles");
  },

  // Verify profile PIN
  verifyProfilePin: (data) => {
    return api.post("/profiles/verify-pin", data);
  },

  // Edit video quality
  editVideoQuality: (data) => {
    return api.put("/profiles/video-quality", data);
  },

  // Get watchlist
  getWatchlist: () => {
    return api.get("/profiles/watchlist");
  },
};

// ==================== TWO-FACTOR AUTHENTICATION APIs ====================

export const twoFactorAPI = {
  // Enable 2FA
  enable2FA: () => {
    return api.post("/2fa/enable");
  },

  // Verify 2FA
  verify2FA: (data) => {
    return api.post("/2fa/verify", data);
  },

  // Disable 2FA
  disable2FA: (data) => {
    return api.post("/2fa/disable", data);
  },

  // Verify 2FA during login
  verifyLogin2FA: (data) => {
    return api.post("/2fa/login-verify", data);
  },
};

// ==================== SUBSCRIPTION APIs ====================

export const subscriptionAPI = {
  // Activate subscription
  activateSubscription: (data) => {
    return api.post("/payments/subscribe", data);
  },

  // Create trial subscription
  createTrialSubscription: (data) => {
    return api.post("/payments/trial", data);
  },

  // Get subscription by ID
  getSubscriptionById: (id) => {
    return api.get(`/payments/${id}`);
  },

  // Create payment intent
  createPaymentIntent: (data) => {
    return api.post("/payments/create-payment-intent", data);
  },

  // Confirm payment
  confirmPayment: (data) => {
    return api.post("/payments/confirm", data);
  },
};

// ==================== DEVICE APIs ====================

export const deviceAPI = {
  // Register device
  registerDevice: (data) => {
    return api.post("/devices/register", data);
  },

  // Remove device
  removeDevice: (data) => {
    return api.post("/devices/remove", data);
  },

  // Get all devices and limits status
  getLimitsStatus: () => {
    return api.post("/devices/all");
  },
};

// ==================== CONTENT APIs ====================

export const contentAPI = {
  // Get all content with filters
  getAllContent: (params) => {
    return api.get("/content", { params });
  },

  // Get content by ID
  getContentById: (id) => {
    return api.get(`/content/${id}`);
  },

  // Get featured content
  getFeaturedContent: (limit = 10) => {
    return api.get("/content/featured", { params: { limit } });
  },

  // Get content by genre
  getContentByGenre: (genre, limit = 20) => {
    return api.get(`/content/genre/${genre}`, { params: { limit } });
  },

  // Get all genres
  getAllGenres: () => {
    return api.get("/content/genres");
  },
};

// ==================== WATCHLIST APIs ====================

export const watchlistAPI = {
  // Get watchlist
  getWatchlist: () => {
    return api.get("/profiles/watchlist");
  },

  // Add to watchlist
  addToWatchlist: (contentId) => {
    return api.post("/profiles/watchlist/add", { contentId });
  },

  // Remove from watchlist
  removeFromWatchlist: (contentId) => {
    return api.delete("/profiles/watchlist/remove", { data: { contentId } });
  },
};

// ==================== NOTIFICATION APIs ====================

export const notificationAPI = {
  // Send notification (admin/system use)
  sendNotification: (data) => {
    return api.post("/notifications/send", data);
  },

  // Get user notifications
  getUserNotifications: (params) => {
    return api.get("/notifications", { params });
  },

  // Get unread count
  getUnreadCount: () => {
    return api.get("/notifications/unread-count");
  },

  // Mark notification as read
  markAsRead: (id) => {
    return api.patch(`/notifications/${id}/read`);
  },

  // Mark all as read
  markAllAsRead: () => {
    return api.patch("/notifications/mark-all-read");
  },

  // Delete notification
  deleteNotification: (id) => {
    return api.delete(`/notifications/${id}`);
  },
};

// ==================== SUPPORT APIs ====================

export const supportAPI = {
  // Create support ticket
  createTicket: (data) => {
    return api.post("/support/ticket", data);
  },

  // Get user tickets
  getUserTickets: (params) => {
    return api.get("/support/tickets", { params });
  },

  // Get ticket by ID
  getTicketById: (id) => {
    return api.get(`/support/ticket/${id}`);
  },

  // Add reply to ticket
  addReply: (id, data) => {
    return api.post(`/support/ticket/${id}/reply`, data);
  },

  // Update ticket status
  updateTicketStatus: (id, status) => {
    return api.patch(`/support/ticket/${id}/status`, { status });
  },

  // Get ticket statistics
  getTicketStats: () => {
    return api.get("/support/tickets/stats");
  },
};

// ==================== PAYMENT APIs (Google Pay / Apple Pay / Stripe) ====================

export const paymentAPI = {
  // Create payment intent (supports Google Pay, Apple Pay, Card)
  createPaymentIntent: (data) => {
    return api.post("/payment/create-intent", data);
  },

  // Confirm payment
  confirmPayment: (data) => {
    return api.post("/payment/confirm", data);
  },

  // Create checkout session (Stripe hosted)
  createCheckoutSession: (data) => {
    return api.post("/payment/create-checkout-session", data);
  },

  // Get all transactions
  getTransactions: (params) => {
    return api.get("/payment/transactions", { params });
  },

  // Get transaction by ID
  getTransactionById: (id) => {
    return api.get(`/payment/transaction/${id}`);
  },

  // Get transaction statistics
  getTransactionStats: () => {
    return api.get("/payment/transactions/stats");
  },
};

// ==================== STRIPE WEBHOOK (For reference, handled by backend) ====================
// Note: Stripe webhooks are handled directly by the backend
// This is not called from the frontend

export default api;

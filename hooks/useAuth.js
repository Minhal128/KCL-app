import { useState } from "react";
import { Alert } from "react-native";
import { authAPI } from "../services/api";
import { useUser } from "../context/UserContext";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { login, logout } = useUser();

  const signUp = async (formData) => {
    setLoading(true);
    try {
      const response = await authAPI.signUp(formData);
      if (response.data?.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Sign up failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials) => {
    setLoading(true);
    try {
      const response = await authAPI.signIn(credentials);
      if (response.data) {
        await login(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, message: "Invalid credentials" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Sign in failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authAPI.signOut();
      await logout();
      return { success: true };
    } catch (error) {
      // Still logout locally even if API fails
      await logout();
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const response = await authAPI.forgotPassword(email);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send reset email",
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyForgotPasswordOTP = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.verifyForgotPasswordOTP(data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid OTP",
      };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.resetPassword(data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to reset password",
      };
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (email) => {
    setLoading(true);
    try {
      const response = await authAPI.sendOTP(email);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send OTP",
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailOTP = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.verifyEmailOTP(data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid OTP",
      };
    } finally {
      setLoading(false);
    }
  };

  const onboarding = async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.onboarding(data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Onboarding failed",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signUp,
    signIn,
    signOut,
    forgotPassword,
    verifyForgotPasswordOTP,
    resetPassword,
    sendOTP,
    verifyEmailOTP,
    onboarding,
  };
};

import { useState } from "react";
import { userAPI } from "../services/api";
import { useUser } from "../context/UserContext";

export const useUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getProfile();
      if (response.data?.user) {
        setUser(response.data.user);
        return { success: true, data: response.data };
      }
      return { success: false, message: "User not found" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch profile",
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    setLoading(true);
    try {
      const response = await userAPI.updateProfile(formData);
      if (response.data?.success) {
        setUser(response.data.user);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update profile",
      };
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (formData) => {
    setLoading(true);
    try {
      const response = await userAPI.updateAvatar(formData);
      if (response.data?.success) {
        setUser(response.data.user);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update avatar",
      };
    } finally {
      setLoading(false);
    }
  };

  const setPassword = async (data) => {
    setLoading(true);
    try {
      const response = await userAPI.setPassword(data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to set password",
      };
    } finally {
      setLoading(false);
    }
  };

  const setInterests = async (data) => {
    setLoading(true);
    try {
      const response = await userAPI.setInterests(data);
      if (response.data?.success) {
        setUser(response.data.user);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to set interests",
      };
    } finally {
      setLoading(false);
    }
  };

  const setLanguage = async (data) => {
    setLoading(true);
    try {
      const response = await userAPI.setLanguage(data);
      if (response.data?.success) {
        setUser(response.data.user);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to set language",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getProfile,
    updateProfile,
    updateAvatar,
    setPassword,
    setInterests,
    setLanguage,
  };
};

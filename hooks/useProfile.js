import { useState } from "react";
import { profileAPI } from "../services/api";

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);

  const createProfile = async (formData) => {
    setLoading(true);
    try {
      const response = await profileAPI.createProfile(formData);
      if (response.data?.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create profile",
      };
    } finally {
      setLoading(false);
    }
  };

  const getProfiles = async () => {
    setLoading(true);
    try {
      const response = await profileAPI.getProfiles();
      if (response.data) {
        setProfiles(response.data.profiles || []);
        return { success: true, data: response.data };
      }
      return { success: false, message: "No profiles found" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch profiles",
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyProfilePin = async (data) => {
    setLoading(true);
    try {
      const response = await profileAPI.verifyProfilePin(data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid PIN",
      };
    } finally {
      setLoading(false);
    }
  };

  const editVideoQuality = async (data) => {
    setLoading(true);
    try {
      const response = await profileAPI.editVideoQuality(data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update video quality",
      };
    } finally {
      setLoading(false);
    }
  };

  const getWatchlist = async () => {
    setLoading(true);
    try {
      const response = await profileAPI.getWatchlist();
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch watchlist",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    profiles,
    createProfile,
    getProfiles,
    verifyProfilePin,
    editVideoQuality,
    getWatchlist,
  };
};

import { useState } from "react";
import { deviceAPI } from "../services/api";

export const useDevice = () => {
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [limitsStatus, setLimitsStatus] = useState(null);

  const registerDevice = async (data) => {
    setLoading(true);
    try {
      const response = await deviceAPI.registerDevice(data);
      if (response.data?.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to register device",
      };
    } finally {
      setLoading(false);
    }
  };

  const removeDevice = async (data) => {
    setLoading(true);
    try {
      const response = await deviceAPI.removeDevice(data);
      if (response.data?.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to remove device",
      };
    } finally {
      setLoading(false);
    }
  };

  const getLimitsStatus = async () => {
    setLoading(true);
    try {
      const response = await deviceAPI.getLimitsStatus();
      if (response.data) {
        setDevices(response.data.devices || []);
        setLimitsStatus(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, message: "Failed to fetch devices" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch limits status",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    devices,
    limitsStatus,
    registerDevice,
    removeDevice,
    getLimitsStatus,
  };
};

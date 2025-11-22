import { useState } from "react";
import { twoFactorAPI } from "../services/api";

export const use2FA = () => {
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  const enable2FA = async () => {
    setLoading(true);
    try {
      const response = await twoFactorAPI.enable2FA();
      if (response.data?.success) {
        setQrCode(response.data.qrCode);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to enable 2FA",
      };
    } finally {
      setLoading(false);
    }
  };

  const verify2FA = async (data) => {
    setLoading(true);
    try {
      const response = await twoFactorAPI.verify2FA(data);
      if (response.data?.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid 2FA code",
      };
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async (data) => {
    setLoading(true);
    try {
      const response = await twoFactorAPI.disable2FA(data);
      if (response.data?.success) {
        setQrCode(null);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to disable 2FA",
      };
    } finally {
      setLoading(false);
    }
  };

  const verifyLogin2FA = async (data) => {
    setLoading(true);
    try {
      const response = await twoFactorAPI.verifyLogin2FA(data);
      if (response.data?.success) {
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Invalid 2FA code",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    qrCode,
    enable2FA,
    verify2FA,
    disable2FA,
    verifyLogin2FA,
  };
};

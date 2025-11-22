import { useState } from "react";
import { subscriptionAPI } from "../services/api";

export const useSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);

  const activateSubscription = async (data) => {
    setLoading(true);
    try {
      const response = await subscriptionAPI.activateSubscription(data);
      if (response.data?.success) {
        setSubscription(response.data.subscription);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to activate subscription",
      };
    } finally {
      setLoading(false);
    }
  };

  const createTrialSubscription = async (data) => {
    setLoading(true);
    try {
      const response = await subscriptionAPI.createTrialSubscription(data);
      if (response.data?.success) {
        setSubscription(response.data.subscription);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create trial",
      };
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionById = async (id) => {
    setLoading(true);
    try {
      const response = await subscriptionAPI.getSubscriptionById(id);
      if (response.data) {
        setSubscription(response.data.subscription);
        return { success: true, data: response.data };
      }
      return { success: false, message: "Subscription not found" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch subscription",
      };
    } finally {
      setLoading(false);
    }
  };

  const createPaymentIntent = async (data) => {
    setLoading(true);
    try {
      const response = await subscriptionAPI.createPaymentIntent(data);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create payment intent",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    subscription,
    activateSubscription,
    createTrialSubscription,
    getSubscriptionById,
    createPaymentIntent,
  };
};

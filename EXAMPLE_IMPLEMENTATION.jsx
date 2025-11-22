/**
 * Example: Complete Subscription Feature Implementation
 * This file demonstrates how to implement a complete subscription feature
 * using the integrated API service.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSubscription } from '../hooks/useSubscription';
import { useUser } from '../context/UserContext';

const SubscriptionScreen = () => {
  const { user } = useUser();
  const {
    activateSubscription,
    createPaymentIntent,
    getSubscriptionById,
    subscription,
    loading,
  } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Fetch current subscription on mount
  useEffect(() => {
    if (user?.subscriptionId) {
      fetchCurrentSubscription();
    }
  }, [user]);

  const fetchCurrentSubscription = async () => {
    const result = await getSubscriptionById(user.subscriptionId);
    if (result.success) {
      console.log('Current subscription:', result.data.subscription);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$9.99',
      features: [
        '1 Device',
        'SD Quality',
        'Limited Content',
      ],
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '$14.99',
      features: [
        '2 Devices',
        'HD Quality',
        'Full Content Library',
        'Download Option',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19.99',
      features: [
        '4 Devices',
        '4K + HDR Quality',
        'Full Content Library',
        'Unlimited Downloads',
        'Early Access',
      ],
    },
  ];

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      Alert.alert('Error', 'Please select a plan');
      return;
    }

    setPaymentProcessing(true);

    try {
      // Step 1: Create payment intent
      const paymentResult = await createPaymentIntent({
        plan: selectedPlan,
      });

      if (!paymentResult.success) {
        Alert.alert('Error', paymentResult.message);
        setPaymentProcessing(false);
        return;
      }

      // Step 2: Process payment (integrate with Stripe SDK here)
      // For demo, we'll skip actual payment processing
      const clientSecret = paymentResult.data.clientSecret;
      console.log('Payment Intent created:', clientSecret);

      // Step 3: Activate subscription after payment success
      const subscriptionResult = await activateSubscription({
        plan: selectedPlan,
      });

      setPaymentProcessing(false);

      if (subscriptionResult.success) {
        Alert.alert(
          'Success!',
          'Your subscription has been activated.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/home'),
            },
          ]
        );
      } else {
        Alert.alert('Error', subscriptionResult.message);
      }
    } catch (error) {
      setPaymentProcessing(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const renderPlanCard = (plan) => (
    <TouchableOpacity
      key={plan.id}
      style={[
        styles.planCard,
        selectedPlan === plan.id && styles.planCardSelected,
      ]}
      onPress={() => setSelectedPlan(plan.id)}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}

      <Text style={styles.planName}>{plan.name}</Text>
      <Text style={styles.planPrice}>{plan.price}/month</Text>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {selectedPlan === plan.id && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedText}>Selected</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#08B451" />
        <Text style={styles.loadingText}>Loading subscription details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Upgrade to unlock premium features
        </Text>
      </View>

      <View style={styles.plansContainer}>
        {plans.map(renderPlanCard)}
      </View>

      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={handleSubscribe}
        disabled={paymentProcessing || loading}
      >
        <LinearGradient
          colors={['#18B451', '#08B451']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradientButton}
        >
          {paymentProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Subscribe Now</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {subscription && (
        <View style={styles.currentSubscription}>
          <Text style={styles.currentSubTitle}>Current Subscription</Text>
          <Text style={styles.currentSubPlan}>
            {subscription.plan} - ${subscription.price}/month
          </Text>
          <Text style={styles.currentSubExpiry}>
            Expires: {new Date(subscription.expiresAt).toLocaleDateString()}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F294F',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F294F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#B4C1D4',
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    padding: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#B4C1D4',
  },
  plansContainer: {
    paddingHorizontal: 20,
  },
  planCard: {
    backgroundColor: '#1E3F6D',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#1E3F6D',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#08B451',
    backgroundColor: '#1E4F6D',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 20,
    backgroundColor: '#08B451',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  planPrice: {
    fontSize: 20,
    color: '#08B451',
    marginBottom: 20,
  },
  featuresContainer: {
    marginTop: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkmark: {
    color: '#08B451',
    fontSize: 18,
    marginRight: 10,
  },
  featureText: {
    color: '#B4C1D4',
    fontSize: 16,
  },
  selectedIndicator: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#08B451',
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subscribeButton: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 30,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  currentSubscription: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#1E3F6D',
    borderRadius: 15,
  },
  currentSubTitle: {
    color: '#B4C1D4',
    fontSize: 14,
    marginBottom: 5,
  },
  currentSubPlan: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  currentSubExpiry: {
    color: '#B4C1D4',
    fontSize: 14,
  },
});

export default SubscriptionScreen;

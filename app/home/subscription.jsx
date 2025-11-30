import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Modal, ScrollView } from 'react-native';
import subscription_bg from '../../assets/images/auth/subscription_bg.png';
import { paymentAPI } from '../../services/api';
import { useStripe } from '@stripe/stripe-react-native';
import { useLanguage } from '../../context/LanguageContext';
import SuccessModal from '../../components/SuccessModal';
import ErrorModal from '../../components/ErrorModal';

const PLAN_DETAILS = {
    basic: {
        name: 'Basic Plan',
        price: '$9.99',
        amount: 9.99,
        features: [
            'Watch on 1 screen at a time',
            'Good video quality',
            'Download on 1 device',
            'Affordable monthly price',
        ],
    },
    standard: {
        name: 'Standard',
        price: '$19.99',
        amount: 19.99,
        features: [
            'Watch on 2 screens simultaneously',
            'Full HD available',
            'Download on 2 devices',
            'Great for couples or roommates',
        ],
    },
    premium: {
        name: 'Premium',
        price: '$29.99',
        amount: 29.99,
        features: [
            'Watch on 4 screens at once',
            'Ultra HD + HDR',
            'Download on 4 devices',
            'Best for families and binge-watchers',
        ],
    },
};

const Subscription = () => {
    const { t } = useLanguage();
    const [selectedPlan, setSelectedPlan] = useState('standard');
    const [processing, setProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const currentPlan = PLAN_DETAILS[selectedPlan];
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const handleContinue = () => {
        setShowPaymentModal(true);
    };

    const handlePayment = async (method) => {
        try {
            setProcessing(true);
            setPaymentMethod(method);
            setShowPaymentModal(false);

            // Create payment intent
            const response = await paymentAPI.createPaymentIntent({
                plan: selectedPlan,
                paymentMethod: method,
            });

            if (response.data.success) {
                const { clientSecret, amount } = response.data.data;

                // Initialize payment sheet
                const { error: initError } = await initPaymentSheet({
                    paymentIntentClientSecret: clientSecret,
                    merchantDisplayName: 'KCL Streaming',
                    style: 'automatic',
                    returnURL: 'kcl://payment-success',
                });

                if (initError) {
                    console.error('Init error:', initError);
                    setErrorMessage(initError.message || 'Failed to initialize payment');
                    setShowErrorModal(true);
                    setProcessing(false);
                    return;
                }

                // Present payment sheet
                const { error: presentError } = await presentPaymentSheet();

                if (presentError) {
                    console.error('Present error:', presentError);
                    if (presentError.code !== 'Canceled') {
                        setErrorMessage(presentError.message || 'Payment failed');
                        setShowErrorModal(true);
                    }
                    setProcessing(false);
                    return;
                }

                // Payment successful
                setShowSuccessModal(true);
            } else {
                setErrorMessage(response.data.message || 'Failed to create payment intent');
                setShowErrorModal(true);
            }
        } catch (error) {
            console.error('Payment error:', error);
            const errMsg = error.response?.data?.message || error.message || 'Failed to process payment';
            setErrorMessage(errMsg);
            setShowErrorModal(true);
        } finally {
            setProcessing(false);
        }
    };

    const renderPlanTab = (planKey) => {
        const plan = PLAN_DETAILS[planKey];
        const isSelected = selectedPlan === planKey;
        const content = <Text style={styles.planTabText}>{plan.name}</Text>;

        return isSelected ? (
            <LinearGradient
                key={planKey}
                colors={['#18B451', '#08B451']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.selectedPlanTab}
            >
                {content}
            </LinearGradient>
        ) : (
            <TouchableOpacity
                key={planKey}
                style={styles.unselectedPlanTab}
                onPress={() => setSelectedPlan(planKey)}
            >
                {content}
            </TouchableOpacity>
        );
    };

    return (
        <ImageBackground source={subscription_bg} style={styles.background} resizeMode="cover">
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>{t('choosePlan')}</Text>
                    <Text style={styles.subtitle}>{t('personalizeExperience')}</Text>
                </View>

                <View style={styles.planTabsContainer}>
                    {Object.keys(PLAN_DETAILS).map(renderPlanTab)}
                </View>

                <View style={styles.planCard}>
                    <View style={styles.planHeader}>
                        <Text style={styles.planName}>{currentPlan.name}</Text>
                        <Text style={styles.planPrice}>
                            {currentPlan.price}
                            <Text style={styles.planMonth}>/Month</Text>
                        </Text>
                    </View>

                    {currentPlan.features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#08B451" style={styles.featureIcon} />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}

                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinue}
                        disabled={processing}
                    >
                        <LinearGradient
                            colors={['#18B451', '#08B451']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={styles.gradientButton}
                        >
                            {processing ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.buttonText}>{t('continueToPayment')}</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Payment Method Modal */}
            <Modal
                visible={showPaymentModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowPaymentModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Payment Method</Text>
                            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.paymentOptions}>
                            <TouchableOpacity
                                style={styles.paymentOption}
                                onPress={() => handlePayment('card')}
                                disabled={processing}
                            >
                                {processing ? (
                                    <ActivityIndicator color="#4A88E1" />
                                ) : (
                                    <>
                                        <Ionicons name="card" size={24} color="#4A88E1" />
                                        <Text style={styles.paymentOptionText}>Credit/Debit Card</Text>
                                        <Ionicons name="chevron-forward" size={20} color="#B4C1D4" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.secureText}>
                            <Ionicons name="lock-closed" size={14} color="#08B451" /> Secure payment powered by Stripe
                        </Text>
                    </View>
                </View>
            </Modal>

            <SuccessModal
                visible={showSuccessModal}
                title="Success! 🎉"
                message={`Your ${currentPlan.name} subscription is now active!`}
                buttonText="Go to Profile"
                onClose={() => {
                    setShowSuccessModal(false);
                    router.replace('/home/profile');
                }}
            />

            <ErrorModal
                visible={showErrorModal}
                title="Payment Error"
                message={errorMessage}
                buttonText="OK"
                onClose={() => setShowErrorModal(false)}
            />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#0F294F',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 30,
        paddingTop: 130,
        paddingBottom: 40,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 30,
        backgroundColor: '#1E3F6D',
        padding: 8,
        borderRadius: 50,
        zIndex: 10,
    },
    headerTextContainer: {
        width: '100%',
        marginBottom: 30,
        paddingLeft: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#B4C1D4',
    },
    planTabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#1E3F6D',
        borderRadius: 30,
        padding: 5,
        marginBottom: 30,
    },
    selectedPlanTab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unselectedPlanTab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    planTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
    planCard: {
        backgroundColor: '#1E3F6D',
        borderRadius: 20,
        paddingHorizontal: 25,
        paddingVertical: 20,
        marginBottom: 30,
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    planName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    planPrice: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    planMonth: {
        fontSize: 16,
        fontWeight: '500',
        color: '#B4C1D4',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#21477C',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 10,
    },
    featureIcon: {
        marginRight: 10,
    },
    featureText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    continueButton: {
        width: '100%',
        borderRadius: 30,
        marginTop: 20,
        overflow: 'hidden',
        shadowColor: '#18B451',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 10,
    },
    gradientButton: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#0F294F',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 20,
        paddingBottom: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    paymentOptions: {
        marginBottom: 20,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E3F6D',
        padding: 18,
        borderRadius: 15,
        marginBottom: 12,
    },
    paymentOptionText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    secureText: {
        textAlign: 'center',
        color: '#B4C1D4',
        fontSize: 13,
        marginTop: 10,
    },
});

export default Subscription;
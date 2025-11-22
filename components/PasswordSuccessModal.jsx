import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import sucess_bage from '../assets/images/auth/sucess_bage.png';

const PasswordSuccessModal = ({ isVisible, hide }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <View style={styles.overlay}>
            <View style={styles.modalContainer}>
                <View style={styles.handleIndicator} />
                <Image source={sucess_bage} style={styles.successImage} resizeMode="contain" />
                <Text style={styles.title}>Password has been updated</Text>
                <Text style={styles.message}>
                    Your password has been updated. You can now{'\n'}sign in with your new credentials
                </Text>
                <TouchableOpacity onPress={() => { hide(); router.push('/login'); }} style={styles.signInButton}>
                    <LinearGradient
                        colors={['#18B451', '#08B451']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buttonText}>Sign in</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 100,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: '#0F294F',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
        paddingTop: 10,
        paddingBottom: 40,
        alignItems: 'center',
    },
    handleIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#1E3F6D',
        borderRadius: 2.5,
        marginBottom: 20,
    },
    successImage: {
        width: 106,
        height: 106,
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#B4C1D4',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
    },
    signInButton: {
        width: '100%',
        borderRadius: 30,
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
});

export default PasswordSuccessModal;

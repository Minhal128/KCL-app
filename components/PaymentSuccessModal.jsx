import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, TouchableOpacity } from "react-native";
import { Image, Modal, StyleSheet, Text, View } from "react-native";
const { height } = Dimensions.get('window');
import sucesfull_tick from '../assets/images/home/tick.png';

const PaymentSuccessModal = ({ visible, onClose, planName }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <View style={modalStyles.handle} />
                    <View style={modalStyles.iconContainer}>
                        <Image source={sucesfull_tick} />
                    </View>


                    <Text style={modalStyles.modalTitle}>You've subscribed</Text>

                    <Text style={modalStyles.modalText}>
                        Your subscription for the {planName} plan has been successfully processed.
                        You can now enjoy all premium content!
                    </Text>

                    {/* Begin Explore Button */}
                    <TouchableOpacity style={modalStyles.beginExploreButton} onPress={onClose}>
                        <LinearGradient
                            colors={['#18B451', '#08B451']}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                            style={modalStyles.gradientButton}
                        >
                            <Text style={modalStyles.buttonText}>Begin explore</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};

// --- Modal Styles (based on design files: image_362f48.png, image_27276a.png) ---
const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker dim background
    },
    modalView: {
        width: '100%',
        backgroundColor: '#112F5A', // Dark blue background for the modal
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingVertical: 30,
        alignItems: 'center',
        maxHeight: height * 0.55,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#355380',
        borderRadius: 5,
        marginBottom: 20,
    },
    iconContainer: {
        width: 106,
        height: 106,
        borderRadius: 53,
        backgroundColor: '#1E3F6D', // Darker circle background
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        // Gradient blue border/shadow effect from design
        borderWidth: 5,
        borderColor: '#21477C',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    modalText: {
        marginBottom: 30,
        textAlign: 'center',
        color: '#B4C1D4',
        fontSize: 14,
        lineHeight: 20,
    },
    beginExploreButton: {
        width: '100%',
        borderRadius: 30,
        overflow: 'hidden',
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

export default PaymentSuccessModal
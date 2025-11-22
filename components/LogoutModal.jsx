import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const { height } = Dimensions.get('window');

const LogoutModal = ({ visible, onCancel, onConfirm }) => (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onCancel}>
        <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
                <View style={modalStyles.handle} />
                <Text style={modalStyles.modalTitle}>Logout</Text>
                <Text style={modalStyles.modalText}>Are you sure you want to logout?</Text>
                <TouchableOpacity style={[modalStyles.button, modalStyles.buttonConfirm]} onPress={onConfirm}>
                    <Text style={modalStyles.textStyle}>Yes, logout</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[modalStyles.button, modalStyles.buttonCancel]} onPress={onCancel}>
                    <Text style={modalStyles.textStyle}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '100%',
        backgroundColor: '#112F5A',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingBottom: 30,
        paddingTop: 10,
        alignItems: 'center',
        maxHeight: height * 0.5,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#355380',
        borderRadius: 5,
        marginBottom: 20,
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
        fontSize: 16,
    },
    button: {
        borderRadius: 15,
        padding: 15,
        width: '100%',
        marginBottom: 15,
    },
    buttonConfirm: {
        backgroundColor: '#FF3B30',
    },
    buttonCancel: {
        backgroundColor: '#0F294F',
        borderWidth: 1,
        borderColor: '#112F5A',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default LogoutModal
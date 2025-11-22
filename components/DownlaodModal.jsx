import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const DownloadModal = ({ isVisible, progress, hideModal }) => {
    const totalSize = 200; // MB
    const downloadedSize = ((progress / 100) * totalSize).toFixed(2);
    const progressWidth = `${progress}%`;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={hideModal}
        >
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <View style={modalStyles.swipeIndicator} />
                    <Text style={modalStyles.modalTitle}>Downloading movie</Text>

                    <View style={modalStyles.progressRow}>

                        <Ionicons name="wifi" size={20} color="#08B451" style={{ marginRight: 10 }} />
                        <Text style={modalStyles.progressText}>{downloadedSize}/200MB</Text>

                        <View style={modalStyles.progressBarBackground}>
                            <View style={[modalStyles.progressBarFill, { width: progressWidth }]} />
                        </View>

                        <Text style={modalStyles.progressPercent}>{progress}%</Text>
                    </View>

                    <TouchableOpacity style={modalStyles.hideButton} onPress={hideModal}>
                        <Text style={modalStyles.hideButtonText}>Hide</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default DownloadModal

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center', // Align to bottom
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black background
    },
    modalView: {
        backgroundColor: '#1E3F6D',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginHorizontal: 20
    },
    swipeIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#4A6A92',
        borderRadius: 5,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 25,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 30,
    },
    progressText: {
        fontSize: 14,
        color: 'white',
        flex: 1,
        flexWrap: 'nowrap',
    },
    progressBarBackground: {
        height: 8,
        flex:1.5,
        backgroundColor: '#4A6A92',
        borderRadius: 4,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#08B451',
        borderRadius: 4,
    },
    progressPercent: {
        fontSize: 14,
        color: '#08B451',
        fontWeight: 'bold',
    },
    hideButton: {
        backgroundColor: '#112F5A',
        borderRadius: 30,
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center',
    },
    hideButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

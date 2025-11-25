import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert, Image } from 'react-native';
import { X, Camera, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    currentName: string;
    onSave: (name: string, bio: string, avatar: string | null) => void;
}

export default function EditProfileModal({ visible, onClose, currentName, onSave }: EditProfileModalProps) {
    const { colors, isDarkMode } = useApp();
    const [name, setName] = useState(currentName);
    const [bio, setBio] = useState('🌱 Garden Enthusiast');
    const [avatar, setAvatar] = useState<string | null>(null);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'Please allow access to your photos to upload an avatar.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'Please allow access to your camera to take a photo.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }
        onSave(name, bio, avatar);
        onClose();
    };

    const showImageOptions = () => {
        Alert.alert(
            'Change Avatar',
            'Choose an option',
            [
                { text: 'Take Photo', onPress: takePhoto },
                { text: 'Choose from Library', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                        <View style={styles.avatarSection}>
                            <TouchableOpacity onPress={showImageOptions} style={styles.avatarContainer}>
                                {avatar ? (
                                    <Image source={{ uri: avatar }} style={styles.avatarImagePreview} />
                                ) : (
                                    <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                                        <User size={40} color="white" />
                                    </View>
                                )}
                                <View style={[styles.cameraIcon, { backgroundColor: colors.primary }]}>
                                    <Camera size={16} color="white" />
                                </View>
                            </TouchableOpacity>
                            <Text style={[styles.avatarHint, { color: colors.textSecondary }]}>
                                Tap to change avatar
                            </Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDarkMode ? colors.card : '#f3f4f6',
                                    color: colors.text,
                                    borderColor: colors.border
                                }]}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor={colors.textSecondary}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
                            <TextInput
                                style={[styles.input, styles.bioInput, {
                                    backgroundColor: isDarkMode ? colors.card : '#f3f4f6',
                                    color: colors.text,
                                    borderColor: colors.border
                                }]}
                                value={bio}
                                onChangeText={setBio}
                                placeholder="Tell us about yourself"
                                placeholderTextColor={colors.textSecondary}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.cancelButton, { backgroundColor: isDarkMode ? colors.card : '#f3f4f6' }]}
                                onPress={onClose}
                            >
                                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                                onPress={handleSave}
                            >
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    closeButton: {
        padding: 4,
    },
    modalBody: {
        padding: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#22c55e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImagePreview: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#22c55e',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    avatarHint: {
        fontSize: 13,
        color: '#6b7280',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: '#1f2937',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    bioInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
        marginBottom: 20,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#22c55e',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});

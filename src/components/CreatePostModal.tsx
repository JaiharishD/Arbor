import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert, Image } from 'react-native';
import { X, Image as ImageIcon, Send } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';
import { BlurView } from 'expo-blur';

interface CreatePostModalProps {
    visible: boolean;
    onClose: () => void;
    onPost: (content: string, image: string | null) => void;
}

export default function CreatePostModal({ visible, onClose, onPost }: CreatePostModalProps) {
    const { colors, isDarkMode } = useApp();
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'Please allow access to your photos to upload an image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handlePost = () => {
        if (!content.trim() && !image) {
            Alert.alert('Empty Post', 'Please add some text or an image to post.');
            return;
        }
        onPost(content, image);
        setContent('');
        setImage(null);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <BlurView intensity={20} tint={isDarkMode ? 'dark' : 'light'} style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Create Post</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                        <TextInput
                            style={[styles.input, {
                                color: colors.text,
                                backgroundColor: isDarkMode ? colors.card : '#f9fafb',
                                borderColor: colors.border
                            }]}
                            value={content}
                            onChangeText={setContent}
                            placeholder="What's growing in your garden?"
                            placeholderTextColor={colors.textSecondary}
                            multiline
                            autoFocus
                        />

                        {image && (
                            <View style={styles.imagePreviewContainer}>
                                <Image source={{ uri: image }} style={styles.imagePreview} />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => setImage(null)}
                                >
                                    <X size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={[styles.actionButton, { backgroundColor: isDarkMode ? colors.card : '#f3f4f6' }]}
                                onPress={pickImage}
                            >
                                <ImageIcon size={20} color={colors.primary} />
                                <Text style={[styles.actionText, { color: colors.text }]}>Add Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    <View style={[styles.footer, { borderTopColor: colors.border }]}>
                        <TouchableOpacity
                            style={[styles.postButton, { opacity: (!content.trim() && !image) ? 0.5 : 1 }]}
                            onPress={handlePost}
                            disabled={!content.trim() && !image}
                        >
                            <Text style={styles.postButtonText}>Post</Text>
                            <Send size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%',
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
        flex: 1,
    },
    input: {
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 20,
    },
    imagePreviewContainer: {
        position: 'relative',
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        padding: 4,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    postButton: {
        backgroundColor: '#22c55e',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
    },
    postButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Camera, Shield, Leaf, UploadCloud, AlertTriangle, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { analyzePlantImage } from '../services/geminiService';
import { type DiseaseDetectionResult } from '../types';

interface DiseaseDetectionScreenProps {
    onBack: () => void;
}

import { useApp } from '../context/AppContext';

const DiseaseDetectionScreen: React.FC<DiseaseDetectionScreenProps> = ({ onBack }) => {
    const { colors, isDarkMode } = useApp();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DiseaseDetectionResult | null>(null);

    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setImageBase64(result.assets[0].base64 || null);
            setResult(null);
            setError(null);
        }
    };

    const handleScan = async () => {
        if (!imageBase64) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            // Extract mime type if available, default to jpeg
            const mimeType = imageUri ? (imageUri.endsWith('.png') ? 'image/png' : 'image/jpeg') : 'image/jpeg';
            const detectionResult = await analyzePlantImage(imageBase64, mimeType);
            setResult(detectionResult);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
            Alert.alert("Analysis Error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setImageUri(null);
        setImageBase64(null);
        setIsLoading(false);
        setError(null);
        setResult(null);
    };

    const isHealthy = result?.diseaseName.toLowerCase() === 'healthy';

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
                    <Text style={[styles.loadingTitle, { color: colors.text }]}>Analyzing Plant...</Text>
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Our AI is inspecting your plant. Please wait a moment.</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={[styles.card, styles.errorCard, { backgroundColor: isDarkMode ? '#450a0a' : '#fef2f2', borderColor: isDarkMode ? '#7f1d1d' : '#fecaca' }]}>
                    <AlertTriangle color={colors.error} size={48} style={styles.centerIcon} />
                    <Text style={[styles.errorTitle, { color: colors.error }]}>Analysis Failed</Text>
                    <Text style={[styles.errorText, { color: isDarkMode ? '#fca5a5' : '#b91c1c' }]}>{error}</Text>
                    <TouchableOpacity
                        onPress={resetState}
                        style={[styles.errorButton, { backgroundColor: colors.error }]}
                    >
                        <Text style={styles.errorButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            )
        }

        if (result) {
            return (
                <View style={styles.resultContainer}>
                    <View style={[styles.card, { backgroundColor: colors.card }]}>
                        {imageUri && (
                            <Image source={{ uri: imageUri }} style={styles.resultImage} />
                        )}

                        <View style={[styles.resultBadge, isHealthy ? { backgroundColor: isDarkMode ? '#064e3b' : '#dcfce7', borderLeftColor: colors.success } : { backgroundColor: isDarkMode ? '#450a0a' : '#fee2e2', borderLeftColor: colors.error }]}>
                            <View style={styles.badgeHeader}>
                                <Shield color={isHealthy ? colors.success : colors.error} size={20} />
                                <Text style={[styles.badgeTitle, { color: isHealthy ? colors.success : colors.error }]}>
                                    Detected: {result.diseaseName}
                                </Text>
                            </View>
                            <Text style={[styles.confidenceText, { color: isHealthy ? colors.success : colors.error }]}>
                                Confidence: {result.confidence.toFixed(0)}%
                            </Text>
                        </View>

                        <View style={[styles.infoBox, { backgroundColor: isDarkMode ? colors.background : '#f9fafb' }]}>
                            <Text style={[styles.infoTitle, { color: colors.text }]}>Description</Text>
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>{result.description}</Text>
                        </View>

                        <View style={[styles.treatmentBox, { backgroundColor: isDarkMode ? colors.background : '#f0fdf4' }]}>
                            <View style={styles.treatmentHeader}>
                                <Leaf size={18} color={colors.primaryDark} />
                                <Text style={[styles.treatmentTitle, { color: colors.primaryDark }]}>
                                    {isHealthy ? 'Care Tip' : 'Treatment Recommendation'}
                                </Text>
                            </View>
                            <Text style={[styles.treatmentText, { color: colors.primary }]}>
                                {result.treatment}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={resetState}
                        style={[styles.scanButton, { backgroundColor: colors.primary }]}
                    >
                        <Text style={styles.scanButtonText}>Scan Another Plant</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.uploadContainer}>
                <TouchableOpacity
                    onPress={pickImage}
                    style={[styles.uploadBox, { backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.1)' : '#ecfdf5', borderColor: colors.primary }]}
                >
                    {imageUri ?
                        <Image source={{ uri: imageUri }} style={styles.previewImage} /> :
                        <Camera color={colors.primary} size={64} style={styles.centerIcon} />
                    }
                    <Text style={[styles.uploadText, { color: colors.textSecondary }]}>{imageUri ? 'Tap to change photo' : 'Tap to upload a photo'}</Text>
                    <View style={[styles.uploadButton, { backgroundColor: colors.primary }]}>
                        <UploadCloud size={20} color="white" />
                        <Text style={styles.uploadButtonText}>{imageUri ? 'Change Photo' : 'Upload Photo'}</Text>
                    </View>
                </TouchableOpacity>

                {imageUri && (
                    <TouchableOpacity
                        onPress={handleScan}
                        style={[styles.scanButton, { backgroundColor: colors.primary }]}
                    >
                        <Text style={styles.scanButtonText}>Scan Plant</Text>
                    </TouchableOpacity>
                )}

                <View style={[styles.tipsBox, { backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff' }]}>
                    <View style={styles.tipsHeader}>
                        <Shield color="#2563eb" size={20} />
                        <View style={styles.tipsContent}>
                            <Text style={[styles.tipsTitle, { color: isDarkMode ? '#60a5fa' : '#1e40af' }]}>Tips for best results:</Text>
                            <Text style={[styles.tipItem, { color: isDarkMode ? '#93c5fd' : '#1e40af' }]}>• Use clear, well-lit photos</Text>
                            <Text style={[styles.tipItem, { color: isDarkMode ? '#93c5fd' : '#1e40af' }]}>• Focus on affected leaves</Text>
                            <Text style={[styles.tipItem, { color: isDarkMode ? '#93c5fd' : '#1e40af' }]}>• Avoid shadows and blur</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <ArrowLeft size={20} color={colors.primary} />
                <Text style={[styles.backButtonText, { color: colors.primary }]}>Back to Dashboard</Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: colors.primaryDark }]}>AI Disease Detection</Text>
            {renderContent()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0fdf4', // green-50
    },
    contentContainer: {
        padding: 16,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 4,
    },
    backButtonText: {
        color: '#16a34a', // green-600
        fontWeight: '500',
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#166534', // green-800
        marginBottom: 16,
    },
    card: {
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        alignItems: 'center',
    },
    loader: {
        marginBottom: 16,
    },
    loadingTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937', // gray-800
        marginBottom: 8,
    },
    loadingText: {
        fontSize: 14,
        color: '#4b5563', // gray-600
        textAlign: 'center',
    },
    errorCard: {
        backgroundColor: '#fef2f2', // red-50
        borderColor: '#fecaca', // red-200
        borderWidth: 1,
    },
    centerIcon: {
        marginBottom: 16,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#991b1b', // red-800
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#b91c1c', // red-700
        textAlign: 'center',
        marginBottom: 16,
    },
    errorButton: {
        width: '100%',
        backgroundColor: '#ef4444', // red-500
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    errorButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    resultContainer: {
        gap: 16,
    },
    resultImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
        resizeMode: 'cover',
    },
    resultBadge: {
        width: '100%',
        borderLeftWidth: 4,
        padding: 16,
        borderRadius: 4,
        marginBottom: 16,
    },
    healthyBadge: {
        backgroundColor: '#dcfce7', // green-100
        borderLeftColor: '#22c55e', // green-500
    },
    unhealthyBadge: {
        backgroundColor: '#fee2e2', // red-100
        borderLeftColor: '#ef4444', // red-500
    },
    badgeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    badgeTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    healthyText: {
        color: '#15803d', // green-700
    },
    unhealthyText: {
        color: '#b91c1c', // red-700
    },
    confidenceText: {
        fontSize: 14,
    },
    infoBox: {
        width: '100%',
        backgroundColor: '#f9fafb', // gray-50
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    infoTitle: {
        fontWeight: '600',
        color: '#1f2937', // gray-800
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#374151', // gray-700
    },
    treatmentBox: {
        width: '100%',
        backgroundColor: '#f0fdf4', // green-50
        padding: 16,
        borderRadius: 8,
    },
    treatmentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    treatmentTitle: {
        fontWeight: '600',
        color: '#166534', // green-800
    },
    treatmentText: {
        fontSize: 14,
        color: '#15803d', // green-700
    },
    scanButton: {
        width: '100%',
        backgroundColor: '#16a34a', // green-600
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    scanButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    uploadContainer: {
        gap: 16,
    },
    uploadBox: {
        backgroundColor: '#ecfdf5', // green-50 (gradient-ish)
        padding: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#86efac', // green-300
        borderStyle: 'dashed',
        alignItems: 'center',
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
        resizeMode: 'cover',
    },
    uploadText: {
        color: '#374151', // gray-700
        marginBottom: 24,
        fontWeight: '500',
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#16a34a', // green-600
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    uploadButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    tipsBox: {
        backgroundColor: '#eff6ff', // blue-50
        padding: 16,
        borderRadius: 8,
    },
    tipsHeader: {
        flexDirection: 'row',
        gap: 12,
    },
    tipsContent: {
        flex: 1,
    },
    tipsTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1e40af', // blue-800
        marginBottom: 4,
    },
    tipItem: {
        fontSize: 12,
        color: '#1e40af', // blue-800
    },
});

export default DiseaseDetectionScreen;

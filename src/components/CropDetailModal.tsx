import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { X, Droplet, Sun, Calendar, TrendingUp } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { generatePlantCareInfo } from '../services/geminiService';
import { BlurView } from 'expo-blur';

import { Crop } from '../types';

interface CropDetailModalProps {
    visible: boolean;
    onClose: () => void;
    crop: Crop | null;
    onUpdateCrop?: (cropId: number, updates: Partial<Crop>) => void;
}

interface PlantInfo {
    wateringFrequency: string;
    sunlightHours: string;
    harvestDays: string;
    careTips: string[];
}

// Simple in-memory cache to store plant info
const plantInfoCache: Record<string, PlantInfo> = {};

export default function CropDetailModal({ visible, onClose, crop, onUpdateCrop }: CropDetailModalProps) {
    const { colors, isDarkMode } = useApp();
    const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [actionMode, setActionMode] = useState<'none' | 'log' | 'progress'>('none');
    const [logNote, setLogNote] = useState('');

    useEffect(() => {
        if (visible && crop) {
            loadPlantInfo();
        }
    }, [visible, crop]);

    // Reset action mode and note when modal closes
    useEffect(() => {
        if (!visible) {
            setActionMode('none');
            setLogNote('');
        }
    }, [visible]);

    const loadPlantInfo = async () => {
        if (!crop) return;

        // Check cache first
        const cacheKey = `${crop.name}-${crop.stage}`;
        if (plantInfoCache[cacheKey]) {
            setPlantInfo(plantInfoCache[cacheKey]);
            return;
        }

        setLoading(true);
        try {
            const info = await generatePlantCareInfo(crop.name, crop.stage);

            // Validate the response structure
            if (info && typeof info === 'object') {
                const newInfo = {
                    wateringFrequency: info.wateringFrequency || 'Daily',
                    sunlightHours: info.sunlightHours || '6-8 hrs',
                    harvestDays: info.harvestDays || '45-60 days',
                    careTips: Array.isArray(info.careTips) ? info.careTips : [
                        '🌱 Water regularly to keep soil moist',
                        '🌞 Ensure adequate sunlight exposure',
                        '🌿 Remove weeds around the plant',
                        '🐛 Check for pests weekly'
                    ]
                };

                // Save to cache
                plantInfoCache[cacheKey] = newInfo;
                setPlantInfo(newInfo);
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error('Error loading plant info:', error);
            // Fallback to default info
            const fallbackInfo = {
                wateringFrequency: 'Daily',
                sunlightHours: '6-8 hrs',
                harvestDays: '45-60 days',
                careTips: [
                    '🌱 Water regularly to keep soil moist',
                    '🌞 Ensure adequate sunlight exposure',
                    '🌿 Remove weeds around the plant',
                    '🐛 Check for pests weekly'
                ]
            };
            setPlantInfo(fallbackInfo);
        } finally {
            setLoading(false);
        }
    };

    const handleLogAction = (action: string, emoji: string) => {
        const message = logNote ? `${action} logged! ${emoji}\nNote: ${logNote}` : `${action} logged! ${emoji}`;
        Alert.alert('Success', message);
        setActionMode('none');
        setLogNote('');
    };

    const handleProgressUpdate = (amount: number) => {
        if (!crop || !onUpdateCrop) return;
        const newProgress = Math.min(crop.progress + amount, 100);
        onUpdateCrop(crop.id, { progress: newProgress });
        Alert.alert('Updated', `Progress increased to ${newProgress}%! 🚀`);
        setActionMode('none');
    };

    const handleCompleteStage = () => {
        if (!crop || !onUpdateCrop) return;
        onUpdateCrop(crop.id, { progress: 100 });
        Alert.alert('Congratulations!', 'Stage marked as complete! 🎉');
        setActionMode('none');
    };

    const renderLogActivity = () => (
        <View style={styles.actionOverlay}>
            <Text style={[styles.overlayTitle, { color: colors.text }]}>Log Activity</Text>
            <Text style={[styles.overlaySubtitle, { color: colors.textSecondary }]}>What did you do today?</Text>

            <View style={styles.actionGrid}>
                <TouchableOpacity style={[styles.actionGridItem, { backgroundColor: isDarkMode ? colors.card : '#eff6ff' }]} onPress={() => handleLogAction('Watered', '💧')}>
                    <View style={[styles.actionIconCircle, { backgroundColor: isDarkMode ? '#1d4ed840' : '#dbeafe' }]}>
                        <Droplet size={20} color="#3b82f6" />
                    </View>
                    <Text style={[styles.actionGridLabel, { color: colors.text }]}>Water</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionGridItem, { backgroundColor: isDarkMode ? colors.card : '#faf5ff' }]} onPress={() => handleLogAction('Fertilized', '🧪')}>
                    <View style={[styles.actionIconCircle, { backgroundColor: isDarkMode ? '#7e22ce40' : '#f3e8ff' }]}>
                        <TrendingUp size={20} color="#9333ea" />
                    </View>
                    <Text style={[styles.actionGridLabel, { color: colors.text }]}>Fertilize</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionGridItem, { backgroundColor: isDarkMode ? colors.card : '#fff7ed' }]} onPress={() => handleLogAction('Pruned', '✂️')}>
                    <View style={[styles.actionIconCircle, { backgroundColor: isDarkMode ? '#c2410c40' : '#ffedd5' }]}>
                        <Sun size={20} color="#f97316" />
                    </View>
                    <Text style={[styles.actionGridLabel, { color: colors.text }]}>Prune</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionGridItem, { backgroundColor: isDarkMode ? colors.card : '#fef2f2' }]} onPress={() => handleLogAction('Pest Control', '🛡️')}>
                    <View style={[styles.actionIconCircle, { backgroundColor: isDarkMode ? '#b91c1c40' : '#fee2e2' }]}>
                        <X size={20} color="#ef4444" />
                    </View>
                    <Text style={[styles.actionGridLabel, { color: colors.text }]}>Pests</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.noteInputContainer}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Add a note (optional)</Text>
                <TextInput
                    style={[styles.noteInput, {
                        backgroundColor: isDarkMode ? colors.card : '#f9fafb',
                        color: colors.text,
                        borderColor: colors.border
                    }]}
                    placeholder="e.g., 500ml water, removed dead leaves..."
                    placeholderTextColor={colors.textSecondary}
                    value={logNote}
                    onChangeText={setLogNote}
                    multiline
                />
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setActionMode('none')}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    const renderUpdateProgress = () => (
        <View style={styles.actionOverlay}>
            <Text style={[styles.overlayTitle, { color: colors.text }]}>Update Progress</Text>
            <Text style={[styles.overlaySubtitle, { color: colors.textSecondary }]}>Track your plant's growth</Text>

            <View style={styles.progressControlContainer}>
                <View style={[styles.progressBarLarge, { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb', height: 20, marginBottom: 20 }]}>
                    <View style={[styles.progressFillLarge, { width: `${crop?.progress || 0}%`, backgroundColor: colors.primary }]} />
                </View>
                <Text style={[styles.progressValueText, { color: colors.text }]}>{crop?.progress}%</Text>
            </View>

            <View style={styles.progressButtons}>
                <TouchableOpacity
                    style={[styles.progressButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleProgressUpdate(10)}
                >
                    <TrendingUp size={20} color="white" />
                    <Text style={styles.progressButtonText}>+10% Growth</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.progressButton, { backgroundColor: '#8b5cf6' }]}
                    onPress={handleCompleteStage}
                >
                    <Calendar size={20} color="white" />
                    <Text style={styles.progressButtonText}>Mark Stage Complete</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setActionMode('none')}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    if (!crop) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <BlurView intensity={80} tint={isDarkMode ? 'dark' : 'light'} style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{crop.name}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                        {actionMode === 'none' ? (
                            <>
                                <View style={styles.cropHeader}>
                                    <Text style={styles.cropEmoji}>{crop.image}</Text>
                                    <View style={[styles.stageBadge, { backgroundColor: colors.primary + '20' }]}>
                                        <Text style={[styles.stageText, { color: colors.primary }]}>{crop.stage}</Text>
                                    </View>
                                </View>

                                <View style={styles.progressSection}>
                                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Growth Progress</Text>
                                    <View style={[styles.progressBarLarge, { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }]}>
                                        <View style={[styles.progressFillLarge, { width: `${crop.progress}%`, backgroundColor: colors.primary }]} />
                                    </View>
                                    <Text style={[styles.progressText, { color: colors.textSecondary }]}>{crop.progress}% Complete</Text>
                                </View>

                                {loading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator size="large" color={colors.primary} />
                                        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                                            Loading plant care information...
                                        </Text>
                                    </View>
                                ) : plantInfo ? (
                                    <>
                                        <View style={styles.statsGrid}>
                                            <View style={[styles.statCard, { backgroundColor: isDarkMode ? colors.card : '#f0f9ff' }]}>
                                                <Droplet size={24} color="#3b82f6" />
                                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Water</Text>
                                                <Text style={[styles.statValue, { color: colors.text }]}>{plantInfo.wateringFrequency}</Text>
                                            </View>
                                            <View style={[styles.statCard, { backgroundColor: isDarkMode ? colors.card : '#fef3c7' }]}>
                                                <Sun size={24} color="#f59e0b" />
                                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sunlight</Text>
                                                <Text style={[styles.statValue, { color: colors.text }]}>{plantInfo.sunlightHours}</Text>
                                            </View>
                                            <View style={[styles.statCard, { backgroundColor: isDarkMode ? colors.card : '#ccfbf1' }]}>
                                                <Calendar size={24} color="#0d9488" />
                                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Planted</Text>
                                                <Text style={[styles.statValue, { color: colors.text }]}>15 days ago</Text>
                                            </View>
                                            <View style={[styles.statCard, { backgroundColor: isDarkMode ? colors.card : '#fce7f3' }]}>
                                                <TrendingUp size={24} color="#ec4899" />
                                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Harvest</Text>
                                                <Text style={[styles.statValue, { color: colors.text }]}>{plantInfo.harvestDays}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.section}>
                                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Care Tips for {crop.name}</Text>
                                            <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
                                                <Text style={[styles.tipText, { color: colors.text }]}>
                                                    {plantInfo.careTips && Array.isArray(plantInfo.careTips)
                                                        ? plantInfo.careTips.join('\n')
                                                        : '🌱 Loading care tips...'}
                                                </Text>
                                            </View>
                                        </View>
                                    </>
                                ) : null}

                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: isDarkMode ? colors.card : '#f3f4f6' }]}
                                        activeOpacity={0.7}
                                        onPress={() => setActionMode('log')}
                                    >
                                        <Text style={[styles.actionButtonText, { color: colors.text }]}>Log Activity</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.primary }]}
                                        activeOpacity={0.7}
                                        onPress={() => setActionMode('progress')}
                                    >
                                        <Text style={styles.primaryButtonText}>Update Progress</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : actionMode === 'log' ? (
                            renderLogActivity()
                        ) : (
                            renderUpdateProgress()
                        )}
                    </ScrollView>
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
        paddingBottom: 40,
    },
    cropHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    cropEmoji: {
        fontSize: 80,
        marginBottom: 12,
    },
    stageBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#dcfce7',
    },
    stageText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#16a34a',
    },
    progressSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 12,
    },
    progressBarLarge: {
        width: '100%',
        height: 12,
        backgroundColor: '#e5e7eb',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFillLarge: {
        height: '100%',
        backgroundColor: '#22c55e',
        borderRadius: 6,
    },
    progressText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6b7280',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#f0f9ff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        gap: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    statValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
    },
    section: {
        marginBottom: 24,
    },
    tipCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    tipText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 24,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
        marginBottom: 32,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    primaryButton: {
        backgroundColor: '#22c55e',
    },
    primaryButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: 'white',
    },
    // New Styles for Action Overlays
    actionOverlay: {
        paddingTop: 10,
    },
    overlayTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    overlaySubtitle: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    actionGridItem: {
        width: '48%',
        aspectRatio: 1.8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 12,
    },
    actionIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionGridLabel: {
        fontSize: 13,
        fontWeight: '600',
    },
    noteInputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 4,
    },
    noteInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    cancelButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        color: '#6b7280',
        fontWeight: '500',
    },
    progressControlContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    progressValueText: {
        fontSize: 48,
        fontWeight: 'bold',
        marginTop: -10,
    },
    progressButtons: {
        gap: 16,
        marginBottom: 24,
    },
    progressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 16,
        borderRadius: 16,
    },
    progressButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

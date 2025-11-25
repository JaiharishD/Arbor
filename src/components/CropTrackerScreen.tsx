import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Modal, Alert } from 'react-native';
import { ArrowLeft, Plus, Search, Filter, MoreVertical, Calendar, Droplets, Sun, Wind, ChevronRight, X } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { Crop } from '../types';
import * as api from '../services/api';
import CropDetailModal from './CropDetailModal';

interface CropTrackerScreenProps {
    onBack: () => void;
}

export default function CropTrackerScreen({ onBack }: CropTrackerScreenProps) {
    const { activeCrops, colors, isDarkMode, refreshCrops, addCrop, updateCrop } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCropName, setNewCropName] = useState('');
    const [adding, setAdding] = useState(false);

    // Detail Modal State
    const [selectedCrop, setSelectedCrop] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const getEmojiForCrop = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('tomato')) return '🍅';
        if (lowerName.includes('potato')) return '🥔';
        if (lowerName.includes('carrot')) return '🥕';
        if (lowerName.includes('corn') || lowerName.includes('maize')) return '🌽';
        if (lowerName.includes('pepper') || lowerName.includes('chili')) return '🌶️';
        if (lowerName.includes('cucumber')) return '🥒';
        if (lowerName.includes('lettuce') || lowerName.includes('spinach') || lowerName.includes('leaf')) return '🥬';
        if (lowerName.includes('broccoli')) return '🥦';
        if (lowerName.includes('garlic')) return '🧄';
        if (lowerName.includes('onion')) return '🧅';
        if (lowerName.includes('mushroom')) return '🍄';
        if (lowerName.includes('eggplant') || lowerName.includes('brinjal')) return '🍆';
        if (lowerName.includes('avocado')) return '🥑';
        if (lowerName.includes('apple')) return '🍎';
        if (lowerName.includes('banana')) return '🍌';
        if (lowerName.includes('grape')) return '🍇';
        if (lowerName.includes('lemon') || lowerName.includes('lime')) return '🍋';
        if (lowerName.includes('orange')) return '🍊';
        if (lowerName.includes('strawberry')) return '🍓';
        if (lowerName.includes('cherry')) return '🍒';
        if (lowerName.includes('peach')) return '🍑';
        if (lowerName.includes('pear')) return '🍐';
        if (lowerName.includes('watermelon')) return '🍉';
        if (lowerName.includes('flower') || lowerName.includes('rose')) return '🌹';
        if (lowerName.includes('sunflower')) return '🌻';
        if (lowerName.includes('tulip')) return '🌷';
        if (lowerName.includes('cactus')) return '🌵';
        if (lowerName.includes('palm')) return '🌴';
        if (lowerName.includes('tree')) return '🌳';
        if (lowerName.includes('herb') || lowerName.includes('basil') || lowerName.includes('mint')) return '🌿';
        if (lowerName.includes('seed')) return '🌱';
        return '🌱'; // Default
    };

    const handleAddCrop = async () => {
        if (!newCropName.trim()) return;

        setAdding(true);
        try {
            await addCrop({
                name: newCropName,
                image: getEmojiForCrop(newCropName),
                nextAction: 'Water in 1 day',
                plantedDate: new Date().toISOString().split('T')[0],
                stage: 'Seedling',
                health: 100,
                waterSchedule: 'Every 2 days',
                sunlight: 'Full Sun',
                progress: 0
            });
            setNewCropName('');
            setShowAddModal(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to add crop');
        } finally {
            setAdding(false);
        }
    };

    const handleCropPress = (crop: any) => {
        setSelectedCrop(crop);
        setShowDetailModal(true);
    };

    const handleUpdateCrop = (cropId: number, updates: Partial<Crop>) => {
        updateCrop(cropId, updates);
        if (selectedCrop && selectedCrop.id === cropId) {
            setSelectedCrop((prev: any) => ({ ...prev, ...updates }));
        }
    };

    const filteredCrops = activeCrops.filter(crop =>
        crop.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>My Crops</Text>
                <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addButton}>
                    <Plus size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
                    <Search size={20} color={colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search your crops..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {filteredCrops.map(crop => (
                    <TouchableOpacity
                        key={crop.id}
                        style={[styles.cropCard, { backgroundColor: colors.card }]}
                        onPress={() => handleCropPress(crop)}
                    >
                        <View style={styles.cropIcon}>
                            <Text style={{ fontSize: 32 }}>{crop.image}</Text>
                        </View>
                        <View style={styles.cropInfo}>
                            <Text style={[styles.cropName, { color: colors.text }]}>{crop.name}</Text>
                            <Text style={[styles.cropStatus, { color: colors.textSecondary }]}>{crop.stage} • {crop.nextAction}</Text>
                        </View>
                        <ChevronRight size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Add Crop Modal */}
            <Modal
                visible={showAddModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAddModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Crop</Text>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <X size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={[styles.input, {
                                backgroundColor: colors.background,
                                color: colors.text,
                                borderColor: colors.border
                            }]}
                            placeholder="Crop Name (e.g., Tomato)"
                            placeholderTextColor={colors.textSecondary}
                            value={newCropName}
                            onChangeText={setNewCropName}
                        />

                        <TouchableOpacity
                            style={[styles.submitButton, { backgroundColor: colors.primary }]}
                            onPress={handleAddCrop}
                            disabled={adding}
                        >
                            <Text style={styles.submitButtonText}>
                                {adding ? 'Adding...' : 'Add Crop'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Crop Detail Modal */}
            {selectedCrop && (
                <CropDetailModal
                    visible={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    crop={selectedCrop}
                    onUpdateCrop={handleUpdateCrop}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    addButton: {
        padding: 8,
    },
    searchContainer: {
        padding: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 48,
        borderRadius: 24,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    scrollContent: {
        padding: 16,
    },
    cropCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cropIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cropInfo: {
        flex: 1,
    },
    cropName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    cropStatus: {
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        borderRadius: 16,
        padding: 20,
        width: '100%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 20,
        fontSize: 16,
    },
    submitButton: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

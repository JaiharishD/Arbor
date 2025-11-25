import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { ChevronRight, ArrowLeft, Search } from 'lucide-react-native';
import { MOCK_PLANTS } from '../data/mockData';
import PlantDetailScreen from './PlantDetailScreen';
import { type Plant } from '../types';

interface GrowGuideScreenProps {
    onBack: () => void;
}

import { useApp } from '../context/AppContext';

const GrowGuideScreen: React.FC<GrowGuideScreenProps> = ({ onBack }) => {
    const { colors } = useApp();
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Filter and search plants
    const filteredPlants = useMemo(() => {
        let plants = MOCK_PLANTS;

        // Filter by category
        if (selectedCategory !== 'all') {
            plants = plants.filter(plant => plant.category === selectedCategory);
        }

        // Search by name
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            plants = plants.filter(plant =>
                plant.name.toLowerCase().includes(query)
            );
        }

        return plants;
    }, [searchQuery, selectedCategory]);

    const categories = [
        { id: 'all', label: 'All', emoji: '🌱' },
        { id: 'vegetable', label: 'Vegetables', emoji: '🥬' },
        { id: 'herb', label: 'Herbs', emoji: '🌿' },
        { id: 'fruit', label: 'Fruits', emoji: '🍓' },
        { id: 'flower', label: 'Flowers', emoji: '🌸' },
        { id: 'succulent', label: 'Succulents', emoji: '🪴' },
    ];

    if (selectedPlant) {
        return <PlantDetailScreen plant={selectedPlant} onBack={() => setSelectedPlant(null)} />;
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <ArrowLeft size={20} color={colors.primary} />
                <Text style={[styles.backButtonText, { color: colors.primary }]}>Back to Dashboard</Text>
            </TouchableOpacity>

            <Text style={[styles.title, { color: colors.primaryDark }]}>Smart Grow Guide</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {MOCK_PLANTS.length} plants perfect for terrace gardening
            </Text>

            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
                <Search size={20} color={colors.textSecondary} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search plants..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Category Filter */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryContainer}
            >
                {categories.map(category => (
                    <TouchableOpacity
                        key={category.id}
                        onPress={() => setSelectedCategory(category.id)}
                        style={[
                            styles.categoryChip,
                            selectedCategory === category.id && styles.categoryChipActive,
                            {
                                backgroundColor: selectedCategory === category.id ? colors.primary : colors.card,
                                borderColor: colors.border,
                            }
                        ]}
                    >
                        <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                        <Text style={[
                            styles.categoryLabel,
                            { color: selectedCategory === category.id ? 'white' : colors.text }
                        ]}>
                            {category.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Results Count */}
            {searchQuery.trim() && (
                <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
                    Found {filteredPlants.length} plant{filteredPlants.length !== 1 ? 's' : ''}
                </Text>
            )}

            {/* Plant List */}
            <View style={styles.list}>
                {filteredPlants.length > 0 ? (
                    filteredPlants.map(plant => (
                        <TouchableOpacity
                            key={plant.id}
                            onPress={() => setSelectedPlant(plant)}
                            style={[styles.card, { backgroundColor: colors.card }]}
                        >
                            <View style={styles.cardContent}>
                                <Text style={styles.emoji}>{plant.image}</Text>
                                <View style={styles.textContainer}>
                                    <View style={styles.nameRow}>
                                        <Text style={[styles.plantName, { color: colors.text }]}>{plant.name}</Text>
                                        <View style={[
                                            styles.difficultyBadge,
                                            { backgroundColor: getDifficultyColor(plant.difficulty) }
                                        ]}>
                                            <Text style={styles.difficultyText}>{plant.difficulty}</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.plantInfo, { color: colors.textSecondary }]}>
                                        {plant.sunlight} • {plant.water} water
                                        {plant.daysToHarvest && ` • ${plant.daysToHarvest} days`}
                                    </Text>
                                </View>
                            </View>
                            <ChevronRight color={colors.textSecondary} size={20} />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>🔍</Text>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            No plants found matching "{searchQuery}"
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

function getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
        case 'Easy': return '#10b981'; // green
        case 'Medium': return '#f59e0b'; // amber
        case 'Hard': return '#ef4444'; // red
        default: return '#6b7280'; // gray
    }
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
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937',
    },
    categoryScroll: {
        marginBottom: 16,
    },
    categoryContainer: {
        gap: 8,
        paddingRight: 16,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        gap: 6,
    },
    categoryChipActive: {
        borderColor: '#16a34a',
    },
    categoryEmoji: {
        fontSize: 16,
    },
    categoryLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    resultsText: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 12,
    },
    list: {
        gap: 12,
    },
    card: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    emoji: {
        fontSize: 32,
    },
    textContainer: {
        justifyContent: 'center',
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    plantName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937', // gray-800
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    difficultyText: {
        fontSize: 10,
        fontWeight: '600',
        color: 'white',
    },
    plantInfo: {
        fontSize: 12,
        color: '#6b7280', // gray-500
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
    },
});

export default GrowGuideScreen;

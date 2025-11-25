import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Sun, Droplet, Leaf, TrendingUp, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { type Plant } from '../types';

interface PlantDetailScreenProps {
    plant: Plant;
    onBack: () => void;
}

import { useApp } from '../context/AppContext';

const PlantDetailScreen: React.FC<PlantDetailScreenProps> = ({ plant, onBack }) => {
    const { colors, isDarkMode } = useApp();
    const tips: { [key: string]: string } = {
        'Tomato': 'Plant in well-drained soil with full sun exposure. Water deeply but infrequently.',
        'Basil': 'Pinch off flower buds to promote leaf growth. Harvest regularly.',
        'Aloe Vera': 'Allow soil to dry completely between waterings. Perfect for beginners!',
        'Mint': 'Mint spreads rapidly! Consider container growing. Keep soil moist.'
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <ArrowLeft size={20} color={colors.primary} />
                <Text style={[styles.backButtonText, { color: colors.primary }]}>Back to Guide</Text>
            </TouchableOpacity>

            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <LinearGradient
                    colors={isDarkMode ? [colors.secondary, colors.primaryDark] : ['#4ade80', '#10b981']}
                    style={styles.header}
                >
                    <Text style={styles.emoji}>{plant.image}</Text>
                    <Text style={styles.title}>{plant.name}</Text>
                </LinearGradient>

                <View style={styles.details}>
                    <View style={styles.detailRow}>
                        <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : '#fef3c7' }]}>
                            <Sun color={colors.accent} size={20} />
                        </View>
                        <View>
                            <Text style={[styles.detailLabel, { color: colors.text }]}>Sunlight</Text>
                            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{plant.sunlight}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(37, 99, 235, 0.1)' : '#dbeafe' }]}>
                            <Droplet color="#2563eb" size={20} />
                        </View>
                        <View>
                            <Text style={[styles.detailLabel, { color: colors.text }]}>Watering</Text>
                            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{plant.water}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(22, 163, 74, 0.1)' : '#dcfce7' }]}>
                            <Leaf color={colors.primary} size={20} />
                        </View>
                        <View>
                            <Text style={[styles.detailLabel, { color: colors.text }]}>Soil Type</Text>
                            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{plant.soil}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(147, 51, 234, 0.1)' : '#f3e8ff' }]}>
                            <TrendingUp color="#9333ea" size={20} />
                        </View>
                        <View>
                            <Text style={[styles.detailLabel, { color: colors.text }]}>Best Season</Text>
                            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{plant.season}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* New Fields */}
                    <View style={styles.detailRow}>
                        <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#dbeafe' }]}>
                            <Text style={styles.iconEmoji}>📦</Text>
                        </View>
                        <View>
                            <Text style={[styles.detailLabel, { color: colors.text }]}>Container Size</Text>
                            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{plant.containerSize}</Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#d1fae5' }]}>
                            <Text style={styles.iconEmoji}>🏷️</Text>
                        </View>
                        <View>
                            <Text style={[styles.detailLabel, { color: colors.text }]}>Category</Text>
                            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>
                                {plant.category.charAt(0).toUpperCase() + plant.category.slice(1)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={[styles.iconBox, {
                            backgroundColor: plant.difficulty === 'Easy' ? '#dcfce7' :
                                plant.difficulty === 'Medium' ? '#fef3c7' : '#fee2e2'
                        }]}>
                            <Text style={styles.iconEmoji}>
                                {plant.difficulty === 'Easy' ? '✅' : plant.difficulty === 'Medium' ? '⚠️' : '🔴'}
                            </Text>
                        </View>
                        <View>
                            <Text style={[styles.detailLabel, { color: colors.text }]}>Difficulty</Text>
                            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{plant.difficulty}</Text>
                        </View>
                    </View>

                    {plant.daysToHarvest && (
                        <View style={styles.detailRow}>
                            <View style={[styles.iconBox, { backgroundColor: isDarkMode ? 'rgba(245, 158, 11, 0.1)' : '#fef3c7' }]}>
                                <Text style={styles.iconEmoji}>⏱️</Text>
                            </View>
                            <View>
                                <Text style={[styles.detailLabel, { color: colors.text }]}>Days to Harvest</Text>
                                <Text style={[styles.detailValue, { color: colors.textSecondary }]}>
                                    {plant.daysToHarvest} days
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={[styles.tipBox, { backgroundColor: isDarkMode ? colors.background : '#f0fdf4' }]}>
                        <Text style={[styles.tipTitle, { color: colors.primaryDark }]}>AI Growing Tips</Text>
                        <Text style={[styles.tipText, { color: colors.primary }]}>
                            🤖 {tips[plant.name] || 'Follow care instructions for best results.'}
                        </Text>
                    </View>
                </View>
            </View>
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
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    header: {
        padding: 32,
        alignItems: 'center',
    },
    emoji: {
        fontSize: 80,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 16,
    },
    details: {
        padding: 24,
        gap: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    iconBox: {
        padding: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconEmoji: {
        fontSize: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 8,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937', // gray-800
    },
    detailValue: {
        fontSize: 14,
        color: '#4b5563', // gray-600
    },
    tipBox: {
        backgroundColor: '#f0fdf4', // green-50
        padding: 16,
        borderRadius: 8,
        marginTop: 16,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#166534', // green-800
        marginBottom: 8,
    },
    tipText: {
        fontSize: 14,
        color: '#15803d', // green-700
    },
});

export default PlantDetailScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Leaf, Cloud, Droplets, Wind, BookOpen, Sprout, Scan, RefreshCw, CheckCircle, Flame, Clock, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { getWeatherData, getWeatherEmoji, getWeatherGradient, clearWeatherCache, type WeatherData } from '../services/weatherService';
import { MOCK_PLANTS } from '../data/mockData';
interface DashboardScreenProps {
    onNavigate: (screen: 'grow-guide' | 'crop-tracker' | 'disease-detection') => void;
}

export default function DashboardScreen({ onNavigate }: DashboardScreenProps) {
    const { colors, userName, activeCrops } = useApp();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchWeather = async () => {
        try {
            setWeatherError(null);
            const data = await getWeatherData();
            setWeather(data);
        } catch (error) {
            setWeatherError(error instanceof Error ? error.message : 'Failed to load weather');
        } finally {
            setWeatherLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        clearWeatherCache();
        await fetchWeather();
        setRefreshing(false);
    };

    const handleWeatherRefresh = async () => {
        setWeatherLoading(true);
        clearWeatherCache();
        await fetchWeather();
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
                    <Text style={[styles.userName, { color: colors.primaryDark }]}>{userName}</Text>
                </View>
                <View style={[styles.iconContainer, { backgroundColor: '#dcfce7' }]}>
                    <Leaf size={32} color={colors.primary} />
                </View>
            </View>

            {/* Weather Widget */}
            {weatherLoading ? (
                <View style={[styles.weatherCard, { backgroundColor: colors.card }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                        Getting weather for your location...
                    </Text>
                </View>
            ) : weatherError ? (
                <View style={[styles.weatherCard, { backgroundColor: colors.card }]}>
                    <Text style={styles.weatherEmoji}>⚠️</Text>
                    <Text style={[styles.errorText, { color: colors.textSecondary }]}>
                        {weatherError}
                    </Text>
                    <TouchableOpacity onPress={handleWeatherRefresh} style={styles.retryButton}>
                        <RefreshCw size={16} color={colors.primary} />
                        <Text style={[styles.retryText, { color: colors.primary }]}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            ) : weather ? (
                <LinearGradient
                    colors={getWeatherGradient(weather.weatherType) as [string, string, ...string[]]}
                    style={styles.weatherCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.weatherHeader}>
                        <View>
                            <Text style={styles.weatherLocation}>{weather.location}</Text>
                            <Text style={styles.weatherDescription}>{weather.description}</Text>
                        </View>
                        <Text style={styles.weatherEmoji}>{getWeatherEmoji(weather.weatherType)}</Text>
                    </View>

                    <View style={styles.weatherMain}>
                        <Text style={styles.temperature}>{weather.temperature}°C</Text>
                        <Text style={styles.feelsLike}>Feels like {weather.feelsLike}°C</Text>
                    </View>

                    <View style={styles.weatherDetails}>
                        <View style={styles.weatherDetailItem}>
                            <Droplets size={16} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.weatherDetailText}>{weather.humidity}%</Text>
                        </View>
                        <View style={styles.weatherDetailItem}>
                            <Wind size={16} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.weatherDetailText}>{weather.windSpeed} km/h</Text>
                        </View>
                        <View style={styles.weatherDetailItem}>
                            <Cloud size={16} color="rgba(255,255,255,0.9)" />
                            <Text style={styles.weatherDetailText}>{weather.condition}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={handleWeatherRefresh} style={styles.refreshButton}>
                        <RefreshCw size={14} color="rgba(255,255,255,0.7)" style={styles.refreshIcon} />
                        <Text style={styles.tapToRefresh}>Tap to refresh</Text>
                    </TouchableOpacity>
                </LinearGradient>
            ) : null}

            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: colors.primaryDark }]}>Quick Actions</Text>

            <View style={styles.quickActions}>
                <TouchableOpacity
                    style={[styles.actionCard, { backgroundColor: colors.card }]}
                    onPress={() => onNavigate('grow-guide')}
                >
                    <LinearGradient
                        colors={['#10b981', '#059669']}
                        style={styles.actionIcon}
                    >
                        <BookOpen size={24} color="white" />
                    </LinearGradient>
                    <Text style={[styles.actionTitle, { color: colors.text }]}>Grow Guide</Text>
                    <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                        26 plants for terrace
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, { backgroundColor: colors.card }]}
                    onPress={() => onNavigate('crop-tracker')}
                >
                    <LinearGradient
                        colors={['#3b82f6', '#2563eb']}
                        style={styles.actionIcon}
                    >
                        <Sprout size={24} color="white" />
                    </LinearGradient>
                    <Text style={[styles.actionTitle, { color: colors.text }]}>My Crops</Text>
                    <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                        Track your plants
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, { backgroundColor: colors.card }]}
                    onPress={() => onNavigate('disease-detection')}
                >
                    <LinearGradient
                        colors={['#f59e0b', '#d97706']}
                        style={styles.actionIcon}
                    >
                        <Scan size={24} color="white" />
                    </LinearGradient>
                    <Text style={[styles.actionTitle, { color: colors.text }]}>Disease Scan</Text>
                    <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                        AI-powered detection
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Gardening Tip */}
            <View style={[styles.tipCard, { backgroundColor: colors.card }]}>
                <Text style={styles.tipEmoji}>💡</Text>
                <View style={styles.tipContent}>
                    <Text style={[styles.tipTitle, { color: colors.text }]}>Tip of the Day</Text>
                    <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                        {getTipBasedOnWeather(weather)}
                    </Text>
                </View>
            </View>

            {/* My Garden Stats */}
            <Text style={[styles.sectionTitle, { color: colors.primaryDark }]}>My Garden Stats</Text>
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                    <View style={[styles.statIconContainer, { backgroundColor: '#dcfce7' }]}>
                        <Sprout size={20} color={colors.primary} />
                    </View>
                    <Text style={[styles.statValue, { color: colors.text }]}>{activeCrops.length}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Plants</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                    <View style={[styles.statIconContainer, { backgroundColor: '#dbeafe' }]}>
                        <CheckCircle size={20} color="#2563eb" />
                    </View>
                    <Text style={[styles.statValue, { color: colors.text }]}>
                        {activeCrops.filter(c => c.nextAction.toLowerCase().includes('harvest')).length}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Harvest</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                    <View style={[styles.statIconContainer, { backgroundColor: '#fee2e2' }]}>
                        <Flame size={20} color="#dc2626" />
                    </View>
                    <Text style={[styles.statValue, { color: colors.text }]}>3</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
                </View>
            </View>
            {/* Recent Activity */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.primaryDark, marginBottom: 0 }]}>Recent Activity</Text>
                <TouchableOpacity onPress={() => onNavigate('crop-tracker')}>
                    <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.activityList}>
                {activeCrops.slice(0, 3).map((crop, index) => (
                    <TouchableOpacity
                        key={crop.id}
                        style={[styles.activityCard, { backgroundColor: colors.card }]}
                        onPress={() => onNavigate('crop-tracker')}
                    >
                        <View style={styles.activityIcon}>
                            <Text style={{ fontSize: 24 }}>{crop.image}</Text>
                        </View>
                        <View style={styles.activityContent}>
                            <Text style={[styles.activityTitle, { color: colors.text }]}>{crop.name}</Text>
                            <Text style={[styles.activitySubtitle, { color: colors.textSecondary }]}>
                                {crop.nextAction}
                            </Text>
                        </View>
                        <View style={styles.activityTime}>
                            <Clock size={14} color={colors.textSecondary} />
                            <Text style={[styles.timeText, { color: colors.textSecondary }]}>2h</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Seasonal Highlights */}
            < View style={styles.sectionHeader} >
                <Text style={[styles.sectionTitle, { color: colors.primaryDark, marginBottom: 0 }]}>Perfect for Now 🍂</Text>
                <TouchableOpacity onPress={() => onNavigate('grow-guide')}>
                    <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
                </TouchableOpacity>
            </View >

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.seasonalList}
            >
                {MOCK_PLANTS.filter(p => p.season.includes('Year-round') || p.season.includes('Spring')).slice(0, 5).map((plant) => (
                    <TouchableOpacity
                        key={plant.id}
                        style={[styles.seasonalCard, { backgroundColor: colors.card }]}
                        onPress={() => onNavigate('grow-guide')}
                    >
                        <View style={styles.seasonalImageContainer}>
                            <Text style={{ fontSize: 32 }}>{plant.image}</Text>
                        </View>
                        <Text style={[styles.seasonalName, { color: colors.text }]}>{plant.name}</Text>
                        <View style={[styles.difficultyBadge, {
                            backgroundColor: plant.difficulty === 'Easy' ? '#dcfce7' : '#fef3c7'
                        }]}>
                            <Text style={[styles.difficultyText, {
                                color: plant.difficulty === 'Easy' ? '#166534' : '#92400e'
                            }]}>{plant.difficulty}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ScrollView >
    );
}

function getTipBasedOnWeather(weather: WeatherData | null): string {
    if (!weather) return 'Water your plants early in the morning for best absorption!';

    const temp = weather.temperature;
    const weatherType = weather.weatherType;

    if (weatherType === 'rain') {
        return 'Rainy day! Skip watering and ensure proper drainage for your containers.';
    }

    if (temp > 35) {
        return 'Very hot today! Water your plants twice - morning and evening. Provide shade if possible.';
    }

    if (temp > 30) {
        return 'Hot weather! Increase watering frequency and mulch to retain moisture.';
    }

    if (temp < 15) {
        return 'Cool weather! Reduce watering and protect sensitive plants from cold.';
    }

    if (weatherType === 'clear') {
        return 'Perfect sunny day! Great time for transplanting and pruning.';
    }

    return 'Check soil moisture before watering - stick your finger 2 inches deep!';
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0fdf4',
    },
    scrollContent: {
        paddingBottom: 120, // Extra space for floating chatbot button
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 16,
    },
    greeting: {
        fontSize: 14,
        color: '#6b7280',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#166534',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#dcfce7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    weatherCard: {
        marginHorizontal: 20,
        marginBottom: 24,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    weatherHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    weatherLocation: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 4,
    },
    weatherDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textTransform: 'capitalize',
    },
    weatherEmoji: {
        fontSize: 48,
    },
    weatherMain: {
        marginBottom: 16,
    },
    temperature: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },
    feelsLike: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    weatherDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
    },
    weatherDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    weatherDetailText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: '500',
    },
    tapToRefresh: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        paddingVertical: 8,
        gap: 6,
    },
    refreshIcon: {
        opacity: 0.7,
    },
    loadingText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 12,
    },
    errorText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 12,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 12,
        paddingVertical: 8,
    },
    retryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#166534',
        marginHorizontal: 20,
        marginBottom: 16,
    },
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 24,
    },
    actionCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
        textAlign: 'center',
    },
    actionSubtitle: {
        fontSize: 11,
        color: '#6b7280',
        textAlign: 'center',
    },
    tipCard: {
        marginHorizontal: 20,
        marginBottom: 24,
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'white',
        flexDirection: 'row',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    tipEmoji: {
        fontSize: 32,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    tipText: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '600',
    },
    activityList: {
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 24,
    },
    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    activityIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    activitySubtitle: {
        fontSize: 13,
    },
    activityTime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        fontSize: 12,
    },
    seasonalList: {
        paddingHorizontal: 20,
        gap: 12,
        paddingBottom: 24,
    },
    seasonalCard: {
        width: 120,
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    seasonalImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    seasonalName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    difficultyText: {
        fontSize: 10,
        fontWeight: '600',
    },
});

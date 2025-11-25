import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ImageBackground, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, Flame, Trophy, CheckCircle2, Circle, Star, ChevronRight, Lock, X } from 'lucide-react-native';
import { useApp, Challenge } from '../context/AppContext';
import Confetti from './Confetti';

const { width } = Dimensions.get('window');

export default function RewardsScreen() {
    const { colors, isDarkMode, userPoints, userLevel, userStreak, dailyChallenges, completeChallenge, userName, badges, setModalOpen } = useApp();
    const [showConfetti, setShowConfetti] = useState(false);
    const [showBadgesModal, setShowBadgesModal] = useState(false);

    useEffect(() => {
        setModalOpen(showBadgesModal);
        return () => setModalOpen(false);
    }, [showBadgesModal]);

    const nextLevelPoints = userLevel * 1000;
    const currentLevelStart = (userLevel - 1) * 1000;
    const progress = ((userPoints - currentLevelStart) / (nextLevelPoints - currentLevelStart)) * 100;

    const handleCompleteChallenge = (id: string) => {
        completeChallenge(id);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    const getLevelTitle = (level: number) => {
        if (level < 2) return 'Seedling 🌱';
        if (level < 5) return 'Sprout 🌿';
        if (level < 10) return 'Gardener 🌻';
        if (level < 20) return 'Green Thumb 🧤';
        return 'Master Gardener 🌳';
    };

    const renderBadgesModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={showBadgesModal}
            onRequestClose={() => setShowBadgesModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1f2937' : 'white' }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>All Badges</Text>
                        <TouchableOpacity onPress={() => setShowBadgesModal(false)} style={styles.closeButton}>
                            <X size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        <View style={styles.badgesGrid}>
                            {badges.map((badge) => (
                                <View key={badge.id} style={[styles.modalBadgeItem, { backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }]}>
                                    <View style={[styles.modalBadgeIcon, { backgroundColor: badge.earned ? '#dcfce7' : '#e5e7eb' }]}>
                                        <Text style={styles.modalBadgeEmoji}>{badge.icon}</Text>
                                        {!badge.earned && (
                                            <View style={styles.modalLockOverlay}>
                                                <Lock size={16} color="#6b7280" />
                                            </View>
                                        )}
                                    </View>
                                    <View style={styles.modalBadgeInfo}>
                                        <Text style={[styles.modalBadgeName, { color: colors.text }]}>{badge.name}</Text>
                                        <Text style={[styles.modalBadgeDesc, { color: colors.textSecondary }]}>{badge.description}</Text>
                                        {!badge.earned && (
                                            <View style={styles.modalProgressContainer}>
                                                <View style={styles.modalProgressBar}>
                                                    <View style={[styles.modalProgressFill, { width: `${badge.progress}%` }]} />
                                                </View>
                                                <Text style={styles.modalProgressText}>{Math.round(badge.progress)}%</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {showConfetti && <Confetti />}
            {renderBadgesModal()}

            <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
                        <Text style={[styles.userName, { color: colors.text }]}>{userName || 'Gardener'}</Text>
                    </View>
                    <View style={styles.streakBadge}>
                        <Flame size={20} color="#f59e0b" fill="#f59e0b" />
                        <Text style={styles.streakText}>{userStreak} Day Streak</Text>
                    </View>
                </View>

                {/* Level Card */}
                <LinearGradient
                    colors={['#16a34a', '#15803d']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.levelCard}
                >
                    <View style={styles.levelHeader}>
                        <View>
                            <Text style={styles.levelLabel}>Current Level</Text>
                            <Text style={styles.levelTitle}>{getLevelTitle(userLevel)}</Text>
                        </View>
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelNumber}>{userLevel}</Text>
                        </View>
                    </View>

                    <View style={styles.progressSection}>
                        <View style={styles.progressLabels}>
                            <Text style={styles.progressText}>{userPoints} XP</Text>
                            <Text style={styles.progressText}>{nextLevelPoints} XP</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]} />
                        </View>
                        <Text style={styles.xpToGo}>{nextLevelPoints - userPoints} XP to next level</Text>
                    </View>
                </LinearGradient>

                {/* Daily Challenges */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Challenges</Text>
                    <View style={styles.challengesList}>
                        {dailyChallenges.map((challenge) => (
                            <TouchableOpacity
                                key={challenge.id}
                                style={[styles.challengeCard, { backgroundColor: colors.card }]}
                                onPress={() => !challenge.completed && handleCompleteChallenge(challenge.id)}
                                disabled={challenge.completed}
                            >
                                <View style={styles.challengeLeft}>
                                    <View style={[styles.challengeIcon, { backgroundColor: challenge.completed ? '#dcfce7' : '#f3f4f6' }]}>
                                        {challenge.completed ? (
                                            <CheckCircle2 size={24} color="#16a34a" />
                                        ) : (
                                            <Circle size={24} color={colors.textSecondary} />
                                        )}
                                    </View>
                                    <View>
                                        <Text style={[styles.challengeText, {
                                            color: colors.text,
                                            textDecorationLine: challenge.completed ? 'line-through' : 'none',
                                            opacity: challenge.completed ? 0.6 : 1
                                        }]}>
                                            {challenge.text}
                                        </Text>
                                        <Text style={[styles.challengeReward, { color: '#f59e0b' }]}>+{challenge.reward} XP</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Badges Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Badges</Text>
                        <TouchableOpacity onPress={() => setShowBadgesModal(true)}>
                            <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
                        {badges.map((badge) => (
                            <View key={badge.id} style={[styles.badgeItem, { backgroundColor: colors.card }]}>
                                <View style={[styles.badgeIconContainer, { backgroundColor: badge.earned ? '#dcfce7' : '#f3f4f6' }]}>
                                    <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                                    {!badge.earned && (
                                        <View style={styles.lockOverlay}>
                                            <Lock size={12} color="#6b7280" />
                                        </View>
                                    )}
                                </View>
                                <Text style={[styles.badgeName, { color: colors.text }]} numberOfLines={1}>{badge.name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Leaderboard Preview */}
                <View style={[styles.section, { marginBottom: 40 }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Gardeners</Text>
                    <View style={[styles.leaderboardCard, { backgroundColor: colors.card }]}>
                        {[
                            { rank: 1, name: 'Sarah Green', xp: 5420, avatar: '👩‍🌾' },
                            { rank: 2, name: 'Mike Plants', xp: 4850, avatar: '👨‍🌾' },
                            { rank: 3, name: 'Eco Warrior', xp: 4200, avatar: '🦸‍♂️' },
                        ].map((user, index) => (
                            <View key={index} style={[styles.leaderboardRow, index !== 2 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                                <View style={styles.rankContainer}>
                                    {index === 0 ? <Trophy size={20} color="#eab308" /> :
                                        index === 1 ? <Trophy size={20} color="#94a3b8" /> :
                                            <Trophy size={20} color="#b45309" />}
                                </View>
                                <Text style={styles.leaderboardAvatar}>{user.avatar}</Text>
                                <Text style={[styles.leaderboardName, { color: colors.text }]}>{user.name}</Text>
                                <Text style={[styles.leaderboardXP, { color: colors.primary }]}>{user.xp} XP</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 14,
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fffbeb',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: '#fcd34d',
    },
    streakText: {
        color: '#b45309',
        fontWeight: '700',
        fontSize: 14,
    },
    levelCard: {
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        shadowColor: '#16a34a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    levelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    levelLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 4,
    },
    levelTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    levelBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    levelNumber: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressSection: {
        gap: 8,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontWeight: '600',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#fbbf24',
        borderRadius: 4,
    },
    xpToGo: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    seeAll: {
        fontSize: 14,
        fontWeight: '600',
    },
    challengesList: {
        gap: 12,
    },
    challengeCard: {
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    challengeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    challengeIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    challengeText: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    challengeReward: {
        fontSize: 12,
        fontWeight: '700',
    },
    badgesScroll: {
        paddingRight: 20,
        gap: 12,
    },
    badgeItem: {
        width: 100,
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        gap: 8,
    },
    badgeIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    badgeEmoji: {
        fontSize: 30,
    },
    lockOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#e5e7eb',
        borderRadius: 10,
        padding: 4,
    },
    badgeName: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    leaderboardCard: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    leaderboardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    rankContainer: {
        width: 30,
        alignItems: 'center',
    },
    leaderboardAvatar: {
        fontSize: 20,
    },
    leaderboardName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
    },
    leaderboardXP: {
        fontSize: 14,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '80%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
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
    closeButton: {
        padding: 4,
    },
    modalScroll: {
        paddingBottom: 40,
    },
    badgesGrid: {
        gap: 16,
    },
    modalBadgeItem: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        gap: 16,
    },
    modalBadgeIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    modalBadgeEmoji: {
        fontSize: 32,
    },
    modalLockOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#e5e7eb',
        borderRadius: 12,
        padding: 4,
    },
    modalBadgeInfo: {
        flex: 1,
    },
    modalBadgeName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    modalBadgeDesc: {
        fontSize: 13,
        marginBottom: 8,
    },
    modalProgressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    modalProgressBar: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    modalProgressFill: {
        height: '100%',
        backgroundColor: '#16a34a',
        borderRadius: 3,
    },
    modalProgressText: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '600',
    },
});

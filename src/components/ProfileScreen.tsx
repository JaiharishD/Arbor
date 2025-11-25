import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Edit2, Settings as SettingsIcon, Bell, Lock, Globe, Info, LogOut, ChevronRight, Sprout, MessageSquare, Trash2 } from 'lucide-react-native';
import { useApp, UserProfilePost } from '../context/AppContext';
import { Crop } from '../types';
import { MOCK_CROPS } from '../data/mockData';
import EditProfileModal from './EditProfileModal';
import CropDetailModal from './CropDetailModal';
import CreatePostModal from './CreatePostModal';
import { LanguageModal, AboutModal } from './SettingsModals';

export default function ProfileScreen() {
    const { userName, logout, isDarkMode, toggleTheme, colors, setModalOpen, userPosts, addUserPost, deleteUserPost, badges, activeCrops, updateCrop } = useApp();
    const [activeTab, setActiveTab] = useState('crops');
    const [showEditModal, setShowEditModal] = useState(false);
    const [displayName, setDisplayName] = useState(userName);
    const [userBio, setUserBio] = useState('🌱 Garden Enthusiast');
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [selectedCrop, setSelectedCrop] = useState<any>(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [privacyPublic, setPrivacyPublic] = useState(false);
    const [language, setLanguage] = useState('English');
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);

    const handleSaveProfile = (name: string, bio: string, avatar: string | null) => {
        setDisplayName(name);
        setUserBio(bio);
        if (avatar) {
            setAvatarUri(avatar);
        }
        Alert.alert('Success', 'Profile updated successfully! 🌿');
    };

    const handleCropPress = (crop: any) => {
        setSelectedCrop(crop);
        setShowCropModal(true);
        setModalOpen(true);
    };

    const handleCreatePost = (content: string, image: string | null) => {
        const newPost: UserProfilePost = {
            id: Date.now().toString(),
            content,
            image,
            timestamp: 'Just now',
            likes: 0,
            comments: 0
        };
        addUserPost(newPost);
    };

    const handleDeletePost = (postId: string) => {
        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteUserPost(postId)
                }
            ]
        );
    };

    const handleUpdateCrop = (cropId: number, updates: Partial<Crop>) => {
        updateCrop(cropId, updates);

        // Also update selectedCrop if it's the one being updated
        if (selectedCrop && selectedCrop.id === cropId) {
            setSelectedCrop((prev: any) => ({ ...prev, ...updates }));
        }
    };

    const toggleNotifications = () => {
        setNotificationsEnabled(prev => !prev);
        if (!notificationsEnabled) {
            Alert.alert('Notifications Enabled', 'You will now receive updates about your crops! 🔔');
        }
    };

    const togglePrivacy = () => {
        setPrivacyPublic(prev => !prev);
        Alert.alert(
            !privacyPublic ? 'Public Profile' : 'Private Profile',
            !privacyPublic ? 'Your profile is now visible to the community. 🌍' : 'Your profile is now hidden from the community. 🔒'
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
            <LinearGradient
                colors={isDarkMode ? [colors.secondary, colors.primaryDark] : ['#22c55e', '#059669']}
                style={styles.profileHeader}
            >
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        {avatarUri ? (
                            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarText}>
                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        )}
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.userName}>{displayName || userName || 'User'}</Text>
                        <Text style={styles.userRole}>{userBio}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.editButton}
                        activeOpacity={0.7}
                        onPress={() => setShowEditModal(true)}
                    >
                        <Edit2 size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{activeCrops.length}</Text>
                        <Text style={styles.statLabel}>Crops</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{userPosts.length}</Text>
                        <Text style={styles.statLabel}>Posts</Text>
                    </View>

                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{activeCrops.length * 15 + userPosts.length * 5}</Text>
                        <Text style={styles.statLabel}>Eco Score</Text>
                    </View>
                </View>

                {/* Badges Section */}
                <View style={styles.badgesSection}>
                    <Text style={styles.badgesTitle}>Earned Badges</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScroll}>
                        {badges.filter(b => b.earned).length > 0 ? (
                            badges.filter(b => b.earned).map(badge => (
                                <View key={badge.id} style={styles.badgeItem}>
                                    <View style={styles.badgeIconContainer}>
                                        <Text style={styles.badgeIcon}>{badge.icon}</Text>
                                    </View>
                                    <Text style={styles.badgeName} numberOfLines={1}>{badge.name}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noBadgesText}>Keep gardening to earn badges! 🏆</Text>
                        )}
                    </ScrollView>
                </View>
            </LinearGradient>

            <View style={[styles.tabBar, { backgroundColor: isDarkMode ? colors.card : '#f3f4f6' }]}>
                <TouchableOpacity
                    onPress={() => setActiveTab('crops')}
                    style={[styles.tabButton, activeTab === 'crops' && { backgroundColor: isDarkMode ? colors.background : 'white' }]}
                >
                    <Sprout size={16} color={activeTab === 'crops' ? colors.primary : colors.textSecondary} />
                    <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === 'crops' && { color: colors.primary }]}>My Crops</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('posts')}
                    style={[styles.tabButton, activeTab === 'posts' && { backgroundColor: isDarkMode ? colors.background : 'white' }]}
                >
                    <MessageSquare size={16} color={activeTab === 'posts' ? colors.primary : colors.textSecondary} />
                    <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === 'posts' && { color: colors.primary }]}>My Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('settings')}
                    style={[styles.tabButton, activeTab === 'settings' && { backgroundColor: isDarkMode ? colors.background : 'white' }]}
                >
                    <SettingsIcon size={16} color={activeTab === 'settings' ? colors.primary : colors.textSecondary} />
                    <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === 'settings' && { color: colors.primary }]}>Settings</Text>
                </TouchableOpacity>
            </View>

            {
                activeTab === 'crops' && (
                    <View style={styles.grid}>
                        {activeCrops.map(crop => (
                            <TouchableOpacity
                                key={crop.id}
                                style={[styles.cropCard, { backgroundColor: colors.card }]}
                                activeOpacity={0.7}
                                onPress={() => handleCropPress(crop)}
                            >
                                <Text style={styles.cropEmoji}>{crop.image}</Text>
                                <Text style={[styles.cropName, { color: colors.text }]}>{crop.name}</Text>
                                <Text style={[styles.cropStage, { color: colors.textSecondary }]}>{crop.stage}</Text>
                                <View style={[styles.progressBar, { backgroundColor: isDarkMode ? '#374151' : '#e5e7eb' }]}>
                                    <View style={[styles.progressFill, { width: `${crop.progress}%`, backgroundColor: colors.primary }]} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )
            }

            {
                activeTab === 'posts' && (
                    <View style={styles.list}>
                        <TouchableOpacity
                            style={styles.newPostButton}
                            activeOpacity={0.7}
                            onPress={() => {
                                setShowCreatePostModal(true);
                                setModalOpen(true);
                            }}
                        >
                            <LinearGradient
                                colors={isDarkMode ? [colors.primary, colors.primaryDark] : ['#22c55e', '#16a34a']}
                                style={styles.newPostGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <MessageSquare size={20} color="white" />
                                <Text style={styles.newPostText}>Create New Post</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {userPosts.map(post => (
                            <TouchableOpacity key={post.id} style={[styles.postCard, { backgroundColor: colors.card }]} activeOpacity={0.7}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Text style={[styles.postText, { color: colors.text, flex: 1, marginRight: 8 }]}>{post.content}</Text>
                                    <TouchableOpacity
                                        onPress={() => handleDeletePost(post.id)}
                                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    >
                                        <Trash2 size={18} color={isDarkMode ? '#ef4444' : '#dc2626'} />
                                    </TouchableOpacity>
                                </View>
                                {post.image && (
                                    <Image
                                        source={{ uri: post.image }}
                                        style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 12 }}
                                        resizeMode="cover"
                                    />
                                )}
                                <Text style={[styles.postMeta, { color: colors.textSecondary }]}>
                                    {post.timestamp} · {post.likes} likes · {post.comments} comments
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )
            }

            {
                activeTab === 'settings' && (
                    <View style={styles.list}>
                        <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
                            <TouchableOpacity style={styles.settingItem} activeOpacity={1}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                                    <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? colors.background : '#f3f4f6' }]}>
                                        <SettingsIcon size={20} color={colors.primary} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
                                        <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Switch to dark theme</Text>
                                    </View>
                                    <Switch
                                        value={isDarkMode}
                                        onValueChange={toggleTheme}
                                        trackColor={{ false: '#d1d5db', true: colors.primary }}
                                        thumbColor={'white'}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            <View style={styles.settingsList}>
                                <TouchableOpacity style={styles.settingItem} activeOpacity={1}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                                        <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? colors.background : '#f3f4f6' }]}>
                                            <Bell size={20} color={colors.primary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.settingTitle, { color: colors.text }]}>Notifications</Text>
                                            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Manage your alerts</Text>
                                        </View>
                                        <Switch
                                            value={notificationsEnabled}
                                            onValueChange={toggleNotifications}
                                            trackColor={{ false: '#d1d5db', true: colors.primary }}
                                            thumbColor={'white'}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                <TouchableOpacity style={styles.settingItem} activeOpacity={1}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                                        <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? colors.background : '#f3f4f6' }]}>
                                            <Lock size={20} color={colors.primary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.settingTitle, { color: colors.text }]}>Public Profile</Text>
                                            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Visible to community</Text>
                                        </View>
                                        <Switch
                                            value={privacyPublic}
                                            onValueChange={togglePrivacy}
                                            trackColor={{ false: '#d1d5db', true: colors.primary }}
                                            thumbColor={'white'}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                <TouchableOpacity style={styles.settingItem} activeOpacity={0.7} onPress={() => setShowLanguageModal(true)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                                        <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? colors.background : '#f3f4f6' }]}>
                                            <Globe size={20} color={colors.primary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.settingTitle, { color: colors.text }]}>Language</Text>
                                            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{language}</Text>
                                        </View>
                                        <ChevronRight size={20} color={colors.textSecondary} />
                                    </View>
                                </TouchableOpacity>
                                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                <TouchableOpacity style={styles.settingItem} activeOpacity={0.7} onPress={() => setShowAboutModal(true)}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                                        <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? colors.background : '#f3f4f6' }]}>
                                            <Info size={20} color={colors.primary} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.settingTitle, { color: colors.text }]}>About Arbor</Text>
                                            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Version 1.0.0</Text>
                                        </View>
                                        <ChevronRight size={20} color={colors.textSecondary} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={logout}
                            style={[styles.logoutButton, { backgroundColor: isDarkMode ? '#7f1d1d' : '#fef2f2' }]}
                            activeOpacity={0.7}
                        >
                            <LogOut size={20} color={isDarkMode ? '#fca5a5' : '#dc2626'} />
                            <Text style={[styles.logoutText, { color: isDarkMode ? '#fca5a5' : '#dc2626' }]}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            <EditProfileModal
                visible={showEditModal}
                onClose={() => setShowEditModal(false)}
                currentName={displayName || userName || ''}
                onSave={handleSaveProfile}
            />

            <CropDetailModal
                visible={showCropModal}
                onClose={() => {
                    setShowCropModal(false);
                    setModalOpen(false);
                }}
                crop={selectedCrop}
                onUpdateCrop={handleUpdateCrop}
            />

            <CreatePostModal
                visible={showCreatePostModal}
                onClose={() => {
                    setShowCreatePostModal(false);
                    setModalOpen(false);
                }}
                onPost={handleCreatePost}
            />

            <LanguageModal
                visible={showLanguageModal}
                onClose={() => setShowLanguageModal(false)}
                selectedLanguage={language}
                onSelectLanguage={setLanguage}
                isDarkMode={isDarkMode}
                colors={colors}
            />

            <AboutModal
                visible={showAboutModal}
                onClose={() => setShowAboutModal(false)}
                isDarkMode={isDarkMode}
                colors={colors}
            />
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0fdf4',
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 140,
    },
    profileHeader: {
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    avatar: {
        width: 64,
        height: 64,
        backgroundColor: 'white',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#16a34a',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    userRole: {
        fontSize: 14,
        color: '#dcfce7',
        marginTop: 2,
    },
    editButton: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 4,
    },
    badgesSection: {
        marginTop: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 12,
    },
    badgesTitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    badgesScroll: {
        gap: 12,
        paddingRight: 12,
    },
    badgeItem: {
        alignItems: 'center',
        width: 60,
        gap: 4,
    },
    badgeIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    badgeIcon: {
        fontSize: 20,
    },
    badgeName: {
        color: 'white',
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '500',
    },
    noBadgesText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        fontStyle: 'italic',
        marginLeft: 4,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#f3f4f6',
        padding: 4,
        borderRadius: 12,
        marginBottom: 20,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4b5563',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    cropCard: {
        width: '30%',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    cropEmoji: {
        fontSize: 36,
        marginBottom: 8,
    },
    cropName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
        marginBottom: 4,
    },
    cropStage: {
        fontSize: 10,
        color: '#6b7280',
        marginBottom: 8,
    },
    progressBar: {
        width: '100%',
        height: 4,
        backgroundColor: '#e5e7eb',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#22c55e',
        borderRadius: 2,
    },
    list: {
        gap: 12,
    },
    postCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    postText: {
        fontSize: 15,
        color: '#374151',
        marginBottom: 8,
        lineHeight: 22,
    },
    postMeta: {
        fontSize: 12,
        color: '#6b7280',
    },
    settingsCard: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
    },
    settingsList: {
        gap: 0,
    },
    settingItem: {
        paddingVertical: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#f3f4f6',
    },
    logoutButton: {
        backgroundColor: '#fef2f2',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#dc2626',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    logoutText: {
        color: '#dc2626',
        fontWeight: '600',
        fontSize: 16,
    },
    newPostButton: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    newPostGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        gap: 10,
    },
    newPostText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

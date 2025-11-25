import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, ShoppingBag, MessageCircle, Award, User, Bot } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DashboardScreen from './DashboardScreen';
import MarketplaceScreen from './MarketplaceScreen';
import CommunityScreen from './CommunityScreen';
import RewardsScreen from './RewardsScreen';
import ProfileScreen from './ProfileScreen';
import GrowGuideScreen from './GrowGuideScreen';
import CropTrackerScreen from './CropTrackerScreen';
import DiseaseDetectionScreen from './DiseaseDetectionScreen';
import TabButton from './TabButton';

import ChatScreen from './ChatScreen';

type SubScreen = 'grow-guide' | 'crop-tracker' | 'disease-detection' | 'chat' | null;

import { useApp } from '../context/AppContext';

export default function MainApp() {
    const { colors, isDarkMode, isModalOpen, isTabBarVisible } = useApp();
    const [activeTab, setActiveTab] = useState('home');
    const [activeSubScreen, setActiveSubScreen] = useState<SubScreen>(null);

    const renderContent = () => {
        if (activeSubScreen === 'grow-guide') return <GrowGuideScreen onBack={() => setActiveSubScreen(null)} />;
        if (activeSubScreen === 'crop-tracker') return <CropTrackerScreen onBack={() => setActiveSubScreen(null)} />;
        if (activeSubScreen === 'disease-detection') return <DiseaseDetectionScreen onBack={() => setActiveSubScreen(null)} />;
        if (activeSubScreen === 'chat') return <ChatScreen onBack={() => setActiveSubScreen(null)} />;

        switch (activeTab) {
            case 'home': return <DashboardScreen onNavigate={setActiveSubScreen} />;
            case 'marketplace': return <MarketplaceScreen />;
            case 'community': return <CommunityScreen onNavigate={setActiveSubScreen} />;
            case 'rewards': return <RewardsScreen />;
            case 'profile': return <ProfileScreen />;
            default: return <DashboardScreen onNavigate={setActiveSubScreen} />;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                {renderContent()}
            </View>

            {!activeSubScreen && !isModalOpen && isTabBarVisible && (
                <>
                    <View style={[styles.tabBar, { backgroundColor: isDarkMode ? colors.card : 'white', borderTopColor: isDarkMode ? colors.border : '#dcfce7' }]}>
                        <TabButton icon={Home} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                        <TabButton icon={ShoppingBag} label="Market" active={activeTab === 'marketplace'} onClick={() => setActiveTab('marketplace')} />
                        <TabButton icon={MessageCircle} label="Forum" active={activeTab === 'community'} onClick={() => setActiveTab('community')} />
                        <TabButton icon={Award} label="Rewards" active={activeTab === 'rewards'} onClick={() => setActiveTab('rewards')} />
                        <TabButton icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    </View>

                    {(activeTab === 'home' || activeTab === 'profile') && (
                        <TouchableOpacity
                            style={styles.fabContainer}
                            onPress={() => setActiveSubScreen('chat')}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={['#facc15', '#16a34a']} // Yellow-400 to Green-600
                                style={styles.fabButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Bot size={32} color="white" />
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0fdf4', // green-50
    },
    content: {
        flex: 1,
        marginBottom: 60, // Space for tab bar
    },
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#dcfce7', // green-100
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        shadowColor: '#facc15',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },
    fabButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, FlatList } from 'react-native';
import { X, Check, Globe, Info } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface LanguageModalProps {
    visible: boolean;
    onClose: () => void;
    selectedLanguage: string;
    onSelectLanguage: (lang: string) => void;
    isDarkMode: boolean;
    colors: any;
}

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export const LanguageModal = ({ visible, onClose, selectedLanguage, onSelectLanguage, isDarkMode, colors }: LanguageModalProps) => {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <BlurView intensity={20} tint={isDarkMode ? 'dark' : 'light'} style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1f2937' : 'white' }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: isDarkMode ? '#374151' : '#f3f4f6' }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Select Language</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={LANGUAGES}
                        keyExtractor={(item) => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.languageItem, { borderBottomColor: isDarkMode ? '#374151' : '#f3f4f6' }]}
                                onPress={() => {
                                    onSelectLanguage(item.name);
                                    onClose();
                                }}
                            >
                                <Text style={styles.languageFlag}>{item.flag}</Text>
                                <Text style={[styles.languageName, { color: colors.text }]}>{item.name}</Text>
                                {selectedLanguage === item.name && (
                                    <Check size={20} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </BlurView>
        </Modal>
    );
};

interface AboutModalProps {
    visible: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    colors: any;
}

export const AboutModal = ({ visible, onClose, isDarkMode, colors }: AboutModalProps) => {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <BlurView intensity={20} tint={isDarkMode ? 'dark' : 'light'} style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#1f2937' : 'white' }]}>
                    <View style={styles.aboutHeader}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>🌱</Text>
                        </View>
                        <Text style={[styles.appName, { color: colors.text }]}>Arbor</Text>
                        <Text style={[styles.versionText, { color: colors.textSecondary }]}>Version 1.0.0</Text>
                    </View>

                    <View style={styles.aboutBody}>
                        <Text style={[styles.aboutDescription, { color: colors.text }]}>
                            Arbor is your personal gardening companion. Track your crops, get AI-powered care tips, and connect with a community of green thumbs.
                        </Text>

                        <View style={[styles.creditBox, { backgroundColor: isDarkMode ? '#374151' : '#f3f4f6' }]}>
                            <Text style={[styles.creditText, { color: colors.textSecondary }]}>
                                Made with ❤️ by the Arbor Team
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.closeAboutButton, { backgroundColor: colors.primary }]}
                        onPress={onClose}
                    >
                        <Text style={styles.closeAboutButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContent: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    languageFlag: {
        fontSize: 24,
        marginRight: 16,
    },
    languageName: {
        fontSize: 16,
        flex: 1,
        fontWeight: '500',
    },
    aboutHeader: {
        alignItems: 'center',
        padding: 32,
        paddingBottom: 16,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#dcfce7',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 40,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    versionText: {
        fontSize: 14,
    },
    aboutBody: {
        padding: 24,
        paddingTop: 0,
    },
    aboutDescription: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    creditBox: {
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    creditText: {
        fontSize: 13,
        fontWeight: '500',
    },
    closeAboutButton: {
        margin: 20,
        marginTop: 0,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeAboutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

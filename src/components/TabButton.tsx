import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { type LucideIcon } from 'lucide-react-native';

interface TabButtonProps {
    icon: LucideIcon;
    label: string;
    active: boolean;
    onClick: () => void;
}

import { useApp } from '../context/AppContext';

const TabButton: React.FC<TabButtonProps> = ({ icon: Icon, label, active, onClick }) => {
    const { colors } = useApp();
    return (
        <TouchableOpacity
            onPress={onClick}
            style={styles.container}
            activeOpacity={0.7}
        >
            <Icon size={24} color={active ? colors.primary : colors.textSecondary} />
            <Text style={[styles.label, { color: active ? colors.primary : colors.textSecondary, fontWeight: active ? '500' : '400' }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    label: {
        fontSize: 12,
        marginTop: 4,
    },
    activeLabel: {
        color: '#16a34a', // green-600
        fontWeight: '500',
    },
    inactiveLabel: {
        color: '#9ca3af', // gray-400
    },
});

export default TabButton;

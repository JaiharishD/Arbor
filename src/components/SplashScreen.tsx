import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Leaf } from 'lucide-react-native';

export default function SplashScreen() {
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <LinearGradient
            colors={['#4ade80', '#10b981', '#16a34a']} // green-400, emerald-500, green-600
            style={styles.container}
        >
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.iconContainer}>
                    <Leaf size={80} color="#16a34a" />
                </View>
                <Text style={styles.title}>ARBOR</Text>
                <Text style={styles.subtitle}>Grow. Learn. Trade. Share.</Text>
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        backgroundColor: 'white',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#dcfce7', // green-100
        letterSpacing: 1,
        fontStyle: 'italic',
    }
});

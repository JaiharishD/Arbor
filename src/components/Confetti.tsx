import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const CONFETTI_COUNT = 50;
const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

interface ConfettiPieceProps {
    startX: number;
    delay: number;
}

const ConfettiPiece = ({ startX, delay }: ConfettiPieceProps) => {
    const translateY = useRef(new Animated.Value(-50)).current;
    const rotate = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: height + 50,
                    duration: 2000 + Math.random() * 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(rotate, {
                    toValue: 1,
                    duration: 2000 + Math.random() * 1000,
                    useNativeDriver: true,
                }),
                Animated.sequence([
                    Animated.delay(1500),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ]),
            ]),
        ]).start();
    }, []);

    const spin = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', `${360 * (Math.random() > 0.5 ? 1 : -1)}deg`],
    });

    return (
        <Animated.View
            style={[
                styles.confetti,
                {
                    left: startX,
                    backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
                    transform: [{ translateY }, { rotate: spin }],
                    opacity,
                },
            ]}
        />
    );
};

export default function Confetti() {
    const pieces = Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
        id: i,
        startX: Math.random() * width,
        delay: Math.random() * 500,
    }));

    return (
        <View style={styles.container} pointerEvents="none">
            {pieces.map((piece) => (
                <ConfettiPiece key={piece.id} startX={piece.startX} delay={piece.delay} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
    },
    confetti: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        top: 0,
    },
});

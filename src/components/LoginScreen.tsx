import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image
} from 'react-native';
import { Leaf, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
    const { login } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');

    // Animation for the leaf
    const bounceAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -20,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [bounceAnim]);

    const handleSubmit = () => {
        const displayName = isSignUp && name ? name : email.split('@')[0];
        if (displayName) {
            login(displayName);
        }
    };

    const handleQuickLogin = (name: string) => {
        login(name);
    };

    return (
        <LinearGradient
            colors={['#4ade80', '#10b981', '#16a34a']} // green-400, emerald-500, green-600
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Animated.View style={{ transform: [{ translateY: bounceAnim }], marginBottom: 4 }}>
                            <Leaf size={60} color="white" />
                        </Animated.View>
                        <Text style={styles.title}>Arbor</Text>
                        <Text style={styles.subtitle}>Grow. Learn. Trade. Share.</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </Text>

                        <View style={styles.form}>
                            {isSignUp && (
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Full Name</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Enter your name"
                                        placeholderTextColor="#9ca3af"
                                    />
                                </View>
                            )}

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Email Address</Text>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="you@example.com"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    placeholderTextColor="#9ca3af"
                                    secureTextEntry
                                />
                            </View>

                            {!isSignUp && (
                                <View style={styles.optionsRow}>
                                    <View style={styles.checkboxRow}>
                                        {/* Checkbox placeholder - implementing custom checkbox or using a library is better, but simple view for now */}
                                        <View style={styles.checkbox} />
                                        <Text style={styles.rememberText}>Remember me</Text>
                                    </View>
                                    <TouchableOpacity>
                                        <Text style={styles.forgotText}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <TouchableOpacity onPress={handleSubmit}>
                                <LinearGradient
                                    colors={['#22c55e', '#10b981']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.submitButton}
                                >
                                    <Text style={styles.submitButtonText}>
                                        {isSignUp ? 'Sign Up' : 'Login'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.switchContainer}>
                            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                                <Text style={styles.switchText}>
                                    {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                                    <Text style={styles.switchHighlight}>
                                        {isSignUp ? 'Login' : 'Sign Up'}
                                    </Text>
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <View style={styles.dividerTextContainer}>
                                <Text style={styles.dividerText}>Or continue with</Text>
                            </View>
                        </View>

                        <View style={styles.socialButtons}>
                            <TouchableOpacity
                                style={styles.socialButton}
                                onPress={() => handleQuickLogin('Google User')}
                            >
                                <Image
                                    source={require('../../assets/google-logo.png')}
                                    style={styles.googleIcon}
                                />
                                <Text style={styles.socialButtonText}>Google</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.socialButton}
                                onPress={() => handleQuickLogin('Guest')}
                            >
                                <User size={18} color="#374151" />
                                <Text style={styles.socialButtonText}>Guest</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.footerText}>
                        By continuing, you agree to our Terms & Privacy Policy
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    subtitle: {
        color: '#dcfce7', // green-100
        fontSize: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937', // gray-800
        marginBottom: 24,
        textAlign: 'center',
    },
    form: {
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151', // gray-700
    },
    input: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#d1d5db', // gray-300
        borderRadius: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 16,
        height: 16,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 4,
        marginRight: 8,
    },
    rememberText: {
        color: '#4b5563', // gray-600
        fontSize: 14,
    },
    forgotText: {
        color: '#16a34a', // green-600
        fontWeight: '500',
        fontSize: 14,
    },
    submitButton: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    switchContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    switchText: {
        fontSize: 14,
        color: '#4b5563', // gray-600
    },
    switchHighlight: {
        color: '#16a34a', // green-600
        fontWeight: '600',
    },
    dividerContainer: {
        marginTop: 24,
        position: 'relative',
        height: 20,
        justifyContent: 'center',
    },
    dividerLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#d1d5db', // gray-300
    },
    dividerTextContainer: {
        alignSelf: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
    },
    dividerText: {
        fontSize: 14,
        color: '#6b7280', // gray-500
    },
    socialButtons: {
        marginTop: 16,
        flexDirection: 'row',
        gap: 12,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
    },
    socialButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    googleIcon: {
        width: 18,
        height: 18,
    },
    footerText: {
        textAlign: 'center',
        color: '#dcfce7', // green-100
        fontSize: 12,
        marginTop: 24,
    },
});

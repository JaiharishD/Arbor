import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, Send, Bot, User } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { chatWithGrowBot } from '../services/geminiService';

interface ChatScreenProps {
    onBack: () => void;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onBack }) => {
    const { colors, isDarkMode, activeCrops } = useApp();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hello! I am GrowBot. I know about your garden. Ask me anything! 🌿', sender: 'bot', timestamp: new Date() }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    // Generate context string from active crops
    const cropContext = activeCrops.map(c => `${c.name} (${c.stage})`).join(', ');

    // Generate suggestions based on crops
    const suggestions = activeCrops.length > 0
        ? [
            `How is my ${activeCrops[0].name} doing?`,
            `Tips for ${activeCrops[0].name}`,
            `When to harvest ${activeCrops[0].name}?`,
            "General gardening tips"
        ]
        : ["Best plants for beginners", "How to water plants", "Composting tips"];

    const handleSend = async (text: string = inputText) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: text,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            const response = await chatWithGrowBot(userMsg.text, cropContext);
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I couldn't process that. Please try again.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>GrowBot Chat 🤖</Text>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map(msg => (
                    <View key={msg.id} style={[
                        styles.messageRow,
                        msg.sender === 'user' ? styles.userRow : styles.botRow
                    ]}>
                        {msg.sender === 'bot' && (
                            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                                <Bot size={16} color="white" />
                            </View>
                        )}
                        <View style={[
                            styles.messageBubble,
                            msg.sender === 'user'
                                ? { backgroundColor: colors.primary, borderBottomRightRadius: 2, shadowColor: colors.primary }
                                : { backgroundColor: isDarkMode ? '#374151' : 'white', borderBottomLeftRadius: 2, shadowColor: '#000' }
                        ]}>
                            <Text style={[
                                styles.messageText,
                                { color: msg.sender === 'user' ? 'white' : colors.text }
                            ]}>{msg.text}</Text>
                        </View>
                        {msg.sender === 'user' && (
                            <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
                                <User size={16} color={colors.primaryDark} />
                            </View>
                        )}
                    </View>
                ))}
                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>GrowBot is thinking...</Text>
                    </View>
                )}
            </ScrollView>

            <View style={styles.suggestionsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsContent}>
                    {suggestions.map((suggestion, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.suggestionChip, { backgroundColor: isDarkMode ? colors.card : '#e0f2fe', borderColor: colors.primary }]}
                            onPress={() => handleSend(suggestion)}
                        >
                            <Text style={[styles.suggestionText, { color: colors.primaryDark }]}>{suggestion}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: isDarkMode ? colors.background : '#f3f4f6',
                        color: colors.text
                    }]}
                    placeholder="Ask about your plants..."
                    placeholderTextColor={colors.textSecondary}
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={() => handleSend()}
                />
                <TouchableOpacity
                    onPress={() => handleSend()}
                    style={[styles.sendButton, { backgroundColor: colors.primary, opacity: inputText.trim() ? 1 : 0.5 }]}
                    disabled={!inputText.trim()}
                >
                    <Send size={20} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
        gap: 16,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    botRow: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageBubble: {
        padding: 14,
        borderRadius: 20,
        maxWidth: '80%',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginLeft: 40,
    },
    loadingText: {
        fontSize: 12,
    },
    suggestionsContainer: {
        height: 50,
        marginBottom: 8,
    },
    suggestionsContent: {
        paddingHorizontal: 16,
        alignItems: 'center',
        gap: 8,
    },
    suggestionChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    suggestionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    inputContainer: {
        padding: 16,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    input: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatScreen;

import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Image,
    FlatList,
    ListRenderItem,
    ScrollView,
} from 'react-native';
import { ChevronUp, ChevronDown, MessageCircle, X, Send, Plus, Award, Pin, TrendingUp, ImagePlus, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';
import { type Comment, type Post } from '../types';
import ImageGallery from './ImageGallery';
import PostCard from './PostCard';

interface CommunityScreenProps {
    onNavigate?: (screen: 'chat') => void;
}

export default function CommunityScreen({ onNavigate }: CommunityScreenProps) {
    const { colors, communityPosts, upvotePost, downvotePost, addComment, upvoteComment, downvoteComment, awardPost, userName, createPost, deleteCommunityPost, sortBy, setSortBy, addReaction } = useApp();
    const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [showAwardModal, setShowAwardModal] = useState(false);
    const [selectedPostForAward, setSelectedPostForAward] = useState<number | null>(null);
    const [newPostText, setNewPostText] = useState('');
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const sortedPosts = useMemo(() => {
        const posts = [...communityPosts];
        switch (sortBy) {
            case 'new':
                return posts.sort((a, b) => b.id - a.id);
            case 'top':
                return posts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
            case 'hot':
            default:
                return posts.sort((a, b) => {
                    const scoreA = a.upvotes - a.downvotes;
                    const scoreB = b.upvotes - b.downvotes;
                    return scoreB - scoreA;
                });
        }
    }, [communityPosts, sortBy]);

    const handleUpvote = (postId: number) => {
        upvotePost(postId);
    };

    const handleDownvote = (postId: number) => {
        downvotePost(postId);
    };

    const handleToggleComments = (postId: number) => {
        setExpandedPostId(expandedPostId === postId ? null : postId);
    };

    const handleAddComment = (postId: number, text: string, parentId?: string) => {
        if (text.trim()) {
            addComment(postId, text.trim(), parentId);
        }
    };

    const handleCreatePost = () => {
        if (newPostText.trim()) {
            createPost(newPostText.trim(), selectedImages.length > 0 ? selectedImages : undefined);
            setNewPostText('');
            setSelectedImages([]);
            setShowCreatePost(false);
        }
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.8,
            selectionLimit: 4,
        });

        if (!result.canceled && result.assets) {
            const newImages = result.assets.map(asset => asset.uri);
            setSelectedImages(prev => [...prev, ...newImages].slice(0, 4));
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleAward = (award: string) => {
        if (selectedPostForAward) {
            awardPost(selectedPostForAward, award);
            setShowAwardModal(false);
            setSelectedPostForAward(null);
        }
    };



    const renderPost: ListRenderItem<Post> = useCallback(({ item: post }) => {
        return (
            <PostCard
                post={post}
                isExpanded={expandedPostId === post.id}
                onToggleComments={handleToggleComments}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
                onAward={(postId) => {
                    setSelectedPostForAward(postId);
                    setShowAwardModal(true);
                }}
                onAddReaction={addReaction}
                onAddComment={handleAddComment}
                onUpvoteComment={upvoteComment}
                onDownvoteComment={downvoteComment}
                onDelete={deleteCommunityPost}
                currentUserName={userName}
                colors={colors}
            />
        );
    }, [expandedPostId, colors, userName, handleToggleComments, handleUpvote, handleDownvote, addReaction, handleAddComment, deleteCommunityPost, upvoteComment, downvoteComment]);

    const renderHeader = () => (
        <View style={[styles.sortBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <TouchableOpacity
                style={[styles.sortButton, sortBy === 'hot' && styles.sortButtonActive]}
                onPress={() => setSortBy('hot')}
            >
                <Text style={[styles.sortText, sortBy === 'hot' && styles.sortTextActive]}>🔥 Hot</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.sortButton, sortBy === 'new' && styles.sortButtonActive]}
                onPress={() => setSortBy('new')}
            >
                <Text style={[styles.sortText, sortBy === 'new' && styles.sortTextActive]}>🆕 New</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.sortButton, sortBy === 'top' && styles.sortButtonActive]}
                onPress={() => setSortBy('top')}
            >
                <Text style={[styles.sortText, sortBy === 'top' && styles.sortTextActive]}>⭐ Top</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.askButton}
                onPress={() => onNavigate?.('chat')}
            >
                <Text style={styles.askButtonText}>🤖 Ask Bot</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={sortedPosts}
                renderItem={renderPost}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.contentContainer}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                windowSize={5}
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setShowCreatePost(true)}
            >
                <Plus size={32} color="white" />
            </TouchableOpacity>

            {/* Create Post Modal */}
            <Modal
                visible={showCreatePost}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCreatePost(false)}
                presentationStyle="overFullScreen"
                statusBarTranslucent={true}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Create Post</Text>
                            <TouchableOpacity onPress={() => setShowCreatePost(false)}>
                                <X size={24} color="#1f2937" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.postInput}
                            placeholder="What's on your mind? Share your plant journey..."
                            placeholderTextColor="#9ca3af"
                            value={newPostText}
                            onChangeText={setNewPostText}
                            multiline
                            autoFocus
                        />

                        {/* Image Preview */}
                        {selectedImages.length > 0 && (
                            <ScrollView horizontal style={styles.imagePreviewContainer} showsHorizontalScrollIndicator={false}>
                                {selectedImages.map((uri, index) => (
                                    <View key={index} style={styles.previewImageWrapper}>
                                        <Image source={{ uri }} style={styles.previewImage} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage(index)}
                                        >
                                            <X size={12} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        )}

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                                <ImagePlus size={24} color="#16a34a" />
                                <Text style={styles.imagePickerText}>Add Photos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.postButton, {
                                    backgroundColor: newPostText?.trim() || selectedImages.length > 0 ? '#16a34a' : '#e5e7eb'
                                }]}
                                onPress={handleCreatePost}
                                disabled={!newPostText?.trim() && selectedImages.length === 0}
                            >
                                <Text style={styles.postButtonText}>Post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Award Modal */}
            <Modal
                visible={showAwardModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowAwardModal(false)}
            >
                <View style={styles.awardModalContainer}>
                    <View style={styles.awardModalContent}>
                        <Text style={styles.awardModalTitle}>Give Award</Text>
                        <View style={styles.awardGrid}>
                            {['🏆', '🥇', '🥈', '🥉', '💎', '⭐', '🌟', '💡', '🔥', '❤️', '👍', '🎉'].map((award, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.awardOption}
                                    onPress={() => handleAward(award)}
                                >
                                    <Text style={styles.awardOptionIcon}>{award}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.awardCancelButton}
                            onPress={() => setShowAwardModal(false)}
                        >
                            <Text style={styles.awardCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sortBar: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        gap: 8,
    },
    sortButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    sortButtonActive: {
        backgroundColor: '#dcfce7',
    },
    sortText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6b7280',
    },
    sortTextActive: {
        color: '#16a34a',
    },
    askButton: {
        marginLeft: 'auto',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#16a34a',
        borderRadius: 16,
    },
    askButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'white',
    },
    contentContainer: {
        padding: 12,
        gap: 12,
        paddingBottom: 100, // Added extra padding for FAB
    },
    postCard: {
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: 12, // Added margin bottom for spacing between items
    },
    postContent: {
        flexDirection: 'row',
    },
    voteColumn: {
        width: 40,
        alignItems: 'center',
        paddingVertical: 8,
        gap: 4,
    },
    score: {
        fontSize: 12,
        fontWeight: '700',
    },
    postMain: {
        flex: 1,
        padding: 12,
    },
    postBadges: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    pinnedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#dcfce7',
        borderRadius: 4,
    },
    pinnedText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#16a34a',
        letterSpacing: 0.5,
    },
    trendingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#fef3c7',
        borderRadius: 4,
    },
    trendingText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#f59e0b',
        letterSpacing: 0.5,
    },
    postFlair: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    postFlairText: {
        fontSize: 11,
        fontWeight: '600',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    postAvatar: {
        fontSize: 16,
    },
    postUser: {
        fontSize: 13,
        fontWeight: '600',
    },
    userFlair: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    userFlairText: {
        fontSize: 10,
        fontWeight: '600',
    },
    karma: {
        fontSize: 11,
    },
    postDot: {
        fontSize: 11,
    },
    postTime: {
        fontSize: 11,
    },
    postText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
    reactionsBar: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 8,
        marginBottom: 4,
    },
    reactionBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    reactionBubbleActive: {
        backgroundColor: '#dcfce7',
        borderColor: '#16a34a',
    },
    reactionEmoji: {
        fontSize: 14,
    },
    reactionCount: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
    },
    awards: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 4,
    },
    awardIcon: {
        fontSize: 16,
    },
    postActions: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 13,
        fontWeight: '500',
    },
    commentsSection: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    noComments: {
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 16,
    },
    commentsList: {
        gap: 8,
    },
    commentWrapper: {
        flexDirection: 'row',
        gap: 8,
    },
    nestedComment: {
        marginLeft: 20,
    },
    commentVoteBar: {
        width: 2,
        backgroundColor: '#e5e7eb',
    },
    commentContainer: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    commentAvatar: {
        fontSize: 14,
    },
    commentUser: {
        fontSize: 12,
        fontWeight: '600',
    },
    commentDot: {
        fontSize: 10,
    },
    commentTime: {
        fontSize: 10,
    },
    commentText: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 6,
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    commentVoteButton: {
        padding: 2,
    },
    commentScore: {
        fontSize: 11,
        fontWeight: '700',
    },
    replyButton: {
        marginLeft: 4,
    },
    replyText: {
        fontSize: 11,
        fontWeight: '600',
    },
    replyInputContainer: {
        marginTop: 8,
        gap: 8,
    },
    replyInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        fontSize: 13,
        minHeight: 60,
        textAlignVertical: 'top',
    },
    replyActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelButton: {
        fontSize: 13,
        fontWeight: '600',
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    replySubmitButton: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    replySubmitText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },
    repliesContainer: {
        marginTop: 8,
    },
    addCommentSection: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 13,
        minHeight: 44,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 40,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#16a34a',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '90%', // Taller modal
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    postInput: {
        flex: 1,
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    imagePreviewContainer: {
        maxHeight: 120,
        marginBottom: 16,
    },
    previewImageWrapper: {
        marginRight: 12,
        position: 'relative',
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#ef4444',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    imagePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 8,
    },
    imagePickerText: {
        color: '#16a34a',
        fontWeight: '600',
        fontSize: 15,
    },
    postButton: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 20,
        alignItems: 'center',
    },
    postButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    awardModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    awardModalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '80%',
        maxWidth: 300,
    },
    awardModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    awardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 20,
    },
    awardOption: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 8,
    },
    awardOptionIcon: {
        fontSize: 32,
    },
    awardCancelButton: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    awardCancelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
    },
});

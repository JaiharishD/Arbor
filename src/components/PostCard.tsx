import React, { memo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { ChevronUp, ChevronDown, MessageCircle, Award, Pin, TrendingUp, Send, Trash2, X, ImagePlus } from 'lucide-react-native';
import { type Post, type Comment } from '../types';
import ImageGallery from './ImageGallery';

interface PostCardProps {
    post: Post;
    isExpanded: boolean;
    onToggleComments: (postId: number) => void;
    onUpvote: (postId: number) => void;
    onDownvote: (postId: number) => void;
    onAward: (postId: number) => void;
    onAddReaction: (postId: number, emoji: string) => void;
    onAddComment: (postId: number, text: string, parentId?: string) => void;
    onUpvoteComment: (postId: number, commentId: string) => void;
    onDownvoteComment: (postId: number, commentId: string) => void;
    onDelete: (postId: number) => void;
    currentUserName: string;
    colors: any;
}

const CommentItem = ({
    comment,
    postId,
    depth = 0,
    colors,
    currentUserName,
    onUpvote,
    onDownvote,
    onReply,
    replyingTo,
    setReplyingTo,
    commentText = '',
    setCommentText,
    onSubmitReply
}: any) => {
    const isUpvoted = currentUserName && comment.upvotedBy.includes(currentUserName);
    const isDownvoted = currentUserName && comment.downvotedBy.includes(currentUserName);
    const score = comment.upvotes - comment.downvotes;

    return (
        <View key={comment.id} style={[styles.commentWrapper, depth > 0 && styles.nestedComment]}>
            <View style={styles.commentVoteBar} />
            <View style={styles.commentContainer}>
                <View style={styles.commentHeader}>
                    <Text style={styles.commentAvatar}>{comment.avatar}</Text>
                    <Text style={[styles.commentUser, { color: colors.text }]}>{comment.user}</Text>
                    <Text style={[styles.commentDot, { color: colors.textSecondary }]}>•</Text>
                    <Text style={[styles.commentTime, { color: colors.textSecondary }]}>{comment.timestamp}</Text>
                </View>
                <Text style={[styles.commentText, { color: colors.textSecondary }]}>{comment.text}</Text>

                {comment.images && comment.images.length > 0 && (
                    <ImageGallery images={comment.images} />
                )}

                <View style={styles.commentActions}>
                    <TouchableOpacity
                        style={styles.commentVoteButton}
                        onPress={() => onUpvote(postId, comment.id)}
                    >
                        <ChevronUp size={14} color={isUpvoted ? '#16a34a' : colors.textSecondary} />
                    </TouchableOpacity>
                    <Text style={[styles.commentScore, { color: score > 0 ? '#16a34a' : score < 0 ? '#10b981' : colors.textSecondary }]}>
                        {score}
                    </Text>
                    <TouchableOpacity
                        style={styles.commentVoteButton}
                        onPress={() => onDownvote(postId, comment.id)}
                    >
                        <ChevronDown size={14} color={isDownvoted ? '#10b981' : colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.replyButton}
                        onPress={() => {
                            setReplyingTo(comment.id);
                            setCommentText('');
                        }}
                    >
                        <Text style={[styles.replyText, { color: colors.textSecondary }]}>Reply</Text>
                    </TouchableOpacity>
                </View>

                {replyingTo === comment.id && (
                    <View style={styles.replyInputContainer}>
                        <TextInput
                            style={[styles.replyInput, {
                                backgroundColor: colors.background,
                                color: colors.text,
                                borderColor: colors.border
                            }]}
                            placeholder="Write a reply..."
                            placeholderTextColor={colors.textSecondary}
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline
                            autoFocus
                        />
                        <View style={styles.replyActions}>
                            <TouchableOpacity onPress={() => setReplyingTo(null)}>
                                <Text style={[styles.cancelButton, { color: colors.textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.replySubmitButton, {
                                    backgroundColor: commentText?.trim() ? '#16a34a' : colors.border
                                }]}
                                onPress={() => onSubmitReply(postId, commentText, comment.id)}
                                disabled={!commentText?.trim()}
                            >
                                <Text style={styles.replySubmitText}>Reply</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <View style={styles.repliesContainer}>
                        {comment.replies.map((reply: any) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                depth={depth + 1}
                                colors={colors}
                                currentUserName={currentUserName}
                                onUpvote={onUpvote}
                                onDownvote={onDownvote}
                                onReply={onReply}
                                replyingTo={replyingTo}
                                setReplyingTo={setReplyingTo}
                                commentText={commentText}
                                setCommentText={setCommentText}
                                onSubmitReply={onSubmitReply}
                            />
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

const PostCard = memo(({
    post,
    isExpanded,
    onToggleComments,
    onUpvote,
    onDownvote,
    onAward,
    onAddReaction,
    onAddComment,
    onUpvoteComment,
    onDownvoteComment,
    onDelete,
    currentUserName,
    colors
}: PostCardProps) => {
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const isUpvoted = currentUserName && post.upvotedBy.includes(currentUserName);
    const isDownvoted = currentUserName && post.downvotedBy.includes(currentUserName);
    const score = post.upvotes - post.downvotes;
    const commentCount = post.comments.reduce((count, comment) => {
        return count + 1 + (comment.replies?.length || 0);
    }, 0);
    const isOwner = post.user === currentUserName;

    const getScore = (upvotes: number, downvotes: number) => {
        const score = upvotes - downvotes;
        if (score >= 1000) return `${(score / 1000).toFixed(1)}k`;
        return score.toString();
    };

    const handleSubmitComment = () => {
        if (commentText?.trim()) {
            onAddComment(post.id, commentText.trim());
            setCommentText('');
        }
    };

    const handleSubmitReply = (postId: number, text: string, parentId: string) => {
        if (text?.trim()) {
            onAddComment(postId, text.trim(), parentId);
            setCommentText('');
            setReplyingTo(null);
        }
    };

    return (
        <View style={[styles.postCard, { backgroundColor: colors.card }]}>
            <View style={styles.postContent}>
                {/* Vote Column */}
                <View style={styles.voteColumn}>
                    <TouchableOpacity onPress={() => onUpvote(post.id)}>
                        <ChevronUp
                            size={24}
                            color={isUpvoted ? '#16a34a' : colors.textSecondary}
                            fill={isUpvoted ? '#16a34a' : 'none'}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.score, {
                        color: score > 0 ? '#16a34a' : score < 0 ? '#10b981' : colors.textSecondary
                    }]}>
                        {getScore(post.upvotes, post.downvotes)}
                    </Text>
                    <TouchableOpacity onPress={() => onDownvote(post.id)}>
                        <ChevronDown
                            size={24}
                            color={isDownvoted ? '#10b981' : colors.textSecondary}
                            fill={isDownvoted ? '#10b981' : 'none'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Post Content */}
                <View style={styles.postMain}>
                    {/* Pinned/Trending Indicators */}
                    {(post.isPinned || post.isTrending) && (
                        <View style={styles.postBadges}>
                            {post.isPinned && (
                                <View style={styles.pinnedBadge}>
                                    <Pin size={12} color="#16a34a" />
                                    <Text style={styles.pinnedText}>PINNED</Text>
                                </View>
                            )}
                            {post.isTrending && (
                                <View style={styles.trendingBadge}>
                                    <TrendingUp size={12} color="#f59e0b" />
                                    <Text style={styles.trendingText}>TRENDING</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Post Flair */}
                    {post.postFlair && (
                        <View style={[styles.postFlair, { backgroundColor: post.postFlair.backgroundColor }]}>
                            <Text style={[styles.postFlairText, { color: post.postFlair.color }]}>
                                {post.postFlair.text}
                            </Text>
                        </View>
                    )}

                    <View style={styles.postHeader}>
                        <Text style={styles.postAvatar}>{post.avatar}</Text>
                        <Text style={[styles.postUser, { color: colors.text }]}>{post.user}</Text>
                        {/* User Flair */}
                        {post.userFlair && (
                            <View style={[styles.userFlair, { backgroundColor: post.userFlair.backgroundColor }]}>
                                <Text style={[styles.userFlairText, { color: post.userFlair.color }]}>
                                    {post.userFlair.text}
                                </Text>
                            </View>
                        )}
                        {post.userKarma !== undefined && post.userKarma > 0 && (
                            <Text style={[styles.karma, { color: colors.textSecondary }]}>
                                • {post.userKarma} karma
                            </Text>
                        )}
                        <Text style={[styles.postDot, { color: colors.textSecondary }]}>•</Text>
                        <Text style={[styles.postTime, { color: colors.textSecondary }]}>{post.timestamp}</Text>

                        {/* Delete Button for Owner */}
                        {isOwner && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => onDelete(post.id)}
                            >
                                <Trash2 size={16} color="#ef4444" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text style={[styles.postText, { color: colors.text }]}>{post.text}</Text>

                    {/* Image Gallery */}
                    {post.images && post.images.length > 0 && (
                        <ImageGallery images={post.images} />
                    )}

                    {/* Reactions Bar */}
                    {post.reactions && post.reactions.length > 0 && (
                        <View style={styles.reactionsBar}>
                            {post.reactions.slice(0, 5).map((reaction, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={[
                                        styles.reactionBubble,
                                        reaction.users.includes(currentUserName) && styles.reactionBubbleActive
                                    ]}
                                    onPress={() => onAddReaction(post.id, reaction.emoji)}
                                >
                                    <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                                    <Text style={styles.reactionCount}>{reaction.users.length}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {post.awards && post.awards.length > 0 && (
                        <View style={styles.awards}>
                            {post.awards.map((award, idx) => (
                                <Text key={idx} style={styles.awardIcon}>{award}</Text>
                            ))}
                        </View>
                    )}

                    <View style={styles.postActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => onToggleComments(post.id)}
                        >
                            <MessageCircle size={18} color={colors.textSecondary} />
                            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                                {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => onAward(post.id)}
                        >
                            <Award size={18} color={colors.textSecondary} />
                            <Text style={[styles.actionText, { color: colors.textSecondary }]}>Award</Text>
                        </TouchableOpacity>
                    </View>

                    {isExpanded && (
                        <View style={[styles.commentsSection, { borderTopColor: colors.border }]}>
                            {commentCount === 0 ? (
                                <Text style={[styles.noComments, { color: colors.textSecondary }]}>
                                    No comments yet. Be the first to comment!
                                </Text>
                            ) : (
                                <View style={styles.commentsList}>
                                    {post.comments.map(comment => (
                                        <CommentItem
                                            key={comment.id}
                                            comment={comment}
                                            postId={post.id}
                                            colors={colors}
                                            currentUserName={currentUserName}
                                            onUpvote={onUpvoteComment}
                                            onDownvote={onDownvoteComment}
                                            onReply={() => { }}
                                            replyingTo={replyingTo}
                                            setReplyingTo={setReplyingTo}
                                            commentText={commentText}
                                            setCommentText={setCommentText}
                                            onSubmitReply={handleSubmitReply}
                                        />
                                    ))}
                                </View>
                            )}

                            {!replyingTo && (
                                <View style={[styles.addCommentSection, { borderTopColor: colors.border }]}>
                                    <TextInput
                                        style={[styles.commentInput, {
                                            backgroundColor: colors.background,
                                            color: colors.text,
                                            borderColor: colors.border
                                        }]}
                                        placeholder="Add a comment..."
                                        placeholderTextColor={colors.textSecondary}
                                        value={commentText}
                                        onChangeText={setCommentText}
                                        multiline
                                    />
                                    <TouchableOpacity
                                        style={[styles.sendButton, {
                                            backgroundColor: commentText?.trim() ? '#16a34a' : colors.border
                                        }]}
                                        onPress={handleSubmitComment}
                                        disabled={!commentText?.trim()}
                                    >
                                        <Send size={18} color="white" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    postCard: {
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: 12,
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
    deleteButton: {
        marginLeft: 'auto',
        padding: 4,
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
        marginBottom: 4,
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4,
    },
    commentVoteButton: {
        padding: 2,
    },
    commentScore: {
        fontSize: 11,
        fontWeight: '600',
    },
    replyButton: {
        padding: 2,
    },
    replyText: {
        fontSize: 11,
        fontWeight: '600',
    },
    replyInputContainer: {
        marginTop: 8,
        marginBottom: 8,
    },
    replyInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        fontSize: 12,
        minHeight: 36,
        marginBottom: 8,
    },
    replyActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        alignItems: 'center',
    },
    cancelButton: {
        fontSize: 12,
        fontWeight: '600',
    },
    replySubmitButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    replySubmitText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    repliesContainer: {
        marginTop: 8,
    },
});

export default PostCard;

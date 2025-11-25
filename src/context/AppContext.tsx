import React, { createContext, useState, useContext, useEffect } from 'react';
import { type Crop, type Post, type Comment, type Badge, type MarketItem } from '../types';
import { theme, type Theme } from '../theme';
import { api } from '../services/api';
import { MOCK_CROPS, MOCK_POSTS, MOCK_BADGES } from '../data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfilePost {
    id: string;
    content: string;
    image?: string | null;
    timestamp: string;
    likes: number;
    comments: number;
}

export interface Challenge {
    id: string;
    text: string;
    reward: number;
    completed: boolean;
    type: 'water' | 'post' | 'read' | 'login';
}

export interface MarketplaceOrder {
    id: number;
    item: MarketItem;
    type: string;
    timestamp: string;
}

interface AppContextType {
    userName: string;
    activeCrops: Crop[];
    refreshCrops: () => Promise<void>;
    updateCrop: (cropId: number, updates: Partial<Crop>) => Promise<void>;
    addCrop: (crop: Omit<Crop, 'id'>) => Promise<void>;
    login: (name: string) => void;
    logout: () => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
    colors: Theme;
    isModalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    isTabBarVisible: boolean;
    setTabBarVisible: (visible: boolean) => void;
    userPosts: UserProfilePost[];
    addUserPost: (post: UserProfilePost) => void;
    deleteUserPost: (postId: string) => void;
    communityPosts: Post[];
    deleteCommunityPost: (postId: number) => void;
    upvotePost: (postId: number) => void;
    downvotePost: (postId: number) => void;
    addComment: (postId: number, commentText: string, parentCommentId?: string, images?: string[]) => void;
    upvoteComment: (postId: number, commentId: string) => void;
    downvoteComment: (postId: number, commentId: string) => void;
    awardPost: (postId: number, award: string) => void;
    createPost: (text: string, images?: string[]) => void;
    sortBy: 'hot' | 'new' | 'top';
    setSortBy: (sort: 'hot' | 'new' | 'top') => void;
    addReaction: (postId: number, emoji: string) => void;
    addCommentReaction: (postId: number, commentId: string, emoji: string) => void;
    userPoints: number;
    userLevel: number;
    userStreak: number;
    dailyChallenges: Challenge[];
    completeChallenge: (challengeId: string) => void;
    badges: Badge[];
    marketplaceOrders: MarketplaceOrder[];
    addMarketplaceOrder: (order: MarketplaceOrder) => void;
    deleteMarketplaceOrder: (orderId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

interface AppProviderProps {
    children: React.ReactNode;
    value?: Partial<AppContextType>;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, value }) => {
    const [userName, setUserName] = useState<string>('');
    const [activeCrops, setActiveCrops] = useState<Crop[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isTabBarVisible, setTabBarVisible] = useState(true);
    const [communityPosts, setCommunityPosts] = useState<Post[]>(MOCK_POSTS);
    const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
    const [userPosts, setUserPosts] = useState<UserProfilePost[]>([
        {
            id: '1',
            content: 'Just harvested my first tomatoes! 🍅',
            timestamp: '3 days ago',
            likes: 34,
            comments: 8
        },
        {
            id: '2',
            content: 'Any tips for dealing with aphids?',
            timestamp: '1 week ago',
            likes: 18,
            comments: 12
        }
    ]);
    const [userPoints, setUserPoints] = useState(2450);
    const [userStreak, setUserStreak] = useState(5);
    const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>([
        { id: '1', text: 'Water your plants', reward: 50, completed: false, type: 'water' },
        { id: '2', text: 'Post in Community', reward: 100, completed: false, type: 'post' },
        { id: '3', text: 'Read a Grow Guide', reward: 30, completed: false, type: 'read' },
    ]);
    const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES);
    const [marketplaceOrders, setMarketplaceOrders] = useState<MarketplaceOrder[]>([]);

    const userLevel = Math.floor(userPoints / 1000) + 1;

    // Check for badge unlocks whenever relevant state changes
    useEffect(() => {
        const checkBadges = () => {
            setBadges(prevBadges => prevBadges.map(badge => {
                let earned = badge.earned;
                let progress = badge.progress;

                if (badge.name === 'Green Guru' && userLevel >= 5) {
                    earned = true;
                    progress = 100;
                } else if (badge.name === 'Green Guru') {
                    progress = (userLevel / 5) * 100;
                }

                if (badge.name === 'Community Helper' && userPosts.length >= 3) {
                    earned = true;
                    progress = 100;
                } else if (badge.name === 'Community Helper') {
                    progress = (userPosts.length / 3) * 100;
                }

                if (badge.name === 'Eco Contributor' && userStreak >= 3) {
                    earned = true;
                    progress = 100;
                } else if (badge.name === 'Eco Contributor') {
                    progress = (userStreak / 3) * 100;
                }

                if (earned !== badge.earned || progress !== badge.progress) {
                    return { ...badge, earned, progress };
                }
                return badge;
            }));
        };
        checkBadges();
    }, [userLevel, userPosts.length, userStreak]);

    // Fetch crops on mount
    useEffect(() => {
        fetchCrops();
    }, []);

    // Load posts from storage on mount
    useEffect(() => {
        const loadPosts = async () => {
            try {
                const storedPosts = await AsyncStorage.getItem('communityPosts');
                if (storedPosts) {
                    const parsedPosts = JSON.parse(storedPosts);
                    if (parsedPosts.length > 0) {
                        setCommunityPosts(parsedPosts);
                    }
                }
            } catch (error) {
                console.error('Failed to load posts:', error);
            }
        };
        loadPosts();
    }, []);

    // Save posts to storage whenever they change
    useEffect(() => {
        const savePosts = async () => {
            try {
                await AsyncStorage.setItem('communityPosts', JSON.stringify(communityPosts));
            } catch (error) {
                console.error('Failed to save posts:', error);
            }
        };
        savePosts();
    }, [communityPosts]);

    // Load orders from storage on mount
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const storedOrders = await AsyncStorage.getItem('marketplaceOrders');
                if (storedOrders) {
                    setMarketplaceOrders(JSON.parse(storedOrders));
                }
            } catch (error) {
                console.error('Failed to load orders:', error);
            }
        };
        loadOrders();
    }, []);

    // Save orders to storage whenever they change
    useEffect(() => {
        const saveOrders = async () => {
            try {
                await AsyncStorage.setItem('marketplaceOrders', JSON.stringify(marketplaceOrders));
            } catch (error) {
                console.error('Failed to save orders:', error);
            }
        };
        saveOrders();
    }, [marketplaceOrders]);

    const fetchCrops = async () => {
        // Show mock data immediately for instant load
        setActiveCrops(MOCK_CROPS);

        try {
            const crops = await api.getCrops();
            if (crops && crops.length > 0) {
                setActiveCrops(crops);
            }
        } catch (e) {
            // Keep mock data if API fails
            console.log('Using mock crops');
        }
    };

    const login = (name: string) => {
        setUserName(name);
    };

    const logout = () => {
        setUserName('');
    };

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };



    const updateCrop = async (cropId: number, updates: Partial<Crop>) => {
        // Optimistic update
        setActiveCrops(prev => prev.map(crop =>
            crop.id === cropId ? { ...crop, ...updates } : crop
        ));

        // TODO: API call would go here
    };

    const addCrop = async (crop: Omit<Crop, 'id'>) => {
        const newCrop = { ...crop, id: Date.now() };
        // Optimistic update - update UI immediately
        setActiveCrops(prev => [...prev, newCrop]);

        // Run API call in background - do not await
        api.addCrop(newCrop).catch(e => {
            console.error("Failed to sync new crop to backend", e);
            // Optionally revert state here if strict consistency is needed
        });
    };

    const addUserPost = (post: UserProfilePost) => {
        setUserPosts(prev => [post, ...prev]);
    };

    const upvotePost = (postId: number) => {
        setCommunityPosts(prev => prev.map(post => {
            if (post.id === postId) {
                const hasUpvoted = post.upvotedBy.includes(userName);
                const hasDownvoted = post.downvotedBy.includes(userName);

                return {
                    ...post,
                    upvotes: hasUpvoted ? post.upvotes - 1 : post.upvotes + 1 + (hasDownvoted ? 1 : 0),
                    downvotes: hasDownvoted ? post.downvotes - 1 : post.downvotes,
                    upvotedBy: hasUpvoted
                        ? post.upvotedBy.filter((name: string) => name !== userName)
                        : [...post.upvotedBy, userName],
                    downvotedBy: hasDownvoted
                        ? post.downvotedBy.filter((name: string) => name !== userName)
                        : post.downvotedBy
                };
            }
            return post;
        }));
    };

    const downvotePost = (postId: number) => {
        setCommunityPosts(prev => prev.map(post => {
            if (post.id === postId) {
                const hasUpvoted = post.upvotedBy.includes(userName);
                const hasDownvoted = post.downvotedBy.includes(userName);

                return {
                    ...post,
                    upvotes: hasUpvoted ? post.upvotes - 1 : post.upvotes,
                    downvotes: hasDownvoted ? post.downvotes - 1 : post.downvotes + 1 + (hasUpvoted ? 1 : 0),
                    upvotedBy: hasUpvoted
                        ? post.upvotedBy.filter((name: string) => name !== userName)
                        : post.upvotedBy,
                    downvotedBy: hasDownvoted
                        ? post.downvotedBy.filter((name: string) => name !== userName)
                        : [...post.downvotedBy, userName]
                };
            }
            return post;
        }));
    };

    const addComment = (postId: number, commentText: string, parentCommentId?: string, images?: string[]) => {
        setCommunityPosts(prev => prev.map(post => {
            if (post.id === postId) {
                const newComment: Comment = {
                    id: `c${Date.now()}`,
                    user: userName || 'Guest',
                    avatar: '👤',
                    text: commentText,
                    timestamp: 'Just now',
                    upvotes: 0,
                    downvotes: 0,
                    upvotedBy: [],
                    downvotedBy: [],
                    images,
                    reactions: []
                };

                if (parentCommentId) {
                    // Add as reply to parent comment
                    const addReplyToComment = (comments: Comment[]): Comment[] => {
                        return comments.map(comment => {
                            if (comment.id === parentCommentId) {
                                return {
                                    ...comment,
                                    replies: [...(comment.replies || []), newComment]
                                };
                            }
                            if (comment.replies) {
                                return {
                                    ...comment,
                                    replies: addReplyToComment(comment.replies)
                                };
                            }
                            return comment;
                        });
                    };

                    return {
                        ...post,
                        comments: addReplyToComment(post.comments)
                    };
                } else {
                    return {
                        ...post,
                        comments: [...post.comments, newComment]
                    };
                }
            }
            return post;
        }));
    };

    const upvoteComment = (postId: number, commentId: string) => {
        setCommunityPosts(prev => prev.map(post => {
            if (post.id === postId) {
                const updateComment = (comments: Comment[]): Comment[] => {
                    return comments.map(comment => {
                        if (comment.id === commentId) {
                            const hasUpvoted = comment.upvotedBy.includes(userName);
                            const hasDownvoted = comment.downvotedBy.includes(userName);
                            return {
                                ...comment,
                                upvotes: hasUpvoted ? comment.upvotes - 1 : comment.upvotes + 1 + (hasDownvoted ? 1 : 0),
                                downvotes: hasDownvoted ? comment.downvotes - 1 : comment.downvotes,
                                upvotedBy: hasUpvoted
                                    ? comment.upvotedBy.filter((name: string) => name !== userName)
                                    : [...comment.upvotedBy, userName],
                                downvotedBy: hasDownvoted
                                    ? comment.downvotedBy.filter((name: string) => name !== userName)
                                    : comment.downvotedBy
                            };
                        }
                        if (comment.replies) {
                            return { ...comment, replies: updateComment(comment.replies) };
                        }
                        return comment;
                    });
                };
                return {
                    ...post,
                    comments: updateComment(post.comments)
                };
            }
            return post;
        }));
    };

    const downvoteComment = (postId: number, commentId: string) => {
        setCommunityPosts(prev => prev.map(post => {
            if (post.id === postId) {
                const updateComment = (comments: Comment[]): Comment[] => {
                    return comments.map(comment => {
                        if (comment.id === commentId) {
                            const hasUpvoted = comment.upvotedBy.includes(userName);
                            const hasDownvoted = comment.downvotedBy.includes(userName);
                            return {
                                ...comment,
                                upvotes: hasUpvoted ? comment.upvotes - 1 : comment.upvotes,
                                downvotes: hasDownvoted ? comment.downvotes - 1 : comment.downvotes + 1 + (hasUpvoted ? 1 : 0),
                                upvotedBy: hasUpvoted
                                    ? comment.upvotedBy.filter((name: string) => name !== userName)
                                    : comment.upvotedBy,
                                downvotedBy: hasDownvoted
                                    ? comment.downvotedBy.filter((name: string) => name !== userName)
                                    : [...comment.downvotedBy, userName]
                            };
                        }
                        if (comment.replies) {
                            return { ...comment, replies: updateComment(comment.replies) };
                        }
                        return comment;
                    });
                };
                return {
                    ...post,
                    comments: updateComment(post.comments)
                };
            }
            return post;
        }));
    };

    const awardPost = (postId: number, award: string) => {
        setCommunityPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    awards: [...post.awards, award]
                };
            }
            return post;
        }));
    };

    const createPost = (text: string, images?: string[]) => {
        const newPost: Post = {
            id: Date.now(),
            user: userName || 'Guest',
            avatar: '👤',
            text,
            images,
            timestamp: 'Just now',
            upvotes: 0,
            downvotes: 0,
            upvotedBy: [],
            downvotedBy: [],
            awards: [],
            reactions: [],
            comments: [],
            userKarma: 0
        };
        setCommunityPosts(prev => [newPost, ...prev]);
    };

    const addReaction = (postId: number, emoji: string) => {
        setCommunityPosts(prev => prev.map(post => {
            if (post.id === postId) {
                const existingReaction = post.reactions.find(r => r.emoji === emoji);
                if (existingReaction) {
                    // Toggle reaction - remove if user already reacted
                    if (existingReaction.users.includes(userName)) {
                        return {
                            ...post,
                            reactions: post.reactions.map(r =>
                                r.emoji === emoji
                                    ? { ...r, users: r.users.filter(u => u !== userName) }
                                    : r
                            ).filter(r => r.users.length > 0) // Remove empty reactions
                        };
                    } else {
                        // Add user to existing reaction
                        return {
                            ...post,
                            reactions: post.reactions.map(r =>
                                r.emoji === emoji
                                    ? { ...r, users: [...r.users, userName] }
                                    : r
                            )
                        };
                    }
                } else {
                    // Add new reaction
                    return {
                        ...post,
                        reactions: [...post.reactions, { emoji, users: [userName] }]
                    };
                }
            }
            return post;
        }));
    };

    const addCommentReaction = (postId: number, commentId: string, emoji: string) => {
        setCommunityPosts(prev => prev.map(post => {
            if (post.id === postId) {
                const updateCommentReaction = (comments: Comment[]): Comment[] => {
                    return comments.map(comment => {
                        if (comment.id === commentId) {
                            const existingReaction = comment.reactions.find(r => r.emoji === emoji);
                            if (existingReaction) {
                                if (existingReaction.users.includes(userName)) {
                                    // Remove user's reaction
                                    return {
                                        ...comment,
                                        reactions: comment.reactions.map(r =>
                                            r.emoji === emoji
                                                ? { ...r, users: r.users.filter(u => u !== userName) }
                                                : r
                                        ).filter(r => r.users.length > 0)
                                    };
                                } else {
                                    // Add user to reaction
                                    return {
                                        ...comment,
                                        reactions: comment.reactions.map(r =>
                                            r.emoji === emoji
                                                ? { ...r, users: [...r.users, userName] }
                                                : r
                                        )
                                    };
                                }
                            } else {
                                // Add new reaction
                                return {
                                    ...comment,
                                    reactions: [...comment.reactions, { emoji, users: [userName] }]
                                };
                            }
                        }
                        if (comment.replies) {
                            return { ...comment, replies: updateCommentReaction(comment.replies) };
                        }
                        return comment;
                    });
                };
                return {
                    ...post,
                    comments: updateCommentReaction(post.comments)
                };
            }
            return post;
        }));
    };

    const deleteUserPost = (postId: string) => {
        setUserPosts(prev => prev.filter(post => post.id !== postId));
    };

    const deleteCommunityPost = (postId: number) => {
        setCommunityPosts(prev => prev.filter(post => post.id !== postId));
    };

    const completeChallenge = (challengeId: string) => {
        setDailyChallenges(prev => prev.map(challenge => {
            if (challenge.id === challengeId && !challenge.completed) {
                setUserPoints(points => points + challenge.reward);
                return { ...challenge, completed: true };
            }
            return challenge;
        }));
    };

    const addMarketplaceOrder = (order: MarketplaceOrder) => {
        setMarketplaceOrders(prev => [order, ...prev]);
    };

    const deleteMarketplaceOrder = (orderId: number) => {
        setMarketplaceOrders(prev => prev.filter(o => o.id !== orderId));
    };

    const colors = isDarkMode ? theme.dark : theme.light;

    const contextValue = {
        ...value,
        userName,
        activeCrops,
        refreshCrops: fetchCrops,
        updateCrop,
        addCrop,
        login,
        logout,
        isDarkMode,
        toggleTheme,
        colors,
        isModalOpen,
        setModalOpen,
        isTabBarVisible,
        setTabBarVisible,
        userPosts,
        addUserPost,
        deleteUserPost,
        communityPosts,
        deleteCommunityPost,
        upvotePost,
        downvotePost,
        addComment,
        upvoteComment,
        downvoteComment,
        awardPost,
        createPost,
        sortBy,
        setSortBy,
        addReaction,
        addCommentReaction,
        userPoints,
        userLevel,
        userStreak,
        dailyChallenges,
        completeChallenge,
        badges,
        marketplaceOrders,
        addMarketplaceOrder,
        deleteMarketplaceOrder,
    };

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

import { type Plant, type Crop, type MarketItem, type Post, type Badge, type Comment, type Flair } from '../types';

export const MOCK_PLANTS: Plant[] = [
    // Vegetables
    { id: 1, name: 'Tomato', image: '🍅', soil: 'Loamy', water: 'Moderate', sunlight: 'Full Sun', season: 'Spring/Summer', category: 'vegetable', difficulty: 'Easy', daysToHarvest: 75, containerSize: '18-24 inches' },
    { id: 2, name: 'Chili Pepper', image: '🌶️', soil: 'Well-drained', water: 'Moderate', sunlight: 'Full Sun', season: 'Spring/Summer', category: 'vegetable', difficulty: 'Easy', daysToHarvest: 70, containerSize: '12-16 inches' },
    { id: 3, name: 'Bell Pepper', image: '🫑', soil: 'Rich Loamy', water: 'Regular', sunlight: 'Full Sun', season: 'Spring/Summer', category: 'vegetable', difficulty: 'Medium', daysToHarvest: 80, containerSize: '16-20 inches' },
    { id: 4, name: 'Eggplant', image: '🍆', soil: 'Well-drained', water: 'Regular', sunlight: 'Full Sun', season: 'Spring/Summer', category: 'vegetable', difficulty: 'Medium', daysToHarvest: 85, containerSize: '20-24 inches' },
    { id: 5, name: 'Cucumber', image: '🥒', soil: 'Rich Loamy', water: 'Frequent', sunlight: 'Full Sun', season: 'Spring/Summer', category: 'vegetable', difficulty: 'Easy', daysToHarvest: 55, containerSize: '16-20 inches' },
    { id: 6, name: 'Lettuce', image: '🥬', soil: 'Moist', water: 'Regular', sunlight: 'Partial Shade', season: 'Spring/Fall', category: 'vegetable', difficulty: 'Easy', daysToHarvest: 45, containerSize: '8-12 inches' },
    { id: 7, name: 'Spinach', image: '🥬', soil: 'Rich', water: 'Regular', sunlight: 'Partial Sun', season: 'Spring/Fall', category: 'vegetable', difficulty: 'Easy', daysToHarvest: 40, containerSize: '8-12 inches' },
    { id: 8, name: 'Radish', image: '🔴', soil: 'Loose', water: 'Regular', sunlight: 'Full Sun', season: 'Spring/Fall', category: 'vegetable', difficulty: 'Easy', daysToHarvest: 25, containerSize: '8-10 inches deep' },
    { id: 9, name: 'Carrot', image: '🥕', soil: 'Sandy Loam', water: 'Moderate', sunlight: 'Full Sun', season: 'Spring/Fall', category: 'vegetable', difficulty: 'Medium', daysToHarvest: 70, containerSize: '12-16 inches deep' },

    // Herbs
    { id: 10, name: 'Basil', image: '🌿', soil: 'Well-drained', water: 'Regular', sunlight: 'Partial Shade', season: 'Spring/Summer', category: 'herb', difficulty: 'Easy', daysToHarvest: 30, containerSize: '8-12 inches' },
    { id: 11, name: 'Mint', image: '🌱', soil: 'Moist', water: 'Frequent', sunlight: 'Partial Sun', season: 'Spring/Fall', category: 'herb', difficulty: 'Easy', daysToHarvest: 40, containerSize: '10-14 inches' },
    { id: 12, name: 'Coriander', image: '🌿', soil: 'Well-drained', water: 'Moderate', sunlight: 'Partial Sun', season: 'Spring/Fall', category: 'herb', difficulty: 'Easy', daysToHarvest: 35, containerSize: '8-12 inches' },
    { id: 13, name: 'Parsley', image: '🌿', soil: 'Rich Moist', water: 'Regular', sunlight: 'Partial Shade', season: 'Spring/Fall', category: 'herb', difficulty: 'Easy', daysToHarvest: 45, containerSize: '8-12 inches' },
    { id: 14, name: 'Rosemary', image: '🌿', soil: 'Well-drained', water: 'Minimal', sunlight: 'Full Sun', season: 'Year-round', category: 'herb', difficulty: 'Medium', daysToHarvest: 60, containerSize: '12-16 inches' },
    { id: 15, name: 'Thyme', image: '🌿', soil: 'Well-drained', water: 'Minimal', sunlight: 'Full Sun', season: 'Year-round', category: 'herb', difficulty: 'Easy', daysToHarvest: 50, containerSize: '8-10 inches' },
    { id: 16, name: 'Oregano', image: '🌿', soil: 'Well-drained', water: 'Moderate', sunlight: 'Full Sun', season: 'Spring/Summer', category: 'herb', difficulty: 'Easy', daysToHarvest: 45, containerSize: '10-12 inches' },
    { id: 17, name: 'Lemongrass', image: '🌾', soil: 'Rich Loamy', water: 'Regular', sunlight: 'Full Sun', season: 'Spring/Summer', category: 'herb', difficulty: 'Medium', daysToHarvest: 90, containerSize: '16-20 inches' },

    // Fruits
    { id: 18, name: 'Strawberry', image: '🍓', soil: 'Well-drained', water: 'Regular', sunlight: 'Full Sun', season: 'Spring/Summer', category: 'fruit', difficulty: 'Medium', daysToHarvest: 120, containerSize: '12-16 inches' },
    { id: 19, name: 'Lemon', image: '🍋', soil: 'Well-drained', water: 'Regular', sunlight: 'Full Sun', season: 'Year-round', category: 'fruit', difficulty: 'Hard', daysToHarvest: 365, containerSize: '24-30 inches' },
    { id: 20, name: 'Cherry Tomato', image: '🍒', soil: 'Rich Loamy', water: 'Regular', sunlight: 'Full Sun', season: 'Spring/Summer', category: 'fruit', difficulty: 'Easy', daysToHarvest: 60, containerSize: '14-18 inches' },

    // Flowers
    { id: 21, name: 'Marigold', image: '🌼', soil: 'Well-drained', water: 'Moderate', sunlight: 'Full Sun', season: 'Spring/Summer', category: 'flower', difficulty: 'Easy', containerSize: '10-12 inches' },
    { id: 22, name: 'Petunia', image: '🌸', soil: 'Well-drained', water: 'Regular', sunlight: 'Full Sun', season: 'Spring/Summer', category: 'flower', difficulty: 'Easy', containerSize: '10-14 inches' },
    { id: 23, name: 'Geranium', image: '🌺', soil: 'Well-drained', water: 'Moderate', sunlight: 'Full Sun', season: 'Spring/Summer', category: 'flower', difficulty: 'Easy', containerSize: '12-16 inches' },

    // Succulents
    { id: 24, name: 'Aloe Vera', image: '🪴', soil: 'Sandy', water: 'Minimal', sunlight: 'Bright Indirect', season: 'Year-round', category: 'succulent', difficulty: 'Easy', containerSize: '10-14 inches' },
    { id: 25, name: 'Jade Plant', image: '🌿', soil: 'Well-drained', water: 'Minimal', sunlight: 'Bright Light', season: 'Year-round', category: 'succulent', difficulty: 'Easy', containerSize: '8-12 inches' },
    { id: 26, name: 'Snake Plant', image: '🌿', soil: 'Well-drained', water: 'Minimal', sunlight: 'Low to Bright', season: 'Year-round', category: 'succulent', difficulty: 'Easy', containerSize: '10-14 inches' },
];

export const MOCK_CROPS: Crop[] = [
    { id: 1, name: 'Cherry Tomato', image: '🍅', stage: 'Mature', progress: 90, nextAction: 'Ready to Harvest!' },
    { id: 2, name: 'Basil', image: '🌿', stage: 'Sprout', progress: 45, nextAction: 'Add Water' },
    { id: 3, name: 'Mint', image: '🌱', stage: 'Seed', progress: 15, nextAction: 'Move to Sunlight' }
];

export const MOCK_MARKETPLACE: MarketItem[] = [
    {
        id: 1,
        name: 'Fresh Mint Bunch',
        type: 'Swap',
        seller: 'Priya K.',
        distance: '0.8 km',
        price: null,
        image: require('../../assets/Fresh Mint Bunch.png'),
        freshness: 'Freshly Harvested',
        category: 'Herb',
        isVerified: true,
        description: 'Organic mint from my balcony garden. Great for tea and chutneys! Willing to swap for coriander or curry leaves.'
    },
    {
        id: 2,
        name: 'Cherry Tomatoes',
        type: 'Sale',
        seller: 'Raj M.',
        distance: '1.2 km',
        price: '₹40/pack',
        image: require('../../assets/Cherry Tomatoes.png'),
        freshness: '1 day old',
        category: 'Vegetable',
        isVerified: true,
        description: 'Sweet and juicy cherry tomatoes. Harvested yesterday. One pack contains about 200g.'
    },
    {
        id: 3,
        name: 'Aloe Vera Pup',
        type: 'Swap',
        seller: 'Anita S.',
        distance: '2.5 km',
        price: null,
        image: require('../../assets/Aloe Vera Pup.png'),
        freshness: 'Potted',
        category: 'Succulent',
        isVerified: false,
        description: 'Healthy Aloe Vera pup, rooted and ready to grow. Looking to swap for any flowering plant.'
    },
    {
        id: 4,
        name: 'Curry Leaves',
        type: 'Sale',
        seller: 'Kumar V.',
        distance: '0.5 km',
        price: '₹20/bunch',
        image: require('../../assets/Curry Leaves.png'),
        freshness: 'Freshly Harvested',
        category: 'Herb',
        isVerified: true,
        description: 'Aromatic curry leaves, grown without pesticides. Perfect for daily cooking.'
    },
    {
        id: 5,
        name: 'Hibiscus Cuttings',
        type: 'Request',
        seller: 'Meera P.',
        distance: '3.0 km',
        price: null,
        image: require('../../assets/Hibiscus Cutiings.png'),
        freshness: 'Growing',
        category: 'Flower',
        isVerified: true,
        description: 'Looking for red hibiscus cuttings. Can trade for marigold seeds or just pay for shipping.'
    },
    {
        id: 6,
        name: 'Organic Spinach',
        type: 'Sale',
        seller: 'Divya S.',
        distance: '1.5 km',
        price: '₹30/bunch',
        image: require('../../assets/Organic Spinach.png'),
        freshness: 'Freshly Harvested',
        category: 'Vegetable',
        isVerified: false,
        description: 'Tender spinach leaves, harvested this morning. Very healthy and clean.'
    }
];

// Sample flairs
const BEGINNER_FLAIR: Flair = { text: '🌱 Beginner', color: '#16a34a', backgroundColor: '#dcfce7' };
const EXPERT_FLAIR: Flair = { text: '🌿 Expert', color: '#15803d', backgroundColor: '#bbf7d0' };
const MODERATOR_FLAIR: Flair = { text: '🏆 Mod', color: '#b45309', backgroundColor: '#fed7aa' };

const QUESTION_FLAIR: Flair = { text: 'Question', color: '#2563eb', backgroundColor: '#dbeafe' };
const SUCCESS_FLAIR: Flair = { text: 'Success Story', color: '#16a34a', backgroundColor: '#dcfce7' };
const DISCUSSION_FLAIR: Flair = { text: 'Discussion', color: '#7c3aed', backgroundColor: '#ede9fe' };
const HELP_FLAIR: Flair = { text: 'Help Needed', color: '#dc2626', backgroundColor: '#fee2e2' };

export const MOCK_POSTS: Post[] = [
    {
        id: 1,
        user: 'Meera P.',
        avatar: '👩',
        text: 'My basil leaves are turning yellow 😕 Any tips? I\'ve been watering regularly and it gets good sunlight.',
        timestamp: '2 hours ago',
        upvotes: 24,
        downvotes: 2,
        upvotedBy: ['Arun K.', 'Divya S.'],
        downvotedBy: [],
        awards: ['🏆', '💡'],
        reactions: [
            { emoji: '👍', users: ['Arun K.', 'Divya S.', 'Priya K.'] },
            { emoji: '😢', users: ['Kumar V.'] }
        ],
        userKarma: 1247,
        userFlair: BEGINNER_FLAIR,
        postFlair: QUESTION_FLAIR,
        isPinned: true, // Pinned post
        comments: [
            {
                id: 'c1',
                user: 'Arun K.',
                avatar: '👨',
                text: 'Try reducing water frequency. Basil doesn\'t like wet feet!',
                timestamp: '1 hour ago',
                upvotes: 15,
                downvotes: 0,
                upvotedBy: ['Meera P.'],
                downvotedBy: [],
                reactions: [
                    { emoji: '💡', users: ['Meera P.', 'Priya K.'] }
                ],
                replies: [
                    {
                        id: 'c1r1',
                        user: 'Meera P.',
                        avatar: '👩',
                        text: 'Thanks! I\'ll try that. How often should I water?',
                        timestamp: '45 mins ago',
                        upvotes: 3,
                        downvotes: 0,
                        upvotedBy: [],
                        downvotedBy: [],
                        reactions: []
                    },
                    {
                        id: 'c1r2',
                        user: 'Arun K.',
                        avatar: '👨',
                        text: 'Once every 2-3 days should be fine. Check if soil is dry first.',
                        timestamp: '30 mins ago',
                        upvotes: 8,
                        downvotes: 0,
                        upvotedBy: ['Meera P.'],
                        downvotedBy: [],
                        reactions: []
                    }
                ]
            },
            {
                id: 'c2',
                user: 'Priya K.',
                avatar: '👩',
                text: 'Could be nitrogen deficiency. Add some compost tea or organic fertilizer.',
                timestamp: '45 mins ago',
                upvotes: 12,
                downvotes: 1,
                upvotedBy: [],
                downvotedBy: [],
                reactions: []
            },
            {
                id: 'c3',
                user: 'Kumar V.',
                avatar: '👨',
                text: 'Check for pests too! Sometimes aphids cause yellowing.',
                timestamp: '30 mins ago',
                upvotes: 7,
                downvotes: 0,
                upvotedBy: ['Meera P.'],
                downvotedBy: [],
                reactions: []
            }
        ]
    },
    {
        id: 2,
        user: 'Arun K.',
        avatar: '👨',
        text: 'Harvested my first batch of tomatoes 🍅! So proud! Started from seeds 3 months ago. Feeling accomplished!',
        images: [
            require('../../assets/tomato-harvest-1.png'),
            require('../../assets/tomato-harvest-2.png')
        ],
        timestamp: '5 hours ago',
        upvotes: 156,
        downvotes: 3,
        upvotedBy: ['Meera P.', 'Divya S.', 'Priya K.', 'Kumar V.'],
        downvotedBy: [],
        awards: ['🏆', '🎉', '❤️'],
        reactions: [
            { emoji: '❤️', users: ['Meera P.', 'Divya S.', 'Priya K.', 'Kumar V.', 'Anita S.'] },
            { emoji: '🎉', users: ['Raj M.', 'Priya K.'] },
            { emoji: '🔥', users: ['Kumar V.'] }
        ],
        userKarma: 3421,
        userFlair: EXPERT_FLAIR,
        postFlair: SUCCESS_FLAIR,
        isTrending: true, // Trending post
        comments: [
            {
                id: 'c4',
                user: 'Divya S.',
                avatar: '👩',
                text: 'Congratulations! They look amazing! 🎉',
                timestamp: '4 hours ago',
                upvotes: 23,
                downvotes: 0,
                upvotedBy: ['Arun K.'],
                downvotedBy: [],
                reactions: [
                    { emoji: '👍', users: ['Arun K.', 'Meera P.'] }
                ]
            },
            {
                id: 'c5',
                user: 'Meera P.',
                avatar: '👩',
                text: 'Wow! How long did it take from seedling to harvest?',
                timestamp: '3 hours ago',
                upvotes: 18,
                downvotes: 0,
                upvotedBy: ['Arun K.'],
                downvotedBy: [],
                reactions: [],
                replies: [
                    {
                        id: 'c5r1',
                        user: 'Arun K.',
                        avatar: '👨',
                        text: 'About 75-80 days! Cherry tomatoes are faster than regular ones.',
                        timestamp: '2 hours ago',
                        upvotes: 12,
                        downvotes: 0,
                        upvotedBy: [],
                        downvotedBy: [],
                        reactions: []
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        user: 'Divya S.',
        avatar: '👩',
        text: 'Started my rooftop garden today! Excited for this journey 🌱 Any beginner tips?',
        images: [
            require('../../assets/rooftop-garden.png')
        ],
        timestamp: '1 day ago',
        upvotes: 89,
        downvotes: 1,
        upvotedBy: ['Arun K.', 'Meera P.'],
        downvotedBy: [],
        awards: ['🌟'],
        reactions: [
            { emoji: '👍', users: ['Arun K.', 'Meera P.', 'Kumar V.'] },
            { emoji: '🌱', users: ['Priya K.'] }
        ],
        userKarma: 892,
        userFlair: BEGINNER_FLAIR,
        postFlair: DISCUSSION_FLAIR,
        comments: [
            {
                id: 'c6',
                user: 'Kumar V.',
                avatar: '👨',
                text: 'Welcome to the community! Start with easy plants like mint and basil.',
                timestamp: '1 day ago',
                upvotes: 34,
                downvotes: 0,
                upvotedBy: ['Divya S.'],
                downvotedBy: [],
                reactions: [
                    { emoji: '💡', users: ['Divya S.', 'Meera P.'] }
                ]
            },
            {
                id: 'c7',
                user: 'Priya K.',
                avatar: '👩',
                text: 'Good luck! Make sure you have proper drainage.',
                timestamp: '20 hours ago',
                upvotes: 21,
                downvotes: 0,
                upvotedBy: ['Divya S.'],
                downvotedBy: [],
                reactions: []
            },
            {
                id: 'c8',
                user: 'Anita S.',
                avatar: '👩',
                text: 'So exciting! I started mine last year and it\'s been amazing!',
                timestamp: '18 hours ago',
                upvotes: 15,
                downvotes: 0,
                upvotedBy: [],
                downvotedBy: [],
                reactions: []
            }
        ]
    },
    {
        id: 4,
        user: 'Kumar V.',
        avatar: '👨',
        text: 'PSA: Anyone know how to deal with aphids naturally? Don\'t want to use chemicals on my vegetables.',
        timestamp: '3 days ago',
        upvotes: 67,
        downvotes: 2,
        upvotedBy: ['Priya K.'],
        downvotedBy: [],
        awards: ['💡'],
        reactions: [
            { emoji: '👍', users: ['Priya K.', 'Raj M.'] }
        ],
        userKarma: 2156,
        userFlair: MODERATOR_FLAIR,
        postFlair: HELP_FLAIR,
        comments: [
            {
                id: 'c9',
                user: 'Raj M.',
                avatar: '👨',
                text: 'Neem oil spray works wonders! Mix with water and spray weekly.',
                timestamp: '3 days ago',
                upvotes: 45,
                downvotes: 1,
                upvotedBy: ['Kumar V.', 'Priya K.'],
                downvotedBy: [],
                reactions: [
                    { emoji: '🔥', users: ['Kumar V.'] }
                ]
            },
            {
                id: 'c10',
                user: 'Anita S.',
                avatar: '👩',
                text: 'Ladybugs are natural predators! You can buy them online.',
                timestamp: '2 days ago',
                upvotes: 28,
                downvotes: 0,
                upvotedBy: ['Kumar V.'],
                downvotedBy: [],
                reactions: []
            }
        ]
    }
];

export const MOCK_BADGES: Badge[] = [
    { id: '1', name: 'Green Guru', icon: '🌱', description: 'Reach Level 5 to unlock this badge.', progress: 100, earned: true },
    { id: '2', name: 'Disease-Free Grower', icon: '🩺', description: 'Identify 5 diseases correctly.', progress: 75, earned: false },
    { id: '3', name: 'Eco Contributor', icon: '🌍', description: 'Maintain a 3-day streak.', progress: 60, earned: false },
    { id: '4', name: 'Community Helper', icon: '🤝', description: 'Make 3 posts in the community.', progress: 40, earned: false }
];

export interface Plant {
    id: number;
    name: string;
    image: string;
    soil: string;
    water: string;
    sunlight: string;
    season: string;
    category: 'vegetable' | 'herb' | 'fruit' | 'flower' | 'succulent';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    daysToHarvest?: number; // Optional, for edibles
    containerSize: string; // e.g., "12-16 inches"
}

export interface Crop {
    id: number;
    name: string;
    image: string;
    stage: string;
    progress: number;
    nextAction: string;
    plantedDate?: string;
    health?: number;
    waterSchedule?: string;
    sunlight?: string;
}

export interface MarketItem {
    id: number;
    name: string;
    type: 'Swap' | 'Sale' | 'Request';
    seller: string;
    distance: string;
    price: string | null;
    image: string;
    freshness: 'Freshly Harvested' | '1 day old' | '2 days old' | 'Growing' | 'Potted';
    category: 'Vegetable' | 'Fruit' | 'Herb' | 'Flower' | 'Succulent' | 'Seeds' | 'Supplies';
    isVerified: boolean;
    description: string;
}

export interface Reaction {
    emoji: string;
    users: string[];
}

export interface Flair {
    text: string;
    color: string;
    backgroundColor: string;
}

export interface Comment {
    id: string;
    user: string;
    avatar: string;
    text: string;
    timestamp: string;
    upvotes: number;
    downvotes: number;
    upvotedBy: string[];
    downvotedBy: string[];
    images?: string[]; // Support images in comments
    reactions: Reaction[]; // Reaction emojis
    replies?: Comment[];
}

export interface Post {
    id: number;
    user: string;
    avatar: string;
    text: string;
    image?: string | number;
    images?: (string | number)[]; // Support multiple images (URLs or require() results)
    timestamp: string;
    upvotes: number;
    downvotes: number;
    upvotedBy: string[];
    downvotedBy: string[];
    awards: string[];
    reactions: Reaction[]; // Reaction emojis
    comments: Comment[];
    userKarma?: number;
    userFlair?: Flair; // User badge
    postFlair?: Flair; // Post category
    isPinned?: boolean; // Pinned to top
    isTrending?: boolean; // Hot/trending indicator
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    progress: number;
    earned: boolean;
}

export interface DiseaseDetectionResult {
    diseaseName: string;
    confidence: number;
    description: string;
    treatment: string;
}

export interface UserProfilePost {
    id: string;
    content: string;
    timestamp: string;
    likes: number;
    comments: number;
}

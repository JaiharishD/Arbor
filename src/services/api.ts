import { Platform } from 'react-native';
import { MOCK_MARKETPLACE } from '../data/mockData';

// Use 10.0.2.2 for Android Emulator, localhost for iOS/Web
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export const api = {
    // Crops
    getCrops: async () => {
        try {
            const response = await fetch(`${BASE_URL}/crops`);
            if (!response.ok) throw new Error('Failed to fetch crops');
            return await response.json();
        } catch (error) {
            // Silently fail - app will use mock data fallback
            return [];
        }
    },

    addCrop: async (cropData: any) => {
        try {
            const response = await fetch(`${BASE_URL}/crops`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cropData),
            });
            if (!response.ok) throw new Error('Failed to add crop');
            return await response.json();
        } catch (error) {
            console.log('API unreachable (addCrop), falling back to local state');
            return cropData;
        }
    },

    // Community
    getPosts: async () => {
        try {
            const response = await fetch(`${BASE_URL}/community`);
            if (!response.ok) throw new Error('Failed to fetch posts');
            return await response.json();
        } catch (error) {
            // Silently fail - app will use mock data fallback
            return [];
        }
    },

    createPost: async (postData: any) => {
        try {
            const response = await fetch(`${BASE_URL}/community`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
            if (!response.ok) throw new Error('Failed to create post');
            return await response.json();
        } catch (error) {
            console.log('API unreachable (createPost), falling back to local state');
            return postData;
        }
    },

    // Marketplace
    getMarketplaceItems: async () => {
        try {
            const response = await fetch(`${BASE_URL}/marketplace`);
            if (!response.ok) throw new Error('Failed to fetch marketplace items');
            return await response.json();
        } catch (error) {
            console.log('API unreachable (getMarketplaceItems), falling back to mock data');
            return MOCK_MARKETPLACE;
        }
    }
};

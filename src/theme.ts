export const theme = {
    light: {
        background: '#f0fdf4', // green-50
        card: '#ffffff',
        text: '#1f2937', // gray-800
        textSecondary: '#6b7280', // gray-500
        primary: '#16a34a', // green-600
        primaryDark: '#166534', // green-800
        secondary: '#dcfce7', // green-100
        accent: '#f59e0b', // amber-500
        border: '#e5e7eb', // gray-200
        error: '#ef4444', // red-500
        success: '#22c55e', // green-500
    },
    dark: {
        background: '#111827', // gray-900
        card: '#1f2937', // gray-800
        text: '#f9fafb', // gray-50
        textSecondary: '#9ca3af', // gray-400
        primary: '#22c55e', // green-500
        primaryDark: '#4ade80', // green-400 (lighter for dark mode)
        secondary: '#064e3b', // green-900
        accent: '#fbbf24', // amber-400
        border: '#374151', // gray-700
        error: '#f87171', // red-400
        success: '#4ade80', // green-400
    },
};

export type Theme = typeof theme.light;

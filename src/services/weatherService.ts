import * as Location from 'expo-location';

export interface WeatherData {
    temperature: number;
    feelsLike: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    location: string;
    icon: string;
    weatherType: 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'drizzle' | 'mist';
}

interface WeatherCache {
    data: WeatherData;
    timestamp: number;
}

let weatherCache: WeatherCache | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Get the user's current location
 */
async function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    // Request location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
        throw new Error('Location permission denied');
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
    });

    return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    };
}

/**
 * Map OpenWeatherMap condition codes to simplified weather types
 */
function getWeatherType(conditionCode: number): WeatherData['weatherType'] {
    if (conditionCode >= 200 && conditionCode < 300) return 'thunderstorm';
    if (conditionCode >= 300 && conditionCode < 400) return 'drizzle';
    if (conditionCode >= 500 && conditionCode < 600) return 'rain';
    if (conditionCode >= 600 && conditionCode < 700) return 'snow';
    if (conditionCode >= 700 && conditionCode < 800) return 'mist';
    if (conditionCode === 800) return 'clear';
    return 'clouds';
}

/**
 * Fetch weather data from OpenWeatherMap API
 */
export async function getWeatherData(): Promise<WeatherData> {
    try {
        // Check cache first
        if (weatherCache && Date.now() - weatherCache.timestamp < CACHE_DURATION) {
            console.log('Returning cached weather data');
            return weatherCache.data;
        }

        // Get API key from environment
        const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

        console.log('API Key check:', apiKey ? 'Found' : 'Not found');
        console.log('API Key value:', apiKey ? `${apiKey.substring(0, 8)}...` : 'undefined');
        console.log('API Key length:', apiKey?.length);

        if (!apiKey || apiKey.trim() === '' || apiKey === 'your_api_key_here') {
            throw new Error('Please add your OpenWeatherMap API key to .env file. Get one free at openweathermap.org/api');
        }

        console.log('Requesting location permission...');
        // Get user's location
        const { latitude, longitude } = await getCurrentLocation();
        console.log('Location obtained:', latitude, longitude);

        // Fetch weather data
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
        console.log('Fetching weather from API...');

        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);

            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your OpenWeatherMap API key in .env file');
            }
            throw new Error(`Weather API error: ${response.status}. ${errorText}`);
        }

        const data = await response.json();
        console.log('Weather data received:', data.name);

        // Parse weather data
        const weatherData: WeatherData = {
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
            location: data.name,
            icon: data.weather[0].icon,
            weatherType: getWeatherType(data.weather[0].id),
        };

        // Cache the result
        weatherCache = {
            data: weatherData,
            timestamp: Date.now(),
        };

        console.log('Weather data cached successfully');
        return weatherData;
    } catch (error) {
        console.error('Weather fetch error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to fetch weather data');
    }
}

/**
 * Clear the weather cache (useful for manual refresh)
 */
export function clearWeatherCache(): void {
    weatherCache = null;
}

/**
 * Get weather emoji based on weather type
 */
export function getWeatherEmoji(weatherType: WeatherData['weatherType']): string {
    const emojiMap: Record<WeatherData['weatherType'], string> = {
        clear: '☀️',
        clouds: '☁️',
        rain: '🌧️',
        snow: '❄️',
        thunderstorm: '⛈️',
        drizzle: '🌦️',
        mist: '🌫️',
    };
    return emojiMap[weatherType] || '🌤️';
}

/**
 * Get weather gradient colors based on weather type
 */
export function getWeatherGradient(weatherType: WeatherData['weatherType']): string[] {
    const gradientMap: Record<WeatherData['weatherType'], string[]> = {
        clear: ['#FDB813', '#FDCB6E'], // Sunny yellow/orange
        clouds: ['#95A5A6', '#BDC3C7'], // Gray
        rain: ['#3498DB', '#5DADE2'], // Blue
        snow: ['#ECF0F1', '#D5DBDB'], // Light gray/white
        thunderstorm: ['#34495E', '#5D6D7E'], // Dark gray
        drizzle: ['#85C1E2', '#A9CCE3'], // Light blue
        mist: ['#AAB7B8', '#CCD1D1'], // Misty gray
    };
    return gradientMap[weatherType] || ['#16a34a', '#10b981']; // Default green;
}

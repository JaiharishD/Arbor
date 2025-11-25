# Arbor App - Setup Instructions

## Quick Start

### 1. Install Dependencies

The required package `expo-location` has already been installed. If you need to reinstall:

```bash
npm install expo-location
```

### 2. Get Your OpenWeatherMap API Key

1. Visit [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click "Sign Up" (it's free!)
3. After signing up, go to "API Keys" section
4. Copy your API key

### 3. Configure Environment Variables

Open your `.env` file and add:

```
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with the API key you copied.

### 4. Start the App

```bash
# Clear cache and start
npx expo start -c
```

### 5. Grant Permissions

When you first open the app:
- The app will ask for location permissions
- Tap "Allow" to enable weather features
- Weather will load automatically!

---

## What's New

✅ **Real-time weather** with location-based data  
✅ **26 terrace gardening plants** (up from 4!)  
✅ **Search & filter** plants by name and category  
✅ **Weather-themed UI** that changes with conditions  
✅ **Enhanced plant details** with difficulty badges  

---

## Troubleshooting

**Weather not loading?**
- Check that your API key is set in `.env`
- Make sure location permissions are granted
- Restart the app with `npx expo start -c`

**Search not working?**
- Try clearing the search and typing again
- Use category filters instead

---

For detailed documentation, see [walkthrough.md](file:///C:/Users/Jaiharish%20D/.gemini/antigravity/brain/dd4255a2-d2ce-4343-b417-0db8b6ffda91/walkthrough.md)

const fs = require('fs');
const path = require('path');
const https = require('https');

// Read .env file manually
const envPath = path.join(__dirname, '../.env');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/EXPO_PUBLIC_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    } else {
        // Try API_KEY
        const match2 = envContent.match(/API_KEY=(.*)/);
        if (match2) apiKey = match2[1].trim();
    }
} catch (e) {
    console.error("Could not read .env file:", e.message);
    process.exit(1);
}

if (!apiKey) {
    console.error("API Key not found in .env");
    process.exit(1);
}

console.log("Checking models with API Key starting with:", apiKey.substring(0, 4) + "...");

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", json.error);
            } else if (json.models) {
                console.log("Available Models:");
                json.models.forEach(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
                    }
                });
            } else {
                console.log("Unexpected response:", json);
            }
        } catch (e) {
            console.error("Error parsing response:", e);
            console.log("Raw data:", data);
        }
    });
}).on('error', (e) => {
    console.error("Request error:", e);
});

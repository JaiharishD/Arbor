const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());

// Helper to read data
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading data:", err);
        return { crops: [], posts: [], marketplace: [] };
    }
};

// Helper to write data
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing data:", err);
    }
};

// --- Routes ---

// Get all crops
app.get('/api/crops', (req, res) => {
    const data = readData();
    res.json(data.crops);
});

// Add a new crop
app.post('/api/crops', (req, res) => {
    const data = readData();
    const newCrop = {
        id: Date.now().toString(),
        ...req.body,
        progress: 0,
        stage: 'Seedling'
    };
    data.crops.push(newCrop);
    writeData(data);
    res.status(201).json(newCrop);
});

// Get community posts
app.get('/api/community', (req, res) => {
    const data = readData();
    res.json(data.posts);
});

// Create a post
app.post('/api/community', (req, res) => {
    const data = readData();
    const newPost = {
        id: Date.now().toString(),
        ...req.body,
        likes: 0,
        comments: 0,
        avatar: '👤' // Default avatar
    };
    data.posts.unshift(newPost); // Add to top
    writeData(data);
    res.status(201).json(newPost);
});

// Get marketplace items
app.get('/api/marketplace', (req, res) => {
    const data = readData();
    res.json(data.marketplace);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`For Android Emulator, use http://10.0.2.2:${PORT}`);
});

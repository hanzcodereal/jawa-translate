const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

// === KODE LOGIKA DARI ANDA ===
const Jawa = {
    translate: async (text, { from = 'indo', to = 'krama-alus' } = {}) => {
        try {
            if (!text) throw new Error('Text is required.');
            
            const languageMap = {
                'indo': 'id',
                'jawa': 'jw',
                'krama-lugu': 'kl',
                'krama-alus': 'ka',
                'ngoko': 'ng'
            };
            
            const fromCode = languageMap[from];
            const toCode = languageMap[to];
            
            if (!fromCode) throw new Error(`Invalid 'from' language: ${from}.`);
            if (!toCode) throw new Error(`Invalid 'to' language: ${to}.`);
            
            // Logic validation
            if (fromCode === 'id' && toCode === 'id') throw new Error('Cannot translate from indo to indo.');
            // Note: API might handle mixed logic, but keeping your constraint:
            if (fromCode === 'jw' && toCode !== 'id') throw new Error('When translating from jawa, target must be indo.');
            
            const { data } = await axios.post('https://api.translatejawa.id/translate', {
                text: text.trim(),
                from: fromCode,
                to: toCode
            }, {
                headers: {
                    'content-type': 'application/json',
                    referer: 'https://translatejawa.id/',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
                }
            });
            
            return data.result;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    
    aksara: async (text, { direction = 'toJavanese', withSpace = true, withMurda = true } = {}) => {
        try {
            if (!text) throw new Error('Text is required.');
            
            const validDirections = ['toJavanese', 'toLatin'];
            if (!validDirections.includes(direction)) throw new Error(`Invalid direction.`);
            
            const { data } = await axios.post('https://aksarajawa.id/api/translate', {
                text: text.trim(),
                direction: direction,
                options: {
                    withSpace: withSpace,
                    withMurda: withMurda,
                    typeMode: true
                }
            }, {
                headers: {
                    'content-type': 'application/json',
                    referer: 'https://aksarajawa.id/',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
                }
            });
            
            return data.result;
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

// === API ROUTES ===

// Endpoint Translate Bahasa
app.post('/api/translate', async (req, res) => {
    try {
        const { text, from, to } = req.body;
        const result = await Jawa.translate(text, { from, to });
        res.json({ success: true, result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Endpoint Aksara Jawa
app.post('/api/aksara', async (req, res) => {
    try {
        const { text, direction } = req.body;
        const result = await Jawa.aksara(text, { direction });
        res.json({ success: true, result });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Catch-all route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Export app for Vercel
module.exports = app; 

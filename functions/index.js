const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');  // Ensure fetch is imported
const app = express();

// Enable CORS
app.use(cors({ origin: true }));

// Allow CORS from all origins (for development purposes)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Update this in production
    next();
});

// Endpoint to fetch and process data
app.get('/api/videos/:league', async (req, res) => {
    const league = req.params.league;

    if (league === 'shl') {
        try {
            console.log(`Ohh! SHL is calling`);
            const apiUrl = 'https://www.shl.se/api/feeds?page=0&pageSize=48&contentTypes=videos&requiredTags=custom.highlights&siteInstanceIds=shl1_shl&showHiddenItems=false';
            const apiResponse = await fetch(apiUrl);
            const data = await apiResponse.json();

            // Process the data
            const processedData = data.map(video => {
                const videoID = video.id.split('|').pop();
                const [homeTeam, awayTeam] = video.header.split('-').map(team => team.trim());
                return {
                    videoID,
                    homeTeam,
                    awayTeam,
                    header: video.header,
                    publishedAt: video.publishedAt,
                };
            });

            res.json(processedData);
        } catch (error) {
            console.error('Error fetching data from SHL API:', error);
            res.status(500).json({ error: 'Error fetching data' });
        }
    } else {
        res.status(500).json({ error: 'League unavailable, please check back soon' });
    }
});

// Export the Express app as an HTTPS Cloud Function
exports.api = functions.https.onRequest(app);

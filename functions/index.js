/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors({ origin: true }));

// Allow CORS from all origins (for development purposes)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Update this in production, e.g. res.header('Access-Control-Allow-Origin', 'https://your-frontend-domain.com');
    //TODO: UPDATE res.header
    next();
  });
  
  // Endpoint to fetch and process data
app.get('/api/videos/:league', async (req, res) => {
      const league = req.params.league;
  
      if (league === 'shl') {
          try {
              console.log(`Ohh! SHL is calling`);
              const apiUrl = 'https://www.shl.se/api/feeds?page=0&pageSize=48&contentTypes=videos&requiredTags=custom.highlights&siteInstanceIds=shl1_shl&showHiddenItems=false';
              const response = await fetch(apiUrl);
              const data = await response.json();
  
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
          }}
      
      
      else () => {
          res.status(500).json({ error: 'League unavailable, please check back soon' });
      }
    });

// Export the Express app as an HTTPS Cloud Function
exports.api = functions.https.onRequest(app);

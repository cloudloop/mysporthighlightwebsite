// server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static('public'));

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

// app.get('api/video/:sportSelected', async(req, res) => {

//     try {
//         var name = req.params.sportSelected;
//         console.log(`Fetching data for @${name}`);
            
//             // const apiUrl = '';
//             // const response = await fetch(apiUrl);
//             // const data = await response.json();
        
//             // // Process the data
//             // const processedData = data.map(video => {
//             // const videoID = video.id.split('|').pop();
//             // const [homeTeam, awayTeam] = video.header.split('-').map(team => team.trim());
//             // return {
//             //     videoID,
//             //     homeTeam,
//             //     awayTeam,
//             //     header: video.header,
//             //     publishedAt: video.publishedAt,
//             // };
//             // });
    
//         // res.json(processedData);
//         res.json({"Error":"Site is under development. This league is a placeholder for now"})
//       } catch (error) {
//         console.error(`Error fetching data from  API:`, error);
//         res.status(500).json({ error: 'Error fetching data' });
//       }
// });

// Start the server

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

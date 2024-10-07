// Global variables

//Adding dynamic league selection
let selectedSport = 'hockey';
let selectedLeague = 'shl';
let allVideos = [];
let displayedVideos = [];
let teams = new Set();
let currentIndex = 0;
const pageSize = 6;
const initialLoad = 9;
let selectedTeam = null;
const APIurl = "https://api-404019135129.us-central1.run.app"

// Placeholder data for leagues
const leaguesBySport = {
    'hockey': [
        { value: 'shl', text: 'SHL' },
        { value: 'nhl', text: 'NHL' }
    ],
    'football': [
        { value: 'premier-league', text: 'Premier League' },
        { value: 'la-liga', text: 'La Liga' }
    ],
    'basketball': [
        { value: 'nba', text: 'NBA' },
        { value: 'euroleague', text: 'EuroLeague' }
    ]
    // Add more sports and leagues as needed
};

// Populate leagues based on selected sport
function populateLeagues() {
    const leagueSelect = document.getElementById('league-select');
    leagueSelect.innerHTML = '';
    leaguesBySport[selectedSport].forEach(league => {
        const option = document.createElement('option');
        option.value = league.value;
        option.textContent = league.text;
        leagueSelect.appendChild(option);
    });
    selectedLeague = leagueSelect.value;
}

// Event listeners for sport and league selection
document.getElementById('sport-select').addEventListener('change', function() {
    selectedSport = this.value;
    removeTeamList();
    removeVideos();
    selectedLeague = document.getElementById('league-select').value;
    populateLeagues();
    fetchData();
});

document.getElementById('league-select').addEventListener('change', function() {
    selectedLeague = this.value;
    removeTeamList();
    removeVideos();
    fetchData();
});



// Show loading animation
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

// Hide loading animation
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function pause(){
    setTimeout(()=>null,1500)
}

// Fetch data from your Node.js server
function fetchData() {
    showLoading();
    pause();
    fetch(`${APIurl}/api/videos/${selectedLeague}`)
        .then(response => response.json())
        .then(data => {
            currentIndex = 0;
            displayedVideos = [];
            teams.clear();
            allVideos = data;
            extractTeams();
            displayTeamList();
            loadVideos(initialLoad);
            hideLoading();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            hideLoading();
        });
}

// Extract unique team names from the data
function extractTeams() {
    allVideos.forEach(video => {
        teams.add(video.homeTeam);
        teams.add(video.awayTeam);
        console.log(`${video.homeTeam}, ${video.awayTeam}`);
    });
}

// Display the team list in the sidebar
function displayTeamList() {
    const teamList = document.getElementById('team-list');
    teamList.innerHTML = ''; // Clear existing list
    const createdTeams = [];

    // Sort the teams alphabetically
    const sortedTeams = Array.from(teams).sort(); // Converts the Set to an array. This is necessary because Set objects do not have sort() or other array methods.
    sortedTeams.forEach(team => {
        // Check if the team already exists in the createdTeams array
        if (!createdTeams.includes(team)) {
            const li = document.createElement('li');
            li.textContent = team;
            li.addEventListener('click', () => filterByTeam(team));
            teamList.appendChild(li);
            
            // Add the team to the createdTeams array
            createdTeams.push(team);
        }
    });
}

function removeTeamList() {
    const teamList = document.getElementById('team-list');
    teamList.innerHTML = ''; // Clear existing list
};

function removeVideos(){
    const teamList = document.getElementById('video-container');
    teamList.innerHTML = ''; // Clear existing list
}
// Load videos to the main content area
function loadVideos(count) {
    const container = document.getElementById('video-container');
    console.log(`Getting video containers`);
    let videosToLoad = allVideos.slice(currentIndex, currentIndex + count);

    // If a team is selected, filter the videos
    if (selectedTeam) {
        videosToLoad = allVideos.filter(video => video.homeTeam === selectedTeam || video.awayTeam === selectedTeam)
                                .slice(currentIndex, currentIndex + count);
    }

    videosToLoad.forEach(video => {
        console.log(`Embedding videos...`);
        const videoURL = `https://embed.staylive.tv/video/${video.videoID}?autoplay=0`;

        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';

        const iframe = document.createElement('iframe');
        iframe.src = videoURL;
        iframe.frameBorder = '0';
        iframe.allow = 'fullscreen; picture-in-picture; autoplay';

        videoItem.appendChild(iframe);
        container.appendChild(videoItem);
        displayedVideos.push(video);
        console.log(`Video Live!`);
    });

    currentIndex += count;
}

// Handle the Load More button click
document.getElementById('load-more').addEventListener('click', () => {
    loadVideos(pageSize);
});

// Filter videos by team
function filterByTeam(team) {
    selectedTeam = team;
    currentIndex = 0;
    displayedVideos = [];
    document.getElementById('video-container').innerHTML = '';
    loadVideos(initialLoad);
}

// Initialize the app
populateLeagues();
fetchData();
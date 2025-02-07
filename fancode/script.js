const M3U_URL = "https://raw.githubusercontent.com/byte-capsule/FanCode-Hls-Fetcher/refs/heads/main/Fancode_Live.m3u";  // Replace with your M3U link
let channels = [];

async function loadChannels() {
    const response = await fetch(M3U_URL);
    const data = await response.text();
    channels = parseM3U(data);

    populateGroups();
    displayChannels(channels);
}

// Parse M3U File
function parseM3U(m3uData) {
    const lines = m3uData.split("\n");
    let channels = [];
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("#EXTINF")) {
            let details = lines[i].match(/tvg-name="([^"]+)"|group-title="([^"]+)"|,([^,]*)/g) || [];
            let logo = lines[i].match(/tvg-logo="([^"]+)"/)?.[1] || "default-logo.png";
            let url = lines[i + 1]?.trim();

            channels.push({
                name: details[2] || "Unknown",
                group: details[1] || "General",
                logo,
                url
            });
        }
    }
    return channels;
}

// Display Channels in Grid
function displayChannels(channelList) {
    const container = document.getElementById("channelGrid");
    container.innerHTML = "";
    
    channelList.forEach(channel => {
        const channelCard = document.createElement("div");
        channelCard.className = "channel-card";
        channelCard.innerHTML = `
            <img src="${channel.logo}" alt="${channel.name}">
            <h3>${channel.name}</h3>
            <button onclick="playChannel('${channel.url}')">Watch</button>
        `;
        container.appendChild(channelCard);
    });
}

// Play Channel
function playChannel(url) {
    window.location.href = `player.html?url=${encodeURIComponent(url)}`;
}

// Populate Group Dropdown
function populateGroups() {
    let groupSet = new Set(["All Groups"]);
    channels.forEach(c => groupSet.add(c.group));
    
    const groupFilter = document.getElementById("groupFilter");
    groupFilter.innerHTML = "";
    
    groupSet.forEach(group => {
        const option = document.createElement("option");
        option.value = group;
        option.textContent = group;
        groupFilter.appendChild(option);
    });
}

// Filter Groups
function filterGroups() {
    const selectedGroup = document.getElementById("groupFilter").value;
    const filteredChannels = selectedGroup === "All Groups" ? channels : channels.filter(c => c.group === selectedGroup);
    displayChannels(filteredChannels);
}

// Search Channels
function searchChannels() {
    const searchText = document.getElementById("search").value.toLowerCase();
    const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(searchText));
    displayChannels(filteredChannels);
}

// Dark Mode Based on Dhaka Time
function applyDarkMode() {
    let now = new Date();
    let dhakaOffset = 6 * 60 * 60 * 1000; // UTC+6
    now.setTime(now.getTime() + dhakaOffset);

    let hours = now.getUTCHours();
    if (hours >= 18 || hours <= 6) {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadChannels();
    applyDarkMode();
});

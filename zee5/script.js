const m3uURL = "https://your-m3u-playlist-url.com/playlist.m3u"; // Change to your M3U URL
const channelsContainer = document.getElementById("channelsContainer");

// Fetch and parse M3U Playlist
async function loadM3UChannels() {
    try {
        const response = await fetch(m3uURL);
        const m3uText = await response.text();
        const channels = parseM3U(m3uText);
        displayChannels(channels);
    } catch (error) {
        console.error("Error loading M3U playlist:", error);
        channelsContainer.innerHTML = "Failed to load channels.";
    }
}

// Parse M3U data
function parseM3U(m3uText) {
    const lines = m3uText.split("\n");
    const channels = [];

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("#EXTINF")) {
            const nameMatch = lines[i].match(/,(.+)/);
            const logoMatch = lines[i].match(/tvg-logo="([^"]+)"/);
            const url = lines[i + 1]?.trim();

            if (nameMatch && url) {
                channels.push({
                    name: nameMatch[1],
                    logo: logoMatch ? logoMatch[1] : "default-logo.png",
                    streamUrl: url
                });
            }
        }
    }
    return channels;
}

// Display Channels
function displayChannels(channels) {
    channelsContainer.innerHTML = "";

    channels.forEach(channel => {
        const channelCard = document.createElement("div");
        channelCard.classList.add("channel-card");
        channelCard.innerHTML = `
            <p>${channel.name}</p>
        `;
        channelCard.addEventListener("click", () => {
            window.location.href = `player.html?channel=${encodeURIComponent(channel.streamUrl)}`;
        });

        channelsContainer.appendChild(channelCard);
    });
}

// Manually Enter URL
function loadChannel() {
    let url = document.getElementById("channelUrl").value;
    if (url) {
        window.location.href = `player.html?channel=${encodeURIComponent(url)}`;
    } else {
        alert("Please enter a valid URL!");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const channelUrl = urlParams.get("channel");

    if (!channelUrl) {
        alert("No channel URL provided!");
        return;
    }

    jwplayer("player").setup({
        controls: true,
        displaytitle: true,
        fullscreen: true,
        width: "100%",
        height: "100%",
        autostart: true,
        file: channelUrl,
        type: "hls",
    });
});


// Load Channels on Page Load
loadM3UChannels();

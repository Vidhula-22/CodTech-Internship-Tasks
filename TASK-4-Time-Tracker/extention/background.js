let activeTab = "";
let startTime = Date.now();

// When user switches tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) trackTime(tab.url);
});

// When page loads
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    trackTime(tab.url);
  }
});

function trackTime(url) {
  try {
    const endTime = Date.now();
    const timeSpent = endTime - startTime;

    if (activeTab) {
      sendToBackend(activeTab, timeSpent);
    }

    activeTab = new URL(url).hostname;
    startTime = Date.now();

  } catch (err) {
    console.log("Invalid URL skipped");
  }
}

function sendToBackend(site, time) {
  fetch("http://localhost:5000/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      site,
      time,
    }),
  }).catch(err => console.log("Backend not running"));
}
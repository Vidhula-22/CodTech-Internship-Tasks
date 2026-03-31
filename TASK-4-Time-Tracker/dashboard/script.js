async function loadData() {
  const res = await fetch("http://localhost:5000/analytics");
  const data = await res.json();

  const table = document.getElementById("data");
  table.innerHTML = "";

  let prod = 0, unprod = 0, neutral = 0;

  for (let site in data) {

    // Remove useless entries
    if (site === "newtab" || site === "extensions" || site === "127.0.0.1") continue;

    const minutes = Math.floor(data[site] / 60);
    const category = classify(site);

    if (category.includes("Productive")) prod += minutes;
    else if (category.includes("Unproductive")) unprod += minutes;
    else neutral += minutes;

    const row = `
      <tr>
        <td>${site}</td>
        <td>${minutes} min</td>
        <td><span class="badge ${getClass(category)}">${category}</span></td>
      </tr>
    `;

    table.innerHTML += row;
  }

  drawChart(prod, unprod, neutral);
}

function classify(site) {
  site = site.replace("www.", "");

  if (site.includes("youtube") || site.includes("instagram")) {
    return "Unproductive";
  }

  if (site.includes("github") || site.includes("stackoverflow") || site.includes("chatgpt")) {
    return "Productive";
  }

  return "Neutral";
}

function getClass(category) {
  if (category === "Productive") return "prod";
  if (category === "Unproductive") return "unprod";
  return "neutral";
}

function drawChart(prod, unprod, neutral) {
  const ctx = document.getElementById("chart");

  if (window.myChart) {
    window.myChart.destroy(); // prevents overlap
  }

  window.myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Productive", "Unproductive", "Neutral"],
      datasets: [{
        data: [prod, unprod, neutral]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// Auto refresh every 5 seconds
setInterval(loadData, 5000);

loadData();
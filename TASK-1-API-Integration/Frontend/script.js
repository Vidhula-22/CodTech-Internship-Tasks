async function getWeather() {
  // Get city input, trim spaces
  const city = document.getElementById("cityInput").value.trim();
  const result = document.getElementById("result");

  if (!city) {
    result.innerHTML = "⚠ Please enter a city name";
    return;
  }

  result.innerHTML = "⏳ Loading...";

  try {
    // Force fresh fetch every time, prevents caching
    const response = await fetch(`http://localhost:5000/api/weather?city=${city}&rand=${Math.random()}`);
    const data = await response.json();

    if (data.error) {
      result.innerHTML = `❌ ${data.error}`;
      return;
    }

    result.innerHTML = `
      <h3>${data.city}</h3>
      🌡 Temperature: ${data.temperature} °C <br>
      💨 Wind Speed: ${data.windSpeed} m/s <br>
      ☁ Condition: ${data.description}
    `;
  } catch (err) {
    result.innerHTML = "❌ Cannot connect to server";
  }
}

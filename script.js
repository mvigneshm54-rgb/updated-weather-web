const apiKey ="99b89e35a8405fd39cbb2ff82d4076f5"; // Replace with your OpenWeather API key

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city name!");
    return;
  }
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  );
  const data = await response.json();
  if (data.cod !== 200) {
    alert("City not found!");
    return;
  }
  displayWeather(data);
  getForecast(data.coord.lat, data.coord.lon);
}

async function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      displayWeather(data);
      getForecast(latitude, longitude);
    });
  } else {
    alert("Geolocation not supported by your browser.");
  }
}

function displayWeather(data) {
  document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById("description").textContent = data.weather[0].description.toUpperCase();
  document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById("humidity").textContent = `💧 Humidity: ${data.main.humidity}%`;
  document.getElementById("wind").textContent = `💨 Wind: ${data.wind.speed} m/s`;
  document.getElementById("pressure").textContent = `🌡️ Pressure: ${data.main.pressure} hPa`;
  document.getElementById("visibility").textContent = `👁️ Visibility: ${data.visibility / 1000} km`;

  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
  document.getElementById("sunrise").textContent = `🌅 Sunrise: ${sunrise}`;
  document.getElementById("sunset").textContent = `🌇 Sunset: ${sunset}`;

  document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.getElementById("weatherBox").style.display = "block";
}

async function getForecast(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  );
  const data = await response.json();

  const forecastCards = document.getElementById("forecastCards");
  forecastCards.innerHTML = "";

  // Filter forecast data for one entry per day (every 8th 3-hour interval = 24 hrs)
  const dailyForecasts = data.list.filter((_, i) => i % 8 === 0);

  dailyForecasts.forEach((day) => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const temp = Math.round(day.main.temp);
    const icon = day.weather[0].icon;

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <p>${dayName}</p>
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon">
      <p>${temp}°C</p>
    `;
    forecastCards.appendChild(card);
  });

  document.getElementById("forecast").style.display = "block";
}

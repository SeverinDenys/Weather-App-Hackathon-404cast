const API_KEY = "a1aa435f89b1f58779c0e2ca8fbb02ad";
const container = document.querySelector(".container");
const input = document.getElementById("city-input");
const btn = document.getElementById("city-input-btn");

btn.addEventListener("click", async () => {
  const city = input.value.trim();
  if (!city) return alert("Enter a city");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    // Pick first entry of each day
    const dailyEntry = [];
    const dates = new Set();
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!dates.has(date)) {
        dates.add(date);
        dailyEntry.push(item);
      }
    });

    container.innerHTML = `
      <h2>${data.city.name.toUpperCase()}</h2>
         <p>Weather forecast for 7 days:</p>
      <div class="forecast-container">
        ${dailyEntry
          .slice(0, 7)
          .map((day) => {
            const date = new Date(day.dt * 1000).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });
            const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
            return `
            <div class="day-card">
              <p>${date}</p>
              <img src="${icon}" alt="${day.weather[0].description}">
              <p>${Math.round(day.main.temp)}°C</p>
              <p>${day.weather[0].description}</p>
              <p>💨 ${Math.round(day.wind.speed)} km/h</p>
            </div>
          `;
          })
          .join("")}
      </div>
    `;
  } catch (err) {
    alert(err.message);
  }
});

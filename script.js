const API_KEY = "b67e9c150e80916e99585dd284b92663";
const DEFAULT_CITY = "Pangasinan";
let debounceTimer;

const searchInput = document.getElementById("searchInput");
const forecastDiv = document.getElementById("forecast");
const mapFrame = document.getElementById("mapFrame");

const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temp");
const descEl = document.getElementById("desc");
const extraEl = document.getElementById("extra");
const iconEl = document.getElementById("icon");

// ================= WEATHER LOAD =================
function loadWeather(city) {
    if (!city) return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
        if(data.cod !== 200) return;

        // Update weather display
        cityEl.textContent = `${data.name}, ${data.sys.country}`;
        tempEl.textContent = Math.round(data.main.temp) + "°C";
        descEl.textContent = data.weather[0].description;
        extraEl.textContent = `Humidity ${data.main.humidity}% • Wind ${data.wind.speed} m/s`;

        iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // Update map to searched location
        const zoomLevel = 6;
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        mapFrame.src = `https://www.google.com/maps?q=${lat},${lon}&z=${zoomLevel}&output=embed`;

        applyWeatherBackground(data.weather[0].main);
    });

    // 5-DAY FORECAST
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => {
        forecastDiv.innerHTML = "";

        for (let i = 0; i < data.list.length; i += 8) {
            const day = data.list[i];

            forecastDiv.innerHTML += `
                <div class="forecast-card">
                    <p>${new Date(day.dt_txt).toLocaleDateString(undefined,{weekday:"short"})}</p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                    <p>${Math.round(day.main.temp)}°C</p>
                </div>
            `;
        }
    });
}

// ================= WEATHER BACKGROUND =================
function applyWeatherBackground(main) {
    document.body.classList.remove("sunny","cloudy","rainy","snowy","windy");
    main = main.toLowerCase();

    if(main.includes("clear")) document.body.classList.add("sunny");
    else if(main.includes("cloud")) document.body.classList.add("cloudy");
    else if(main.includes("rain") || main.includes("drizzle") || main.includes("thunderstorm")) document.body.classList.add("rainy");
    else if(main.includes("snow")) document.body.classList.add("snowy");
    else if(main.includes("wind")) document.body.classList.add("windy");
    else document.body.style.background = "#eaf4ff";
}

// ================= SEARCH WITH DEBOUNCE =================
searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const value = searchInput.value.trim();
        if (value.length >= 3) loadWeather(value);
    }, 700);
});

// ================= DEFAULT LOAD =================
window.onload = () => {
    searchInput.value = "";      // empty search
    loadWeather(DEFAULT_CITY);   // default Philippines forecast
};

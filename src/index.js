const openWeatherApiKey = "d1193959d2d841ec7555416d715716a6";

function showElement(response) {
  const searchCity = document.querySelector("#city");
  const dateElement = document.querySelector("#current-date");
  const dt = response.data.dt;
  const timezone = response.data.timezone;
  const date = new Date((dt + timezone) * 1000);

  const temperatureElement = document.querySelector("#current-temperature");
  const iconElement = document.querySelector("#current-icon");
  const iconCode = response.data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const descriptionElement = document.querySelector("#current-description");

  searchCity.innerHTML = response.data.name;
  dateElement.innerHTML = formatDate(date);
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  iconElement.src = iconUrl;
  iconElement.alt = response.data.weather[0].description;
  descriptionElement.innerHTML = response.data.weather[0].description;
}

function showForecastElement(response) {
  const forecastList = response.data.list;
  const dailyForecast = forecastList.filter((f) =>
    f.dt_txt.includes("12:00:00")
  );

  const forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = "";

  dailyForecast.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString("en-AU", { weekday: "short" });
    const icon = forecast.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    const temp = Math.round(forecast.main.temp);

    forecastElement.innerHTML += `
      <div class="forecast-details">
        <div class="day">${day}</div>
        <img src="${iconUrl}" class="forecast-icon" />
        <div class="temp">${temp}°C</div>
      </div>
    `;
  });
}

function displayCity(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}&units=metric`;

  axios.get(apiUrl).then((response) => {
    const lat = response.data.coord.lat;
    const lon = response.data.coord.lon;

    const currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;

    axios.get(currentApiUrl).then(showElement);
    axios.get(forecastApiUrl).then(showForecastElement);

    startWindyWebcamAutoRefresh(lat, lon);
  });
}

function updateWindyWebcam(lat, lon) {
  axios
    .get(`http://localhost:3000/webcam?lat=${lat}&lon=${lon}`)
    .then((response) => {
      const webcams = response.data.result.webcams;
      if (webcams.length > 0) {
        const webcam = webcams[0];
        const img = document.getElementById("windy-webcam");
        img.src = webcam.image.current.preview;
      }
    })
    .catch((err) => console.error("Error fetching webcam:", err));
}

function startWindyWebcamAutoRefresh(lat, lon) {
  updateWindyWebcam(lat, lon);
  setInterval(() => updateWindyWebcam(lat, lon), 30000);
}

function searchForCity(event) {
  event.preventDefault();
  const searchInput = document.querySelector("#search-form-input");
  displayCity(searchInput.value);
}

const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchForCity);

displayCity("Perth");

function formatDate(date) {
  let hour = date.getUTCHours();
  let minute = date.getUTCMinutes();
  if (hour < 10) hour = `0${hour}`;
  if (minute < 10) minute = `0${minute}`;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = days[date.getUTCDay()];
  return `${day} ${hour}:${minute}`;
}

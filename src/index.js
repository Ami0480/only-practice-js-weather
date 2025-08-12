function showElement(response) {
  console.log(response.data);
  let searchCity = document.querySelector("#city");
  let dateElement = document.querySelector("#current-date");
  let dt = response.data.dt;
  let timezone = response.data.timezone;
  let date = new Date((dt + timezone) * 1000);
  let temperatureElement = document.querySelector("#current-temperature");
  let iconElement = document.querySelector("#current-icon");
  let iconCode = response.data.weather[0].icon;
  let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  let descriptionElement = document.querySelector("#current-description");

  searchCity.innerHTML = response.data.name;
  dateElement.innerHTML = formatDate(date);
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  iconElement.src = iconUrl;
  iconElement.alt = response.data.weather[0].description;
  descriptionElement.innerHTML = response.data.weather[0].description;
}

function formatDate(date) {
  let hour = date.getUTCHours();
  let minute = date.getUTCMinutes();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getUTCDay()];

  if (hour < 10) hour = `0${hour}`;
  if (minute < 10) minute = `0${minute}`;

  return `${day} ${hour}:${minute}`;
}

function displayCity(city) {
  let apiKey = "d1193959d2d841ec7555416d715716a6";
  let currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(currentApiUrl).then(showElement);
  axios.get(forecastApiUrl).then(showForecastElement);
}

function searchForCity(event) {
  event.preventDefault();

  let searchInput = document.querySelector("#search-form-input");

  displayCity(searchInput.value);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchForCity);

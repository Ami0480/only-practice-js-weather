function showElement(response) {
  console.log(response.data);
  let searchCity = document.querySelector("#city");
  let temperatureElement = document.querySelector("#current-temperature");

  searchCity.innerHTML = response.data.name;
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
}

function displayCity(city) {
  let apiKey = "d1193959d2d841ec7555416d715716a6";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showElement);
}

function searchForCity(event) {
  event.preventDefault();

  let searchInput = document.querySelector("#search-form-input");

  displayCity(searchInput.value);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchForCity);

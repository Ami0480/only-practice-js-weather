function searchForCity(event) {
  event.preventDefault();

  let searchInput = document.querySelector("#search-form-input");
  let searchCity = document.querySelector("#city");

  searchCity.innerHTML = searchInput.value;
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchForCity);

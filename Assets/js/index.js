const cityInputEl = document.querySelector(".city-input");
const currentWeatherEl = document.querySelector(".current-weather");
const searchButtonEl = document.querySelector(".search-btn");
const weatherCardsEl = document.querySelector(".weather-cards");
const apiKey = "d4fd8c7fddfd9cd49b2db54c19abc24a";
const searchHistory = document.getElementById("search-history");

const createWeatherCard = (city, weatherItem, index) => {
 if (index === 0) {
  return `<div class="details">
            <h2>${city} (${weatherItem.dt_txt.split(" ")[0]})</h2>
            <p>Temperature: ${weatherItem.main.temp.toFixed(2)}°F</p>
            <p>Wind: ${weatherItem.wind.speed} MPH</p>
            <p>Humidity: ${weatherItem.main.humidity}%</p>
            </div>
            <div class="icon">
            <img src="https://openweathermap.org/img/wn/${
             weatherItem.weather[0].icon
            }@4x.png" alt="weather-icon">
            <p>${weatherItem.weather[0].description}</p>
        </div>`;
 } else {
  return `<li class="card">
        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${
         weatherItem.weather[0].icon
        }@4x.png" alt="weather-icon">
            <p>Temp: ${weatherItem.main.temp.toFixed(2)}°F</p>
            <p>Wind: ${weatherItem.wind.speed} MPH</p>
            <p>Humidity: ${weatherItem.main.humidity}%</p>
        </li>`;
 }
};

const getWeatherDetails = (city, lat, lon) => {
 const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
 fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
   const forecastDays = [];
   const fiveDaysForecast = data.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!forecastDays.includes(forecastDate)) {
     return forecastDays.push(forecastDate);
    }
   });
   cityInputEl.value = "";
   currentWeatherEl.innerHTML = "";
   weatherCardsEl.innerHTML = "";
   fiveDaysForecast.forEach((weatherItem, index) => {
    const html = createWeatherCard(city, weatherItem, index);
    if (index === 0) {
     currentWeatherEl.insertAdjacentHTML("beforeend", html);
    } else {
     weatherCardsEl.insertAdjacentHTML("beforeend", html);
    }
   });
  });
};

const getCityCoordinates = (city = cityInputEl.value.trim()) => {
 if (city === "") return;
 const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
 fetch(API_URL)
  .then((response) => response.json())
  .then((data) => {
   const lat = data.coord.lat;
   const name = data.name;
   const lon = data.coord.lon;
   getWeatherDetails(name, lat, lon);
   addToHistory(city);
  })
  .catch(() => {
   alert("Please put in a real city name!");
  });
};

const addToHistory = (city) => {
 let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
 if (!history.includes(city)) {
  history.push(city);
  localStorage.setItem("searchHistory", JSON.stringify(history));
  displayHistory();
 }
};

const displayHistory = () => {
 const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
 const historyHtml = history
  .map(
   (city) => `
                <li class="history-item">
                    <button class="history-button" onclick="fetchWeatherForCity('${city}')">${city}</button>
                </li>
            `
  )
  .join("");
 document.getElementById("search-history").innerHTML = historyHtml;
};

const fetchWeatherForCity = (city) => {
 getCityCoordinates(city);
};

document.addEventListener("DOMContentLoaded", displayHistory());

searchButtonEl.addEventListener("click", () => {
 getCityCoordinates();
});
cityInputEl.addEventListener(
 "keyup",
 (e) => e.key === "Enter" && getCityCoordinates()
);

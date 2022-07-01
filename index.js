import { AccessKey, RapidAPIKey } from "./env.js";

// AccessKey is the Unsplash Access Key
// RapidAPIKey is the Rapid API Key.

async function weatherApi(city) {
  const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${city}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": RapidAPIKey,
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  const resp = await fetch(url, options);
  const json = resp.json();
  return json;
}

const citySearch = document.querySelector(".city-search");
citySearch.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(citySearch);

  let city;
  // loop through form data to get the name and value.
  // _ is the key which is name
  // v is the value which the value of the input.
  for (const [_, v] of formData) {
    city = v.toLocaleLowerCase();
  }

  updateWeather(city);
});

async function updateWeather(city = "hong kong") {
  const weatherReport = document.querySelector(".weather-report");
  const myCity = document.querySelector(".city");
  const myCountry = document.querySelector(".country");

  const weatherData = await weatherApi(city);
  const { name: cityName, region, country, lat, lon } = weatherData["location"];
  const { condition, feelslike_c, humidity, temp_c, uv, last_updated, is_day } =
    weatherData["current"];

  myCity.textContent = cityName;
  myCountry.textContent = country;

  currentWeatherIcon(condition["icon"], condition["text"]);
  detailReport(feelslike_c, humidity, temp_c, condition["text"]);
  unsplashPhotosBackgroundImage(condition["text"], "regular");
  date();

  console.log(weatherData);
}

updateWeather();

function currentWeatherIcon(iconSrc, text) {
  const weatherIcon = document.querySelector(".current-city-weather-icon");
  weatherIcon.src = iconSrc;
  weatherIcon.alt = text;
}

function detailReport(feelslike_c, humidity, temp_c, text) {
  const currentTemp = document.querySelector(".current-temp");
  const feelsLike = document.querySelector(".current-feels-like");
  const humid = document.querySelector(".current-humidity");
  const description = document.querySelector(".weather-description");

  currentTemp.textContent = `${temp_c} ℃`;
  feelsLike.textContent = `${feelslike_c} ℃`;
  humid.textContent = `${humidity}%`;
  description.textContent = `${text}`;
}

async function unsplashPhotosBackgroundImage(
  keyword = "weather",
  sizeOption = "regular" // options: "raw" || "small" || "small_s3" || "thumb"
) {
  const url = `https://api.unsplash.com/search/photos?query=${
    keyword + " weather"
  }&orientation=landscape&client_id=${AccessKey}`;

  console.log(url);

  const resp = await fetch(url);
  // payload return unsplash json data, inside results it has an array with 10 objects.
  const { results } = await resp.json();

  // random number between 0 - 10
  let randIdx = Math.floor(Math.random(11));

  let imageUrl = results[randIdx].urls[sizeOption];

  document.body.style.backgroundImage = `url(${imageUrl})`;
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
  document.body.style.transition = "background-image 1s";
}

function clock() {
  const date = new Date();
  let hr = date.getHours();
  let mins = date.getMinutes();
  let secs = date.getSeconds();

  const currentTime = document.querySelector(".current-time");
  currentTime.textContent = `${hr}: ${mins < 10 ? "0" + mins : mins}: ${
    secs < 10 ? "0" + secs : secs
  }`;

  setInterval(clock, 1000);
}

function date() {
  const date = new Date().toLocaleDateString();
  const currentDate = document.querySelector(".current-date");
  currentDate.textContent = date;
}

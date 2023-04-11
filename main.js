"use strict";
const inputSearch = document.querySelector(".search_input");
const btnSearch = document.querySelector(".search_icon");
const locationDiv = document.querySelector(".location");
const locationName = document.querySelector(".location_name");
const currentTemperature = document.querySelector(".temperature_value");
const currentTemperatureUnits = document.querySelector(".temperature_units");
const weatherDescription = document.querySelector(".weather_code");
const currDayImg = document.querySelector(".img_main");
const otherValuesDiv = document.querySelector(".other_values");
const windValue = document.querySelector(".wind_value");
const rainValue = document.querySelector(".rain_value");
const daysDiv = document.querySelector(".days");
const day1Name = document.querySelector(".day1_name");
const day2Name = document.querySelector(".day2_name");
const day3Name = document.querySelector(".day3_name");
const day1Img = document.querySelector(".day1_img");
const day2Img = document.querySelector(".day2_img");
const day3Img = document.querySelector(".day3_img");

const geolocation = () => {
  const geoLink = `https://geocoding-api.open-meteo.com/v1/search?name=${inputSearch.value}&language=en&count=10&format=json`;
  return geoLink;
};

const weatherCodes = (code, dayImg) => {
  if (code >= 0 && code < 1) {
    weatherDescription.textContent = "Clear sky";
    dayImg.setAttribute("src", "./img/clear_sky.png");
  } else if (code >= 1 && code < 40) {
    weatherDescription.textContent = "Mainly clear";
    dayImg.setAttribute("src", "./img/mainly_clear.png");
  } else if (code >= 40 && code < 49) {
    weatherDescription.textContent = "Fog";
    dayImg.setAttribute("src", "./img/fog.png");
  } else if (code >= 50 && code <= 55) {
    weatherDescription.textContent = "Drizzle";
    dayImg.setAttribute("src", "./img/drizzle.png");
  } else if (code >= 56 && code < 60) {
    weatherDescription.textContent = "Freezing drizzle";
    dayImg.setAttribute("src", "./img/freezing_drizzle.png");
  } else if (code >= 61 && code <= 65) {
    weatherDescription.textContent = "Rain";
    dayImg.setAttribute("src", "./img/rain.png");
  } else if (code >= 66 && code <= 70) {
    weatherDescription.textContent = "Freezing rain";
    dayImg.setAttribute("src", "./img/freezing_rain.png");
  } else if (code >= 71 && code <= 75) {
    weatherDescription.textContent = "Snow fall";
    dayImg.setAttribute("src", "./img/snow_fall.png");
  } else if (code === 77) {
    weatherDescription.textContent = "Snow grains";
    dayImg.setAttribute("src", "./img/snow_grains.png");
  } else if (code >= 80 && code <= 82) {
    weatherDescription.textContent = "Rain showers";
    dayImg.setAttribute("src", "./img/rain_showers.png");
  } else if (code >= 85 && code <= 86) {
    weatherDescription.textContent = "Snow showers";
    dayImg.setAttribute("src", "./img/snow_showers.png");
  } else if (code === 95) {
    weatherDescription.textContent = "Thunderstorm";
    dayImg.setAttribute("src", "./img/thunderstorm.png");
  } else if (code >= 96) {
    weatherDescription.textContent = "Thunderstorm with hail";
    dayImg.setAttribute("src", "./img/thunderstorm_hail.png");
  }
};

const setDayName = function (dateNumber, locale = "en-EN") {
  const date = new Date(dateNumber);
  return date.toLocaleDateString(locale, { weekday: "short" }).toUpperCase();
};

const dayTime = function (time) {
  document.body.classList.remove("body_night");
  if (time === 0) {
    currDayImg.setAttribute("src", "./img/moon.png");
    weatherDescription.textContent = "Night";
    document.body.classList.add("body_night");
  }
};

const inputValidation = () => {
  const inputLetters = /^[A-Za-z \s*]+$/;
  if (inputSearch.value.match(inputLetters)) {
    getWeather();
  } else {
    errorMessage();
  }
};

const getWeather = async function () {
  try {
    let API_GEO = geolocation();
    const resGeo = await fetch(API_GEO);
    const dataGeo = await resGeo.json();
    const latitude = dataGeo.results[0].latitude;
    const longitude = dataGeo.results[0].longitude;
    const API_LINK = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,rain_sum&timezone=GMT&forecast_days=4&current_weather=true&is_day`;
    const resWeather = await fetch(API_LINK);
    const dataWeather = await resWeather.json();
    const currWeatherCode = dataWeather.current_weather.weathercode;
    const day1Full = dataWeather.daily.time[1];
    const day2Full = dataWeather.daily.time[2];
    const day3Full = dataWeather.daily.time[3];
    const day1Code = dataWeather.daily.weathercode[1];
    const day2Code = dataWeather.daily.weathercode[2];
    const day3Code = dataWeather.daily.weathercode[3];
    const locationNameArr = inputSearch.value.split(" ");
    const locationNameUpper = locationNameArr
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join(" ");

    locationDiv.style.display = "flex";
    locationName.textContent = locationNameUpper;
    inputSearch.value = "";
    currentTemperatureUnits.style.display = "block";
    currentTemperature.textContent = `${dataWeather.current_weather.temperature}`;
    otherValuesDiv.style.display = "flex";
    windValue.textContent = `${dataWeather.current_weather.windspeed}`;
    rainValue.textContent = `${dataWeather.daily.rain_sum[0]}`;
    daysDiv.style.display = "flex";
    day1Name.textContent = setDayName(day1Full);
    day2Name.textContent = setDayName(day2Full);
    day3Name.textContent = setDayName(day3Full);

    weatherCodes(day1Code, day1Img);
    weatherCodes(day2Code, day2Img);
    weatherCodes(day3Code, day3Img);
    weatherCodes(currWeatherCode, currDayImg);
    dayTime(dataWeather.current_weather.is_day);
  } catch (error) {
    errorMessage();
  }
};

const errorMessage = () => {
  weatherDescription.textContent = "";
  locationDiv.style.display = "none";
  currentTemperatureUnits.style.display = "none";
  otherValuesDiv.style.display = "none";
  daysDiv.style.display = "none";
  currentTemperature.textContent = "";
  currDayImg.setAttribute("src", "./img/default_location.png");
  weatherDescription.style.textAlign = "center";
  weatherDescription.textContent = `We couldn't find "${inputSearch.value}". Please try again`;
  inputSearch.value = "";
};

btnSearch.addEventListener("click", inputValidation);
inputSearch.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    inputValidation();
  }
});

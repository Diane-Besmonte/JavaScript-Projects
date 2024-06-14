const date = document.getElementById("date");
const time = document.getElementById("time");

// Getting and display time and date
const newdate = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

date.innerText = newdate.toLocaleDateString("en-US", options);
time.innerText = newdate.toLocaleTimeString(undefined, { timeStyle: "short" });

// Toggle switch between dark and light mode and save it to browser
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("theme-toggle");
  const body = document.body;

  const lightModeSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 21.3333C14.5147 21.3333 13.2547 20.816 12.22 19.7813C11.1844 18.7449 10.6667 17.4844 10.6667 16C10.6667 14.5156 11.1844 13.2556 12.22 12.22C13.2556 11.1844 14.5156 10.6667 16 10.6667C17.4844 10.6667 18.7449 11.1844 19.7813 12.22C20.8178 13.2556 21.3351 14.5156 21.3333 16C21.3316 17.4844 20.8142 18.7449 19.7813 19.7813C18.7484 20.8178 17.488 21.3351 16 21.3333ZM6.66667 16.6667H2V15.3333H6.66667V16.6667ZM30 16.6667H25.3333V15.3333H30V16.6667ZM15.3333 6.66667V2H16.6667V6.66667H15.3333ZM15.3333 30V25.3333H16.6667V30H15.3333ZM8.99467 9.872L6.11467 7.07467L7.04133 6.08133L9.856 8.928L8.99467 9.872ZM24.96 25.9187L22.1373 23.064L23.0067 22.128L25.8867 24.9253L24.96 25.9187ZM22.128 8.99333L24.9253 6.11333L25.9187 7.04L23.072 9.85467L22.128 8.99333ZM6.08267 24.96L8.936 22.1373L9.82133 23.0067L7.048 25.912L6.08267 24.96Z" fill="#CEE8FF"/>
    </svg>`;

  const darkModeSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 28C12.6667 28 9.83333 26.8333 7.5 24.5C5.16667 22.1667 4 19.3333 4 16C4 12.6667 5.16667 9.83333 7.5 7.5C9.83333 5.16667 12.6667 4 16 4C16.3111 4 16.6169 4.01111 16.9173 4.03333C17.2178 4.05556 17.512 4.08889 17.8 4.13333C16.8889 4.77778 16.1609 5.61689 15.616 6.65067C15.0711 7.68444 14.7991 8.80089 14.8 10C14.8 12 15.5 13.7 16.9 15.1C18.3 16.5 20 17.2 22 17.2C23.2222 17.2 24.3444 16.9276 25.3667 16.3827C26.3889 15.8378 27.2222 15.1102 27.8667 14.2C27.9111 14.4889 27.9444 14.7831 27.9667 15.0827C27.9889 15.3822 28 15.688 28 16C28 19.3333 26.8333 22.1667 24.5 24.5C22.1667 26.8333 19.3333 28 16 28Z" fill="#0F1C2E"/>
    </svg>`;

  const applyTheme = (theme) => {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      body.classList.remove("light-mode");
      toggleButton.innerHTML = lightModeSvg;
    } else {
      body.classList.add("light-mode");
      body.classList.remove("dark-mode");
      toggleButton.innerHTML = darkModeSvg;
    }
  };

  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);

  toggleButton.addEventListener("click", () => {
    const currentTheme = body.classList.contains("dark-mode")
      ? "dark"
      : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });
});

// Gretings animation
const text = "Good Day!";
const typingElement = document.getElementById("greeting");

let index = 0;

const typing = () => {
  if (index < text.length) {
    typingElement.textContent += text.charAt(index);
    index++;
    setTimeout(typing, 150);
  }
};

typing();

// Weather API
const API_KEY = "ee994f426a059b88b743eeded6e344d8";

getWeatherData = async (location) => {
  const URL = "https://api.openweathermap.org/data/2.5/weather";
  const FULL_URL = `${URL}?q=${location}&appid=${API_KEY}&units=imp`;

  try {
    const response = await fetch(FULL_URL);
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error("Something went wrong", error);
  }
};

const searchLocation = () => {
  const loc = document.getElementById("search-input").value;
  console.log("clicked me!");
  getWeatherData(loc)
    .then((response) => {
      showWeatherData(response);
    })
    .catch((error) => console.error("Something went wrong", error));
};

// So have other option to enter the location by hitting "enter" key aside from search button
const userInput = document.getElementById("search-input");
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchLocation();
  }
});

const showWeatherData = (data) => {
  console.log(data);
  const sunriseTs = new Date(data.sys.sunrise * 1000);
  const sunsetTs = new Date(data.sys.sunset * 1000);

  document.querySelector(".name").innerText = data.name;
  document.querySelector(
    "#weatherIcon"
  ).src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  document.querySelector("#main-temp").innerText = `${data.main.temp.toFixed(
    2
  )}˚`;
  document.querySelector("#stat").innerText = data.weather[0].main;
  document.querySelector("#wind-stat").innerText = `${data.wind.speed} mph`;
  document.querySelector(
    "#temp-stat"
  ).innerText = `${data.main.temp_min}˚ / ${data.main.temp_max}˚`;
  document.querySelector("#sunrise-time").innerText =
    sunriseTs.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  document.querySelector("#sunset-time").innerText =
    sunsetTs.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  document.querySelector("#pressure").innerText = `${data.main.pressure} hpa`;
  document.querySelector("#humidity").innerText = `${data.main.humidity}%`;
};

const currentDate = new Date();
const thisYear = currentDate.getFullYear();

const footer = document.createElement("footer");
const copyright = document.createElement("p");
copyright.classList.add("footer-credit");
copyright.innerHTML = `<small>All data from <a href="https://api.openweathermap.org" target="_blank">api.openweathermap.org</a> &copy; ${thisYear}</small>`;
footer.appendChild(copyright);
document.body.appendChild(footer);

const countryCode = "US";
const APIkey = "529f4176d252c087860f9ac02cb0e267";
const baseUrl = 'http://api.openweathermap.org'
const nameSection = document.getElementById("location");
const tempValue = document.getElementById("tempValue");
const tempUnit = document.getElementById("tempUnit");
const weather = document.getElementById("weatherDesc");
const pressure = document.getElementById("pressure");
const geoCords = document.getElementById("geo");
const wind = document.getElementById("wind");

const getZipCode = () => {
    return document.getElementById("zipcode").value;
};

function validateZipCode(zipCode) {
    return zipCode.length === 5 && /^\d+$/.test(zipCode);
}

function createWeatherIcon(iconCode) {
    const iconElement = document.createElement("img");
    iconElement.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconElement.width = 50;
    iconElement.height = 50;
    return iconElement;
}

const fetchData = () => {
    let zipCode = getZipCode();
    const zipCodeUrl = baseUrl + `/geo/1.0/zip?zip=${zipCode},${countryCode}&appid=${APIkey}`;

    if (validateZipCode(zipCode)) {
        fetch(zipCodeUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching location data');
                }
                return response.json();
            })
            .then(data => {
                const name = data.name;
                const lat = data.lat;
                const lon = data.lon;
                const weatherUrl = baseUrl + `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;

                geoCords.textContent = "Geo coords: [" + data.lat + ", " + data.lon + "]";
                geoCords.classList.add("geo");

                fetch(weatherUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error fetching weather data');
                        }
                        return response.json();
                    })
                    .then(weatherData => {
                        const tempKelvin = weatherData.main.temp;
                        const tempFahrenheit = (tempKelvin - 273.15) * 9 / 5 + 32;

                        tempValue.textContent = tempFahrenheit.toFixed(2);
                        if (tempFahrenheit) {
                            tempUnit.style.display = "inline";
                        } else {
                            tempUnit.style.display = "none";
                        }

                        nameSection.classList.remove("error-message");
                        nameSection.textContent = name;
                        nameSection.classList.add("city");

                        const weatherIconCode = weatherData.weather[0].icon;
                        const weatherIconElement = createWeatherIcon(weatherIconCode);

                        weather.textContent = weatherData.weather[0].description;
                        weather.classList.add("weather");
                        weather.appendChild(weatherIconElement);

                        pressure.textContent = "Pressure: " + weatherData.main.pressure +
                            " hpa,  Humidity: " + weatherData.main.humidity + "%";
                        pressure.classList.add("geo");
                        wind.textContent = "Wind: " + weatherData.wind.speed + " m/s"
                        wind.classList.add("geo");
                    })
                    .catch(error => {
                        console.error("Error fetching weather data:", error)
                        tempValue.textContent = "";
                        tempUnit.style.display = "none";
                        nameSection.textContent = "An error occurred while fetching weather data. Please try again later.";
                        nameSection.classList.add("error-message");
                    });
            })
            .catch(error => {
                console.warn("Error fetching location data:", error)
                nameSection.textContent = 'Location not found. Please try a different zip code.';
                nameSection.classList.add("error-message");
                nameSection.classList.remove("city");
                clearInfo();
            });
    }
}

const handleZipCodeInput = () => {
    let zipCode = getZipCode();

    if (validateZipCode(zipCode)) {
        fetchData();
    } else if (zipCode === "") {
        nameSection.textContent = "";
        clearInfo()
    } else {
        nameSection.textContent = 'Please enter a valid 5-digit zip code';
        nameSection.classList.add("error-message");
        nameSection.classList.remove("city");
        clearInfo();
    }
};

const clearInfo = () => {
    tempValue.textContent = "";
    tempUnit.style.display = "none";
    weather.textContent = "";
    pressure.textContent = "";
    geoCords.textContent = "";
    wind.textContent = "";
};

document.getElementById("zipcode").addEventListener("input", handleZipCodeInput)
document.getElementById("zipcode").addEventListener("change", handleZipCodeInput);
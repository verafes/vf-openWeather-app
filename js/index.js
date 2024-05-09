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

const getZipCode = () => {
    return document.getElementById("zipcode").value;
};
function validateZipCode(zipCode) {
    return zipCode.length === 5 && /^\d+$/.test(zipCode);
}

const fetchData = () =>  {
    const zipCode = getZipCode();
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
                console.log(name, lat, lon)
                const weatherUrl = baseUrl + `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;

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

                    })
                    .catch(error => console.error('Error fetching weather data:', error));
                tempValue.textContent = "";
                tempUnit.style.display = "none";
                nameSection.textContent = 'Error fetching weather data';
                nameSection.classList.add("error-message");
            })
            .catch(error => console.error('Error fetching location data:', error));
            nameSection.textContent = 'Error fetching location data';
            nameSection.classList.add("error-message");
    }
}

const handleZipCodeInput = () => {
    const zipCode = getZipCode();

    if (validateZipCode(zipCode)) {
        fetchData();
    } else if (zipCode === "") {
        nameSection.textContent = "";
        tempValue.textContent = "";
        tempUnit.style.display = "none";
    } else {
        nameSection.textContent = 'Please enter a valid 5-digit zip code';
        nameSection.classList.add("error-message");
        tempValue.textContent = "";
        tempUnit.style.display = "none";
    }
};

document.getElementById("zipcode").addEventListener("input", handleZipCodeInput)
document.getElementById("zipcode").addEventListener("change", handleZipCodeInput);
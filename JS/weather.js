// entire thing was so massivley re-written after looking at a previous work example of another student a year ago, +rep to that dude!

document.addEventListener("DOMContentLoaded", function () {
    // select html elements for weather information and other things such as sun/moon and morreeee
    const weatherInfo = document.getElementById("weather-info");
    const sun = document.getElementById("sun");
    const moon = document.getElementById("moon");
    const lightOverlay = document.getElementById("light-overlay");
    const rainContainer = document.getElementById("rain-container");
    const snowContainer = document.getElementById("snow-container");
//    const cloudsContainer = document.getElementById("clouds-container"); // not fully implemented
    
    // variables tyo track weather conditions
    let isSnowing = false;
    let isRaining = false;
    let isCloudy = false;

    // functions to fetch weather data using geolocation
    function fetchWeatherData() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    // openweather API request URL 
                    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=9b283e1a9cd6408eed35628558e72f90`;

                    // fetches Weather data and updates the UI with the corresponding information
                    fetch(apiUrl)
                        .then(response => response.json())
                        .then(data => updateWeather(data))
                        .catch(error => console.error("Weather API Error:", error));
                },
                (error) => console.error("Geolocation Error:", error)
            );
        } else {
            console.error("Geolocation is not supported.");
        }
    }

    // ui updated basing information of fetched weather data
    function updateWeather(data) {
        const temperature = (data.main.temp - 273.15).toFixed(1); // Convert Kelvin to Celsius
        const weatherType = data.weather[0].main;
        const windSpeed = data.wind.speed; // windspeed used is meters per second cause ísland...
        const sunrise = data.sys.sunrise; // sunrise and sunset time is bricked...
        const sunset = data.sys.sunset;
        const currentTime = Math.floor(Date.now() / 1000);

        // Handle Rain/Snow/and everything else i need to add
        isSnowing = weatherType === "Snow";
        isRaining = weatherType === "Rain" || weatherType === "Mist";
        isCloudy = weatherType === "Clouds";

        // Select Kid SVG elements
        const kidsRain = document.getElementById("kids_rain");
        const kidsSnow = document.getElementById("kids_snow");
        const kidsCloud = document.getElementById("kids_cloud");

        
        // Toggle visibility based on weather info
        if (isRaining) {
            kidsRain.style.display = "block";
            kidsSnow.style.display = "none";
            kidsCloud.style.display = "none";
        } else if (isSnowing) {
            kidsRain.style.display = "none";
            kidsSnow.style.display = "block";
            kidsCloud.style.display = "none";
        } else if (isCloudy) {
            kidsRain.style.display = "none";
            kidsSnow.style.display = "none";
            kidsCloud.style.display = "block";
        } else {
            kidsRain.style.display = "none";
            kidsCloud.style.display = "none";
            kidsSnow.style.display = "none"; // Hide both if no rain or snow
        }


        // Update UI
        weatherInfo.innerHTML = `
            <div>🌡️ Temperature: ${temperature}°C</div>
            <div>💨 Wind: ${windSpeed} m/s</div>
            <div>🌦️ Weather: ${weatherType}</div>
        `;

        // Determine Sun/Moon position
        let dayProgress = (currentTime - sunrise) / (sunset - sunrise);
        dayProgress = Math.max(0, Math.min(1, dayProgress)); // Keep within 0-1 range

        let sunX = dayProgress * window.innerWidth;
        let sunY = Math.sin(dayProgress * Math.PI) * -200 + 250;
        let moonX = ((dayProgress + 0.5) % 1) * window.innerWidth;
        let moonY = Math.sin(((dayProgress + 0.5) % 1) * Math.PI) * -200 + 250;

        sun.style.left = `${sunX}px`;
        sun.style.top = `${sunY}px`;
        moon.style.left = `${moonX}px`;
        moon.style.top = `${moonY}px`;

        // Update brightness
        // oh yeah, if only it worked better than it does, calculates the sun and moon position based on time of day
        let brightness = 1 - Math.abs(0.5 - dayProgress) * 2;
        lightOverlay.style.background = `radial-gradient(circle, rgba(255, 255, 200, ${brightness * 0.4}), rgba(0, 0, 0, ${1 - brightness}))`;


        rainContainer.style.display = isRaining ? "block" : "none";
        snowContainer.style.display = isSnowing ? "block" : "none";
        cloudsContainer.style.display = isCloudy ? "block" : "none";
    }
    // this thing is supposed to properly animate the sun and moon movement, but does it? fuck no....
    function updateCycle(sunrise, sunset, moonrise, moonset) {
        let now = new Date();
        let hours = now.getHours() + now.getMinutes() / 60;
    
        let sun = document.getElementById("sun");
        let moon = document.getElementById("moon");
    
        if (!sun || !moon) {
            console.error("Sun or Moon elements not found!");
            return;
        }
    
        let screenWidth = window.innerWidth;
        let screenHeight = window.innerHeight;
    
        // 🌞 Sun movement: Only visible between sunrise & sunset
        if (hours >= sunrise && hours < sunset) {
            let sunX = ((hours - sunrise) / (sunset - sunrise)) * screenWidth;
            let sunY = Math.sin(((hours - sunrise) / (sunset - sunrise)) * Math.PI) * -screenHeight / 3 + screenHeight / 2;
            sun.style.left = `${sunX}px`;
            sun.style.top = `${sunY}px`;
            sun.style.display = "block";
        } else {
            sun.style.display = "none"; // Hide Sun at night
        }
    
        // 🌙 Moon movement: Only visible between moonrise & moonset
        if (hours >= moonrise && hours < moonset) {
            let moonX = ((hours - moonrise) / (moonset - moonrise)) * screenWidth;
            let moonY = Math.sin(((hours - moonrise) / (moonset - moonrise)) * Math.PI) * -screenHeight / 3 + screenHeight / 2;
            moon.style.left = `${moonX}px`;
            moon.style.top = `${moonY}px`;
            moon.style.display = "block";
        } else {
            moon.style.display = "none"; // Hide Moon in the daytime
        }
    
        requestAnimationFrame(() => updateCycle(sunrise, sunset, moonrise, moonset));
    }
    
    
    // ✅ Start when the page loads
    updateCycle();
    
    
    

    function createWeatherEffect(container, className) {
        const particle = document.createElement("div");
        particle.classList.add(className);
        particle.style.left = `${Math.random() * 100}vw`;
        container.appendChild(particle);

        particle.animate(
            [
                { transform: "translateY(0)" },
                { transform: "translateY(100vh)" }
            ],
            {
                duration: Math.random() * 1500 + (isSnowing ? 1000 : 500),
                easing: "linear"
            }
        ).onfinish = () => particle.remove();
    }

    setInterval(() => {
        if (isRaining) createWeatherEffect(rainContainer, "raindrop");
        if (isSnowing) createWeatherEffect(snowContainer, "snowflake");
        if (isCloudy) createWeatherEffect(cloudsContainer, "cloud");
    }, 50);

    fetchWeatherData();
    setInterval(fetchWeatherData, 10 * 60 * 1000); // Update every 10 minutes
});

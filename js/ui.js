/**
 * Updates the page with weather data
 * @param {Object} weatherData - Data from OpenWeatherMap API
 */
export function displayWeather(weatherData) {
    // Extract data from API response
    const cityName = weatherData.name;
    const temperature = Math.round(weatherData.main.temp);
    const feelsLike = Math.round(weatherData.main.feels_like);
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const condition = weatherData.weather[0].description;
    const iconCode = weatherData.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    // Update DOM elements
    document.getElementById('city-name').textContent = cityName;
    document.getElementById('temperature').textContent = `${temperature}°C`;
    document.getElementById('feels-like').textContent = `${feelsLike}°C`;
    document.getElementById('humidity').textContent = `${humidity}%`;
    document.getElementById('wind-speed').textContent = `${windSpeed} m/s`;
    document.getElementById('condition-description').textContent = condition;
    
    // Update weather icon
    const iconElement = document.getElementById('weather-icon');
    iconElement.src = iconUrl;
    iconElement.alt = `${condition} icon`;
    
    // Show the weather section (hidden until now)
    const weatherSection = document.getElementById('weather-result');
    weatherSection.hidden = false;
    
    // Hide any previous error messages
    hideError();
}

/**
 * Shows error message to user
 * @param {string} message - Error message to display
 */
export function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.hidden = false;
    
    // Hide weather section if it was showing
    document.getElementById('weather-result').hidden = true;
}

/**
 * Hides error message
 */
export function hideError() {
    const errorDiv = document.getElementById('error-message');
    errorDiv.hidden = true;
}

/**
 * Shows loading state while fetching
 */
export function showLoading() {
    const weatherSection = document.getElementById('weather-result');
    weatherSection.hidden = true;
    hideError();
    // Could add a loading spinner here
}
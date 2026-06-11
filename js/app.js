import { fetchWeather } from './api.js';
import { displayWeather, showError, showLoading } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent page refresh
        
        const city = cityInput.value.trim();
        
        if (!city) {
            showError('Please enter a city name');
            return;
        }
        
        showLoading();
        
        try {
            const weatherData = await fetchWeather(city);
            displayWeather(weatherData);
        } catch (error) {
            showError(error.message);
        }
    });
});
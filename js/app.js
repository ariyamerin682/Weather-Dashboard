import { fetchWeather } from './api.js';
import { displayWeather, showLoading, showError, showEmptyState, initMap } from './ui.js';

console.log('App loaded - all imports successful!');

const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const resultDiv = document.getElementById('weather-result');
const dashboardPanel = document.getElementById('dashboard-panel');
const toggleDashboardButton = document.getElementById('toggle-dashboard');

function hideDashboard() {
    if (dashboardPanel) {
        dashboardPanel.classList.add('hidden');
    }
    if (toggleDashboardButton) {
        toggleDashboardButton.hidden = false;
    }
    document.body.classList.add('map-only');
}

function showDashboard() {
    if (dashboardPanel) {
        dashboardPanel.classList.remove('hidden');
    }
    if (toggleDashboardButton) {
        toggleDashboardButton.hidden = true;
    }
    document.body.classList.remove('map-only');
}

function saveRecentCity(city) {
    const recent = JSON.parse(localStorage.getItem('recentCities') || '[]')
        .filter((savedCity) => savedCity.toLowerCase() !== city.toLowerCase());

    recent.unshift(city);
    if (recent.length > 5) {
        recent.pop();
    }

    localStorage.setItem('recentCities', JSON.stringify(recent));
}

function showValidationError() {
    cityInput.style.borderColor = '#fc8181';
    cityInput.focus();

    let errorDiv = document.querySelector('.input-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'input-error';
        errorDiv.style.cssText = 'color: #c53030; font-size: 14px; margin-top: 5px;';
        cityInput.parentNode.insertBefore(errorDiv, cityInput.nextSibling);
    }

    errorDiv.textContent = '⚠️ Please enter a city name';
    errorDiv.style.display = 'block';

    if (resultDiv) {
        showEmptyState(resultDiv);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready, initializing map...');
    initMap();

    if (resultDiv) {
        showEmptyState(resultDiv);
    }

    if (cityInput) {
        cityInput.focus();
    }

    if (toggleDashboardButton) {
        toggleDashboardButton.addEventListener('click', () => {
            showDashboard();
            if (cityInput) {
                cityInput.focus();
            }
        });
    }

    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get('city');
    if (cityParam && form && cityInput) {
        cityInput.value = cityParam;
        form.dispatchEvent(new Event('submit'));
    }
});

if (cityInput && form) {
    cityInput.addEventListener('input', () => {
        if (cityInput.value.trim().length > 0) {
            cityInput.style.borderColor = '#ddd';
            const errorDiv = document.querySelector('.input-error');
            if (errorDiv) {
                errorDiv.remove();
            }
        }
    });

    cityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const city = cityInput.value.trim();
        console.log('Searching for:', city);

        if (!city) {
            showValidationError();
            return;
        }

        cityInput.style.borderColor = '#ddd';
        const errorDiv = document.querySelector('.input-error');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }

        if (resultDiv) {
            showLoading(resultDiv);
        }

        try {
            const weatherData = await fetchWeather(city);

            if (resultDiv) {
                displayWeather(weatherData, resultDiv);
            }

            saveRecentCity(city);
            window.history.pushState({ city }, '', `?city=${encodeURIComponent(city)}`);
        } catch (error) {
            console.error('Error in form submit:', error);
            if (resultDiv) {
                showError(resultDiv, Object.assign(error, { city }));
            }
        }
    });
}

document.addEventListener('click', (event) => {
    if (!dashboardPanel || !toggleDashboardButton) {
        return;
    }

    const clickedInsideDashboard = dashboardPanel.contains(event.target);
    const clickedToggleButton = toggleDashboardButton.contains(event.target);

    if (!clickedInsideDashboard && !clickedToggleButton) {
        hideDashboard();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && cityInput && resultDiv) {
        cityInput.value = '';
        cityInput.focus();
        showEmptyState(resultDiv);
    }
});

console.log('🚀 Weather Dashboard Ready!');
console.log('💡 Tips:');
console.log('  - Type a city name and press Enter');
console.log('  - Press ESC to clear the search');
console.log('  - Click suggestion chips in error states');

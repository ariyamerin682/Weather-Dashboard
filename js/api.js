
const API_KEY = '419f904644f31fd8feb98133c859472f';

export async function fetchWeather(city) {
    
    if (!city || city.trim().length === 0) {
        throw new Error('Please enter a valid city name');
    }
    
    // Clean the city name
    const cleanCity = city.trim().toLowerCase();
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cleanCity)}&appid=${API_KEY}&units=metric`;
    
    console.log('🌐 Fetching weather for:', cleanCity);
    
    try {
        const response = await fetch(url);
        
        // Handle different HTTP status codes
        if (!response.ok) {
            let errorMessage = '';
            
            switch (response.status) {
                case 400:
                    errorMessage = 'Bad request. Please check the city name.';
                    break;
                case 401:
                    errorMessage = 'Invalid API key. Please check your OpenWeatherMap API key.';
                    break;
                case 404:
                    errorMessage = `City "${city}" not found. Please check the spelling or try a different city.`;
                    break;
                case 429:
                    errorMessage = 'Too many requests. Please wait a moment and try again.';
                    break;
                case 500:
                    errorMessage = 'Weather service is temporarily unavailable. Please try again later.';
                    break;
                default:
                    errorMessage = `Server error (${response.status}). Please try again.`;
            }
            
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
       
        if (!data || !data.main || !data.weather) {
            throw new Error('Invalid weather data received');
        }
      
        return {
            name: data.name,
            country: data.sys?.country || '',
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            condition: data.weather[0].description,
            iconCode: data.weather[0].icon,
            lat: data.coord.lat,
            lon: data.coord.lon
        };
        
    } catch (error) {
        // Network errors
        if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
            throw new Error('Network error. Please check your internet connection.');
        }
        
        // Re-throw other errors
        console.error('API Error:', error);
        throw error;
    }
}

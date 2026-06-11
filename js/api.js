// MOCK API - No API key needed!
// This simulates what you'll get from the real API

export async function fetchWeather(city) {
    // Simulate network delay (like a real API)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fake data for demonstration
    const mockData = {
        'london': {
            name: 'London',
            main: { temp: 15, feels_like: 13, humidity: 72 },
            wind: { speed: 4.1 },
            weather: [{ description: 'overcast clouds', icon: '04d' }]
        },
        'tokyo': {
            name: 'Tokyo',
            main: { temp: 22, feels_like: 21, humidity: 65 },
            wind: { speed: 3.2 },
            weather: [{ description: 'clear sky', icon: '01d' }]
        },
        'new york': {
            name: 'New York',
            main: { temp: 18, feels_like: 17, humidity: 70 },
            wind: { speed: 5.5 },
            weather: [{ description: 'few clouds', icon: '02d' }]
        }
    };
    
    const cityKey = city.toLowerCase();
    
    if (mockData[cityKey]) {
        return mockData[cityKey];
    } else {
        throw new Error(`City "${city}" not found. Try: London, Tokyo, or New York`);
    }
}
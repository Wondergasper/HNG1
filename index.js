require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const IPINFO_API_KEY = process.env.IPINFO_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Route handler for the root URL
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API! Visit /api/hello to see weather and location data.' });
});

// Route handler for '/api/hello'
app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        // Use ipinfo.io for geolocation
        const geoUrl = `https://ipinfo.io/${clientIp}/json?token=${IPINFO_API_KEY}`;
        console.log(`Fetching geolocation from: ${geoUrl}`);
        const geoResponse = await axios.get(geoUrl);

        console.log('GeoResponse:', geoResponse.data);

        if (!geoResponse.data || !geoResponse.data.city) {
            console.error('Location information not found in geoResponse:', geoResponse.data);
            return res.status(404).json({ error: 'Location information not found' });
        }

        const location = geoResponse.data.city;
        console.log('Location found:', location);

        // Use WeatherAPI for weather data
        const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}`;
        console.log(`Fetching weather data from: ${weatherUrl}`);
        const weatherResponse = await axios.get(weatherUrl);

        console.log('WeatherResponse:', weatherResponse.data);

        if (!weatherResponse.data || !weatherResponse.data.current || weatherResponse.data.current.temp_c === undefined) {
            console.error('Weather information not found in weatherResponse:', weatherResponse.data);
            return res.status(404).json({ error: 'Weather information not found' });
        }

        const temperature = weatherResponse.data.current.temp_c;
        const greeting = `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`;

        console.log({
            client_ip: clientIp,
            location: location,
            greeting: greeting
        });

        res.json({
            client_ip: clientIp,
            location: location,
            greeting: greeting
        });
    } catch (error) {
        console.error('Server error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

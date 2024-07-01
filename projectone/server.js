const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.ip || req.connection.remoteAddress;
    
    try {
        // Get location data using ip-api.com
        const geoResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
        const location = geoResponse.data.city;

        // Get weather data using OpenWeatherMap
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`);
        const temperature = weatherResponse.data.main.temp;

        // Send response with client IP, location, and greeting
        res.json({
            client_ip: clientIp,
            location: location,
            greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

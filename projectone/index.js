const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        // Get location information using ip-api.com
        const geoResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
        
        if (geoResponse.status !== 200 || !geoResponse.data.city) {
            res.status(500).json({ error: 'Unable to fetch location information' });
            return;
        }

        const location = geoResponse.data.city || 'New York';

        // Get weather information using OpenWeatherMap
        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
        if (!apiKey) {
            res.status(500).json({ error: 'Missing OpenWeatherMap API key' });
            return;
        }

        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`);
        
        if (weatherResponse.status !== 200 || !weatherResponse.data.main || weatherResponse.data.main.temp === undefined) {
            res.status(500).json({ error: 'Unable to fetch weather information' });
            return;
        }

        const temperature = weatherResponse.data.main.temp;
        const greeting = `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`;

        res.json({
            client_ip: clientIp,
            location: location,
            greeting: greeting
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Unable to fetch location or weather information' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

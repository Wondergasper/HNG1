require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        console.log('Client IP:', clientIp);
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${process.env.WEATHER_API_KEY}&q=${clientIp}`);
        const data = response.data;

        if (data.location && data.location.name) {
            const location = data.location.name;
            const temperature = data.current.temp_c;

            res.json({
                client_ip: clientIp,
                location: location,
                greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}`
            });
        } else {
            res.status(500).json({ error: 'Location data not found in the API response' });
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

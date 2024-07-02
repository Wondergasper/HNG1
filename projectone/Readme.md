Weather Server API
This is a simple Express.js application that provides a weather greeting based on the user's IP address.

Features
Greets users by name (if provided) or as "Guest"
Retrieves the user's location and current temperature based on their IP address
Uses the WeatherAPI to fetch weather data
Prerequisites
Node.js
npm (Node Package Manager)
Installation
Clone this repository
Run npm install to install dependencies
Configuration
Create a .env file in the root directory
Add your WeatherAPI key to the .env file:
Usage
Start the server:

The server will run on http://localhost:3001 (or the port specified in your environment)

API Endpoint
GET /api/hello
Returns a greeting with the current weather for the user's location.

Query Parameters:

visitor_name (optional): The name of the visitor
Response:

{
"client_ip": "user's IP address",
"location": "user's location",
"greeting": "Hello, [name]! The temperature is [temp] degrees Celsius in [location]"
}
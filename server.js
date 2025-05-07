require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Weather icon mapping
const weatherIcons = {
  '01d': 'clear.png', '01n': 'clear.png',
  '02d': 'partly-cloudy.png', '02n': 'partly-cloudy.png',
  '03d': 'cloudy.png', '03n': 'cloudy.png',
  '04d': 'cloudy.png', '04n': 'cloudy.png',
  '09d': 'rain.png', '09n': 'rain.png',
  '10d': 'rain.png', '10n': 'rain.png',
  '11d': 'thunderstorm.png', '11n': 'thunderstorm.png',
  '13d': 'snow.png', '13n': 'snow.png',
  '50d': 'mist.png', '50n': 'mist.png'
};

// Weather endpoint
app.get('/api/weather', async (req, res) => {
    try {
      const [current, forecast] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Towson&units=imperial&appid=${OPENWEATHER_API_KEY}`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=Towson&units=imperial&appid=${OPENWEATHER_API_KEY}`)
      ]);
  
      // Process hourly forecast (next 6 hours)
      const hourlyForecast = forecast.data.list.slice(0, 6).map(hour => ({
        time: new Date(hour.dt * 1000).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          hour12: true 
        }).replace(':00', ''), // Clean format (e.g., "2 PM" instead of "2:00 PM")
        temp: Math.round(hour.main.temp),
        condition: hour.weather[0].main,
        icon: weatherIcons[hour.weather[0].icon]
      }));
  
      // Process daily forecast (next 7 days with accurate high/low)
      const dailyData = forecast.data.list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString('en-US');
        
        if (!acc[dayKey]) {
          acc[dayKey] = {
            date: date,
            high: -Infinity,
            low: Infinity,
            conditions: new Set(),
            icons: new Set()
          };
        }
        
        // Update high and low temps
        acc[dayKey].high = Math.max(acc[dayKey].high, item.main.temp_max);
        acc[dayKey].low = Math.min(acc[dayKey].low, item.main.temp_min);
        acc[dayKey].conditions.add(item.weather[0].main);
        acc[dayKey].icons.add(item.weather[0].icon);
        
        return acc;
      }, {});
  
      const dailyForecast = Object.values(dailyData).slice(0, 7).map((day, index) => ({
        day: index === 0 ? 'Today' : 
             day.date.toLocale
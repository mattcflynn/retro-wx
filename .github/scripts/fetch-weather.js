const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Configure your location
const LATITUDE = 45.5369;  // Replace with your latitude
const LONGITUDE = -122.7858; // Replace with your longitude

// Visual Crossing API configuration
const VISUAL_CROSSING_API_KEY = process.env.VISUAL_CROSSING_API_KEY; // Replace with your API key from visualcrossing.com
const UNITS = 'us'; // 'us' for imperial, 'metric' for metric

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const outputFile = path.join(dataDir, 'weather.json');

async function fetchWeatherData() {
  try {
    console.log('Fetching weather data from Visual Crossing API...');
    
    // Build the API URL
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${LATITUDE},${LONGITUDE}?unitGroup=${UNITS}&include=hours,current&key=${VISUAL_CROSSING_API_KEY}&contentType=json`;
    
    // Fetch data from Visual Crossing
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': '(github.com/mattcflynn/retro-wx, mattcflynn@gmail.com)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weather data: ${response.statusText}`);
    }
    
    const weatherData = await response.json();
    console.log('Weather data received from Visual Crossing');
    
    // Log a sample of what we received
    if (weatherData.days && weatherData.days.length > 0 && weatherData.days[0].hours) {
      console.log('Sample hour data:');
      console.log(JSON.stringify(weatherData.days[0].hours[0], null, 2));
    }
    
    // Process the data
    const processedData = processWeatherData(weatherData);
    
    // Add timestamp for debugging
    const timestamp = new Date().toISOString();
    processedData.lastUpdated = timestamp;
    
    // Create a timestamp-based filename (replacing colons and periods with underscores for compatibility)
    const safeTimestamp = timestamp.replace(/[:.]/g, '_');
    const timestampedOutputFile = path.join(dataDir, `weather-${safeTimestamp}.json`);
    
    // Save to both the regular file and the timestamped file
    fs.writeFileSync(outputFile, JSON.stringify(processedData, null, 2));
    fs.writeFileSync(timestampedOutputFile, JSON.stringify(processedData, null, 2));
    
    // Create or update a file that contains the latest filename
    const latestFilename = `weather-${safeTimestamp}.json`;
    fs.writeFileSync(path.join(dataDir, 'latest-weather-file.txt'), latestFilename, 'utf-8');
    
    console.log('Weather data saved successfully!');
    console.log('Timestamped file created:', timestampedOutputFile);
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Don't overwrite existing data if there's an error
    if (!fs.existsSync(outputFile)) {
      // Create a minimal placeholder if no data exists yet
      const placeholderData = {
        error: error.message,
        lastUpdated: new Date().toISOString()
      };
      fs.writeFileSync(outputFile, JSON.stringify(placeholderData, null, 2));
    }
  }
}

function processWeatherData(weatherData) {
  // Get current conditions
  const currentTemp = weatherData.currentConditions ? weatherData.currentConditions.temp : null;
  
  // Process today's data (first day in the array)
  const today = weatherData.days[0];
  const hourlyData = today.hours;
  
  // Process hourly data
  const hourlyProcessed = hourlyData.map(hour => {
    // Parse the hour from the datetime string (format: "14:00:00")
    const hourInt = parseInt(hour.datetime.split(':')[0], 10);
    
    return {
      hour: hourInt,
      temp: Math.round(hour.temp), // Round to nearest whole number
      chance: hour.precipprob || 0, // Precipitation probability
      amount: hour.precip || 0, // Precipitation amount in inches (already in inches in US units)
      cloudCover: hour.cloudcover || 0 // Cloud cover percentage
    };
  });
  
  // Get high and low temperatures for the day
  const highTemp = today.tempmax;
  const lowTemp = today.tempmin;
  
  return {
    current: {
      temp: currentTemp
    },
    forecast: {
      high: highTemp,
      low: lowTemp,
      hourly: hourlyProcessed
    }
  };
}

// Run the function
fetchWeatherData();
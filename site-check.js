// Simple site check script - run this directly in the browser console

console.log('📋 RETRO WEATHER SITE CHECK');
console.log('==========================');

// Check 1: Core JavaScript variables exist
console.log('\n[1] Checking core variables...');
let check1 = true;

if (typeof coordinates === 'undefined') {
    console.error('❌ coordinates is not defined');
    check1 = false;
} else {
    console.log('✅ coordinates is defined:', coordinates);
}

if (typeof displaySettings === 'undefined') {
    console.error('❌ displaySettings is not defined');
    check1 = false;
} else {
    console.log('✅ displaySettings is defined:', displaySettings);
}

if (typeof weatherData === 'undefined') {
    console.error('❌ weatherData is not defined');
    check1 = false;
} else {
    console.log('✅ weatherData is defined with temperature:', weatherData.current.temp);
}

// Check 2: Core UI elements exist and have content
console.log('\n[2] Checking UI elements...');
let check2 = true;

const uiElements = [
    { id: 'container', name: 'Main container' },
    { id: 'day-display', name: 'Day display' },
    { id: 'date-display', name: 'Date display' },
    { id: 'time-display', name: 'Time display' },
    { id: 'current-temp', name: 'Current temperature' },
    { id: 'high-low', name: 'High-low temperatures' },
    { id: 'graph', name: 'Precipitation graph' },
    { id: 'timeline', name: 'Timeline' },
    { id: 'cloud-cover', name: 'Cloud cover' }
];

uiElements.forEach(el => {
    const element = document.getElementById(el.id);
    if (!element) {
        console.error(`❌ ${el.name} (${el.id}) is missing`);
        check2 = false;
    } else if (element.textContent.trim() === '' && el.id !== 'graph') {
        console.warn(`⚠️ ${el.name} (${el.id}) has no content`);
    } else {
        console.log(`✅ ${el.name} (${el.id}) exists${el.id !== 'graph' ? ' with content' : ''}`);
    }
});

// Check 3: Functions exist and are callable
console.log('\n[3] Checking core functions...');
let check3 = true;

const coreFunctions = [
    { name: 'initializeApp', desc: 'App initialization' },
    { name: 'updateDateTime', desc: 'Date/time update' },
    { name: 'initializeScales', desc: 'Scale initialization' },
    { name: 'fetchWeatherData', desc: 'Weather data fetching' },
    { name: 'updateWeatherInfo', desc: 'Weather display update' },
    { name: 'initializePrecipitationGraph', desc: 'Graph initialization' },
    { name: 'initializeTimeline', desc: 'Timeline initialization' },
    { name: 'initializeCloudCover', desc: 'Cloud cover initialization' }
];

coreFunctions.forEach(func => {
    if (typeof window[func.name] !== 'function') {
        console.error(`❌ ${func.desc} function (${func.name}) is not defined`);
        check3 = false;
    } else {
        console.log(`✅ ${func.desc} function (${func.name}) is defined`);
    }
});

// Check 4: Demo data exists
console.log('\n[4] Checking demo data...');
let check4 = true;

if (typeof demoWeatherData === 'undefined') {
    console.error('❌ Demo weather data is not defined');
    check4 = false;
} else if (!demoWeatherData.forecast || !demoWeatherData.forecast.hourly) {
    console.error('❌ Demo weather data is missing forecast information');
    check4 = false;
} else {
    console.log('✅ Demo weather data exists with', demoWeatherData.forecast.hourly.length, 'hourly records');
}

// Check 5: Event listeners for settings
console.log('\n[5] Checking settings functionality...');
const settingsButton = document.getElementById('toggle-settings');
const settingsPanel = document.getElementById('settings-panel');
const saveButton = document.getElementById('save-settings');

if (!settingsButton || !settingsPanel || !saveButton) {
    console.error('❌ Settings elements are missing');
} else {
    console.log('✅ Settings UI elements exist');
    
    // Test toggling settings panel
    const initialDisplay = window.getComputedStyle(settingsPanel).display;
    settingsButton.click();
    const afterClickDisplay = window.getComputedStyle(settingsPanel).display;
    
    if (initialDisplay === afterClickDisplay) {
        console.error('❌ Settings panel toggle is not working');
    } else {
        console.log('✅ Settings panel toggle is working');
    }
    
    // Hide panel if it's showing
    if (afterClickDisplay !== 'none') {
        document.getElementById('cancel-settings').click();
    }
}

// Overall status
console.log('\n==== SITE CHECK SUMMARY ====');
if (check1 && check2 && check3 && check4) {
    console.log('✅ ALL CHECKS PASSED - Site appears to be functioning correctly');
} else {
    if (!check1) console.error('❌ Core variables check failed');
    if (!check2) console.error('❌ UI elements check failed');
    if (!check3) console.error('❌ Core functions check failed');
    if (!check4) console.error('❌ Demo data check failed');
    console.error('❌ SOME CHECKS FAILED - See details above');
}

console.log('\nTo test weather data fetching, run:');
console.log('fetchWeatherData().then(() => console.log("Weather data fetched!"));'); 
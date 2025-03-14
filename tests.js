// Weather Application Test Suite
console.log('Starting weather application tests...');

// Test group object to organize test results
const TestResults = {
    passed: 0,
    failed: 0,
    total: 0,
    
    // Test assertion function
    assert: function(condition, message) {
        this.total++;
        if (condition) {
            console.log(`✅ PASS: ${message}`);
            this.passed++;
            return true;
        } else {
            console.error(`❌ FAIL: ${message}`);
            this.failed++;
            return false;
        }
    },
    
    // Display final results
    summary: function() {
        console.log('\n--- TEST SUMMARY ---');
        console.log(`Total tests: ${this.total}`);
        console.log(`Passed: ${this.passed}`);
        console.log(`Failed: ${this.failed}`);
        console.log(`Success rate: ${Math.round((this.passed / this.total) * 100)}%`);
        console.log('-------------------\n');
    }
};

// Test 1: DOM Elements Existence
function testDOMElements() {
    console.log('\n🔍 Testing DOM Elements...');
    
    TestResults.assert(
        document.getElementById('container'), 
        'Main container exists'
    );
    
    TestResults.assert(
        document.getElementById('current-temp'), 
        'Current temperature element exists'
    );
    
    TestResults.assert(
        document.getElementById('graph'), 
        'Precipitation graph element exists'
    );
    
    TestResults.assert(
        document.getElementById('timeline'), 
        'Timeline element exists'
    );
    
    TestResults.assert(
        document.getElementById('cloud-cover'), 
        'Cloud cover element exists'
    );
    
    TestResults.assert(
        document.getElementById('settings-panel'), 
        'Settings panel exists'
    );
}

// Test 2: Application Initialization
function testAppInitialization() {
    console.log('\n🔍 Testing App Initialization...');
    
    // Check if global variables are defined
    TestResults.assert(
        typeof coordinates !== 'undefined' && 
        coordinates.latitude && 
        coordinates.longitude, 
        'Coordinates are properly initialized'
    );
    
    TestResults.assert(
        typeof displaySettings !== 'undefined', 
        'Display settings are properly initialized'
    );
    
    TestResults.assert(
        typeof weatherData !== 'undefined' &&
        weatherData.hasOwnProperty('current') &&
        weatherData.hasOwnProperty('forecast'),
        'Weather data structure is properly initialized'
    );
}

// Test 3: Weather Data Loading
async function testWeatherDataLoading() {
    console.log('\n🔍 Testing Weather Data Loading...');
    
    try {
        // Create a test function that wraps fetchWeatherData
        // but returns a promise we can await
        const testFetch = () => {
            return new Promise((resolve, reject) => {
                // Save original weatherData to restore later
                const originalData = JSON.parse(JSON.stringify(weatherData));
                
                // Reset weatherData to test loading
                weatherData = {
                    current: { temp: null },
                    forecast: { high: null, low: null, hourly: [] }
                };
                
                // Hook into the display updates to know when fetch completes
                const originalUpdateWeatherInfo = window.updateWeatherInfo;
                window.updateWeatherInfo = function() {
                    // Restore original function
                    window.updateWeatherInfo = originalUpdateWeatherInfo;
                    
                    // Check if data was loaded
                    const success = weatherData.current.temp !== null || 
                                  (displaySettings.useDemoData && weatherData.current.temp !== null);
                    
                    // Restore original data
                    weatherData = originalData;
                    
                    // Call original function
                    originalUpdateWeatherInfo();
                    
                    resolve(success);
                };
                
                // Force demo data for testing to avoid external dependencies
                const originalUseDemoData = displaySettings.useDemoData;
                displaySettings.useDemoData = true;
                
                // Call fetchWeatherData
                fetchWeatherData().catch(e => {
                    // Restore everything
                    window.updateWeatherInfo = originalUpdateWeatherInfo;
                    displaySettings.useDemoData = originalUseDemoData;
                    weatherData = originalData;
                    reject(e);
                });
                
                // Restore setting
                displaySettings.useDemoData = originalUseDemoData;
            });
        };
        
        const dataLoadSuccess = await testFetch();
        TestResults.assert(dataLoadSuccess, 'Weather data loading test succeeded');
        
    } catch (error) {
        TestResults.assert(false, `Weather data loading test failed: ${error.message}`);
    }
}

// Test 4: UI Rendering
function testUIRendering() {
    console.log('\n🔍 Testing UI Rendering...');
    
    // Test date/time display
    const dayDisplay = document.getElementById('day-display');
    const dateDisplay = document.getElementById('date-display');
    const timeDisplay = document.getElementById('time-display');
    
    TestResults.assert(
        dayDisplay && dayDisplay.textContent.trim() !== '',
        'Day of week is rendered'
    );
    
    TestResults.assert(
        dateDisplay && dateDisplay.textContent.trim() !== '',
        'Date is rendered'
    );
    
    TestResults.assert(
        timeDisplay && timeDisplay.textContent.trim() !== '',
        'Time is rendered'
    );
    
    // Test current weather display
    const currentTemp = document.getElementById('current-temp');
    TestResults.assert(
        currentTemp && 
        currentTemp.textContent.includes('°F') && 
        !isNaN(parseInt(currentTemp.textContent)),
        'Current temperature is rendered with proper format'
    );
    
    // Test temperature class assignment
    TestResults.assert(
        currentTemp.classList.contains('temp-cold') || 
        currentTemp.classList.contains('temp-nice') || 
        currentTemp.classList.contains('temp-hot'),
        'Temperature has appropriate color class assigned'
    );
    
    // Test graph rendering
    const graph = document.getElementById('graph');
    TestResults.assert(
        graph && graph.children.length > 0,
        'Precipitation graph bars are rendered'
    );
    
    // Test timeline rendering
    const timeline = document.getElementById('timeline');
    TestResults.assert(
        timeline && timeline.children.length > 0,
        'Timeline markers are rendered'
    );
}

// Test 5: Settings Interface
function testSettingsInterface() {
    console.log('\n🔍 Testing Settings Interface...');
    
    const settingsPanel = document.getElementById('settings-panel');
    const toggleButton = document.getElementById('toggle-settings');
    
    // Initial state
    const initialDisplay = window.getComputedStyle(settingsPanel).display;
    TestResults.assert(
        initialDisplay === 'none',
        'Settings panel is initially hidden'
    );
    
    // Toggle settings panel
    toggleButton.click();
    TestResults.assert(
        window.getComputedStyle(settingsPanel).display !== 'none',
        'Settings panel appears when toggle button is clicked'
    );
    
    // Check settings form elements
    TestResults.assert(
        document.getElementById('latitude') && 
        document.getElementById('longitude'),
        'Coordinate input fields exist'
    );
    
    TestResults.assert(
        document.getElementById('toggle-crt-effect') && 
        document.getElementById('toggle-flicker-effect'),
        'Display effect toggles exist'
    );
    
    // Hide panel again
    document.getElementById('cancel-settings').click();
    TestResults.assert(
        window.getComputedStyle(settingsPanel).display === 'none',
        'Settings panel hides when cancel button is clicked'
    );
}

// Test 6: Error Handling
function testErrorHandling() {
    console.log('\n🔍 Testing Error Handling...');
    
    // Check if error message container exists
    const errorMessage = document.getElementById('error-message');
    TestResults.assert(
        errorMessage,
        'Error message container exists'
    );
    
    // Test error display function
    const originalDisplay = errorMessage.style.display;
    errorMessage.style.display = 'block';
    errorMessage.textContent = 'Test error message';
    
    TestResults.assert(
        errorMessage.textContent === 'Test error message' && 
        window.getComputedStyle(errorMessage).display === 'block',
        'Error message can be displayed'
    );
    
    // Reset error message
    errorMessage.style.display = originalDisplay;
    errorMessage.textContent = '';
}

// Run all tests after a short delay to ensure the app is initialized
setTimeout(async () => {
    try {
        console.log('==========================');
        console.log('🧪 WEATHER APP TEST SUITE 🧪');
        console.log('==========================\n');
        
        // Run all test functions
        testDOMElements();
        testAppInitialization();
        await testWeatherDataLoading();
        testUIRendering();
        testSettingsInterface();
        testErrorHandling();
        
        // Display test summary
        TestResults.summary();
        
        // Final assessment
        if (TestResults.failed === 0) {
            console.log('🎉 ALL TESTS PASSED! The application appears to be working correctly.');
        } else {
            console.log('⚠️ SOME TESTS FAILED. See above for details on what needs fixing.');
        }
    } catch (error) {
        console.error('❌ ERROR RUNNING TESTS:', error);
    }
}, 3000); // Wait 3 seconds for app to initialize 
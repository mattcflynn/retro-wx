// This script will be used to run tests from the browser console

// Function to inject the test script
function injectTests() {
    console.log('Injecting test script...');
    
    // Create script element
    const script = document.createElement('script');
    script.src = 'tests.js';
    script.onload = function() {
        console.log('Test script loaded and running...');
    };
    
    // Add to document
    document.body.appendChild(script);
}

// Run the tests
console.log('🧪 Weather App Test Runner 🧪');
console.log('Make sure you are on the index.html page before running tests');
console.log('Waiting 3 seconds for application to fully initialize...');

setTimeout(injectTests, 3000); 
// Fetch scenarios from the JSON file
let scenarios = [];
let currentScenarioIndex = 0;

async function loadScenarios() {
    try {
        const response = await fetch('/static/../scenarios.json');
        scenarios = await response.json();
        displayScenario(scenarios[currentScenarioIndex]);
    } catch (error) {
        console.error("Error loading scenarios:", error);
    }
}

function displayScenario(scenario) {
    // Swapnil will connect these to his HTML IDs later
    console.log("Loading Scenario:", scenario.subject);
    
    // Example of what he will do:
    // document.getElementById('email-sender').innerText = scenario.sender;
    // document.getElementById('email-subject').innerText = scenario.subject;
    // document.getElementById('email-body').innerHTML = scenario.body;
}

// Start the game loop when the page loads
window.onload = loadScenarios;
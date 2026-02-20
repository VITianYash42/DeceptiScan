let scenarios = [];
let currentScenarioIndex = 0;
let score = 0;


// LOAD ALL SCENARIOS
async function loadScenarios() {

    try {

        const response = await fetch('/api/scenarios');
        scenarios = await response.json();

        displayScenario(scenarios[currentScenarioIndex]);

    } catch (error) {
        console.error("Error loading scenarios:", error);
    }
}


// SHOW EMAIL ON SCREEN
function displayScenario(scenario) {

    document.getElementById('email-sender').innerText = scenario.sender;
    document.getElementById('email-subject').innerText = scenario.subject;
    document.getElementById('email-body').innerHTML = scenario.body;

    // attach link click if phishing link exists
    const link = document.querySelector("#phish-link");

    if(link){
        link.onclick = function(){
            clickLink(scenario);
            return false;
        };
    }
}


// USER CLICKED EMAIL LINK
function clickLink(scenario){

    let success = !scenario.is_phish;

    if(scenario.is_phish){
        score -= 50;
        alert("❌ You clicked phishing link (-50)");
    } else {
        alert("✔ Safe link");
    }

    sendResult(scenario.id, success);
}


// USER PRESSED REPORT BUTTON
function reportEmail(){

    const scenario = scenarios[currentScenarioIndex];

    let success = scenario.is_phish;

    if(scenario.is_phish){
        score += 100;
        alert("✔ Correct phishing report (+100)");
    }else{
        score -= 20;
        alert("❌ That email was safe (-20)");
    }

    sendResult(scenario.id, success);
}


// SEND TO BACKEND
async function sendResult(id, success){

    document.getElementById("score").innerText = score;

    await fetch("/api/update-score",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            scenario_id:id,
            success:success
        })
    });

    alert(scenarios[currentScenarioIndex].explanation);
}


// NEXT EMAIL BUTTON
function nextScenario(){

    currentScenarioIndex++;

    if(currentScenarioIndex >= scenarios.length){
        alert("Game finished!");
        return;
    }

    displayScenario(scenarios[currentScenarioIndex]);
}


window.onload = loadScenarios;

// pop up
function showToast(message){

    const container = document.getElementById("toast-container");
    if(!container) return;

    const toast = document.createElement("div");

    // AUTO COLOR DETECTION
    let color = "bg-blue-600";   // default

    if(message.includes("+")) color="bg-green-600 ring-2 ring-green-300";
    if(message.includes("-")) color="bg-red-600 ring-2 ring-red-300";

    toast.className =
        `${color} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 min-w-[280px] animate-toast-in`;

    // message
    const text = document.createElement("span");
    text.innerText = message;
    text.className = "flex-1";

    // close button
    const close = document.createElement("button");

    close.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"/>
    </svg>
    `;
    close.className =
    "ml-2 opacity-70 hover:opacity-100 transition cursor-pointer";
    close.onclick = ()=> toast.remove();

    toast.appendChild(text);
    toast.appendChild(close);

    container.appendChild(toast);

    // auto remove
    setTimeout(()=>{
        toast.classList.add("animate-toast-out");
        setTimeout(()=>toast.remove(),300);
    },5000);
}
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
        showToast("❌ You clicked phishing link (-50)");
    } else {
        showToast("✔ Safe link");
    }

    sendResult(scenario.id, success);
}


// USER PRESSED REPORT BUTTON
function reportEmail(){

    const scenario = scenarios[currentScenarioIndex];

    let success = scenario.is_phish;

    if(scenario.is_phish){
        score += 100;
        showToast("✔ Correct phishing report (+100)");
    }else{
        score -= 20;
        showToast("❌ That email was safe (-20)");
    }

    sendResult(scenario.id, success);
}


// SEND TO BACKEND
async function sendResult(id, success){

    document.getElementById("score").innerText = score;

    // CHANGED THIS URL to bypass ad-blockers
    await fetch("/api/process-email",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            scenario_id:id,
            success:success
        })
    });

    showToast(scenarios[currentScenarioIndex].explanation);
}


// NEXT EMAIL BUTTON
function nextScenario(){

    currentScenarioIndex++;

    if(currentScenarioIndex >= scenarios.length){
        showToast("Game finished!");
        return;
    }

    displayScenario(scenarios[currentScenarioIndex]);
}


window.onload = loadScenarios;

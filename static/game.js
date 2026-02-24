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

async function loadScenarios() {
    try {
        const response = await fetch('/api/scenarios');
        scenarios = await response.json();
        
        // Fetch current score from DOM if passed (defaults to 0 if not set)
        const scoreElement = document.getElementById("score");
        if(scoreElement && parseInt(scoreElement.innerText)) {
            score = parseInt(scoreElement.innerText);
        }
        
        displayScenario(scenarios[currentScenarioIndex]);
    } catch (error) {
        console.error("Error loading scenarios:", error);
    }
}

function displayScenario(scenario) {
    document.getElementById('email-sender').innerText = scenario.sender;
    document.getElementById('email-subject').innerText = scenario.subject;
    document.getElementById('email-body').innerHTML = scenario.body;

    const link = document.querySelector("#phish-link");
    if(link){
        link.onclick = function(){
            clickLink(scenario);
            return false; // Prevent actual navigation
        };
    }
}

// Visual Feedback Engine
function showFeedbackOverlay(isSuccess, points, explanation, isPhish) {
    const overlay = document.getElementById('feedback-overlay');
    const card = document.getElementById('feedback-card');
    const icon = document.getElementById('feedback-icon');
    const title = document.getElementById('feedback-title');
    const message = document.getElementById('feedback-message');
    const scoreChange = document.getElementById('feedback-score-change');
    const nextBtn = document.getElementById('feedback-next-btn');
    const finishBtn = document.getElementById('feedback-finish-btn');

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    void overlay.offsetWidth; // Force DOM reflow
    card.classList.remove('scale-90');
    card.classList.add('scale-100');

    if (isSuccess) {
        card.className = "glass-panel p-10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] max-w-lg w-full text-center border-4 border-green-500 bg-green-50/90 transform transition-transform duration-500 scale-100 mx-4 relative overflow-hidden";
        icon.innerHTML = isPhish ? "🎣🛡️" : "✅";
        title.innerHTML = isPhish ? "Phishing Attempt Blocked!" : "Safe Email Confirmed!";
        title.className = "text-3xl font-black mb-4 tracking-tight text-green-700 drop-shadow-sm";
        scoreChange.innerHTML = `<span class="text-green-800 bg-green-200/80 border border-green-400 px-5 py-2 rounded-xl inline-block shadow-sm">Score ${points}</span>`;
        playAudio('success');
    } else {
        card.className = "glass-panel p-10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] max-w-lg w-full text-center border-4 border-red-500 bg-red-50/90 transform transition-transform duration-500 scale-100 mx-4 relative overflow-hidden";
        icon.innerHTML = isPhish ? "🚨" : "❌";
        title.innerHTML = isPhish ? "YOU GOT PHISHED!" : "False Alarm!";
        title.className = "text-3xl font-black mb-4 tracking-tight text-red-700 drop-shadow-sm";
        scoreChange.innerHTML = `<span class="text-red-800 bg-red-200/80 border border-red-400 px-5 py-2 rounded-xl inline-block shadow-sm">Score ${points}</span>`;
        playAudio('error');
    }

    message.innerHTML = `<strong>Analysis:</strong> ${explanation}`;

    if (currentScenarioIndex >= scenarios.length - 1) {
        nextBtn.classList.add('hidden');
        finishBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        finishBtn.classList.add('hidden');
    }
}

function playAudio(type) {
    try {
        const sound = new Audio(`/static/${type}.mp3`);
        sound.volume = 0.5;
        sound.play().catch(e => console.log("Audio files not found. Add success.mp3 and error.mp3 to static folder."));
    } catch (e) {}
}

async function sendResult(id, success, pointsAwarded) {
    const scenario = scenarios[currentScenarioIndex];
    document.getElementById("score").innerText = score;

    await fetch("/api/process-email",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ scenario_id: id, success: success })
    });

    let pointsStr = pointsAwarded > 0 ? `+${pointsAwarded}` : pointsAwarded;
    showFeedbackOverlay(success, pointsStr, scenario.explanation, scenario.is_phish);
}

// User Actions
function clickLink(scenario){
    let success = !scenario.is_phish;
    let pointsAwarded = scenario.is_phish ? -50 : 20;
    score += pointsAwarded;
    sendResult(scenario.id, success, pointsAwarded);
}

function reportEmail(){
    const scenario = scenarios[currentScenarioIndex];
    let success = scenario.is_phish;
    let pointsAwarded = scenario.is_phish ? 100 : -20; // Penalize false reports
    score += pointsAwarded;
    sendResult(scenario.id, success, pointsAwarded);
}

function markAsSafe(){
    const scenario = scenarios[currentScenarioIndex];
    let success = !scenario.is_phish;
    let pointsAwarded = scenario.is_phish ? -50 : 20; // They approved a phish! Or correctly verified safe.
    score += pointsAwarded;
    sendResult(scenario.id, success, pointsAwarded);
}

function nextScenario(){
    document.getElementById('feedback-overlay').classList.add('hidden');
    currentScenarioIndex++;
    if(currentScenarioIndex >= scenarios.length){
        finishGame();
        return;
    }
    displayScenario(scenarios[currentScenarioIndex]);
}

function finishGame() {
    window.location.href = "/profile";
}

window.onload = loadScenarios;
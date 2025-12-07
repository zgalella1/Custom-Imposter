//--------------------------------------
// Game State
//--------------------------------------
let roles = [];
let currentPlayer = 0;
let countdownInterval;
let playerNames = [];


//--------------------------------------
// Initialize When Page Loads
//--------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const playerCountInput = document.getElementById("playerCount");
  const editNamesBtn = document.getElementById("editNamesBtn");
  const startBtn = document.getElementById("startBtn");

  // Generate default names based on starting player count
  generateNameFields();

  // Regenerate name fields when player count changes
  playerCountInput.addEventListener("input", () => {
    generateNameFields();
  });

  // Show/hide name editor
  editNamesBtn.addEventListener("click", () => {
    toggleNames();
  });

  // Start game
  startBtn.addEventListener("click", () => {
    startGame();
  });
});


//--------------------------------------
// Name Editing Logic
//--------------------------------------
function toggleNames() {
  const container = document.getElementById("nameContainer");

  // If hidden and empty, regenerate (safety)
  if (!container.children.length) {
    generateNameFields();
  }

  container.classList.toggle("hidden");
}

function generateNameFields() {
  const count = parseInt(document.getElementById("playerCount").value) || 3;
  const container = document.getElementById("nameContainer");

  container.innerHTML = ""; // Wipe old fields
  playerNames = [];

  for (let i = 0; i < count; i++) {
    const input = document.createElement("input");
    input.placeholder = "Player " + (i + 1);
    input.className = "name-field";
    input.value = "Player " + (i + 1);

    // Store value
    playerNames[i] = input.value;

    input.addEventListener("input", () => {
      playerNames[i] = input.value || ("Player " + (i + 1));
    });

    container.appendChild(input);
  }
}


//--------------------------------------
// Game Setup
//--------------------------------------
function startGame() {
  const playerCount = parseInt(document.getElementById("playerCount").value);
  const impostorCount = parseInt(document.getElementById("impostorCount").value);
  const rawWords = document.getElementById("wordList").value;

  const words = rawWords
    .split(/[\n,]+/)
    .map(w => w.trim())
    .filter(Boolean);

  const chosenWord = words[Math.floor(Math.random() * words.length)] || "WORD";

  // Ensure playerNames is filled
  for (let i = 0; i < playerCount; i++) {
    if (!playerNames[i]) playerNames[i] = "Player " + (i + 1);
  }

  // Random impostor selection
  let impostorIndexes = [];
  while (impostorIndexes.length < impostorCount) {
    let idx = Math.floor(Math.random() * playerCount);
    if (!impostorIndexes.includes(idx)) impostorIndexes.push(idx);
  }

  // Assign roles
  roles = [];
  for (let i = 0; i < playerCount; i++) {
    roles.push({
      name: playerNames[i],
      isImpostor: impostorIndexes.includes(i),
      word: impostorIndexes.includes(i) ? null : chosenWord
    });
  }

  currentPlayer = 0;

  showReveal();
  switchScreen("setup", "reveal");
}


//--------------------------------------
// Reveal Screen
//--------------------------------------
function showReveal() {
  const header = document.getElementById("playerHeader");
  const roleText = document.getElementById("roleText");

  header.innerText = roles[currentPlayer].name;

  if (roles[currentPlayer].isImpostor) {
    roleText.innerText = "IMPOSTOR";
    roleText.style.color = "red";
  } else {
    roleText.innerText = "Word: " + roles[currentPlayer].word;
    roleText.style.color = "blue";
  }
}

function nextPlayer() {
  currentPlayer++;

  if (currentPlayer >= roles.length) {
    startTimer();
    switchScreen("reveal", "timer");
  } else {
    showReveal();
  }
}


//--------------------------------------
// Timer Screen
//--------------------------------------
function startTimer() {
  const

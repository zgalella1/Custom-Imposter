let roles = [];
let currentPlayer = 0;
let playerNames = [];
let timer;
let countdown = 60;


// --------------------------
// PLAYER LIST MANAGEMENT
// --------------------------

function openPlayerList() {
  const count = parseInt(document.getElementById("playerCount").value);

  // Adjust playerNames length
  while (playerNames.length < count) {
    playerNames.push("Player " + (playerNames.length + 1));
  }
  playerNames = playerNames.slice(0, count);

  renderPlayerList();

  document.getElementById("setupScreen").classList.add("hidden");
  document.getElementById("playerListScreen").classList.remove("hidden");
}

function closePlayerList() {
  // Update list based on fields
  const inputs = document.querySelectorAll("#playerList input");
  playerNames = Array.from(inputs).map((i, idx) => i.value || ("Player " + (idx + 1)));

  document.getElementById("playerCount").value = playerNames.length;

  document.getElementById("playerListScreen").classList.add("hidden");
  document.getElementById("setupScreen").classList.remove("hidden");
}

function renderPlayerList() {
  const container = document.getElementById("playerList");
  container.innerHTML = "";

  playerNames.forEach((name, i) => {
    container.innerHTML += `
      <input value="${name}" placeholder="Player ${i + 1}">
    `;
  });
}

function addPlayer() {
  playerNames.push("Player " + (playerNames.length + 1));
  renderPlayerList();
}


// --------------------------
// GAME LOGIC
// --------------------------

function startGame() {
  const playerCount = parseInt(document.getElementById("playerCount").value);
  const imposterCount = parseInt(document.getElementById("imposterCount").value);

  countdown = parseInt(document.getElementById("timerLength").value) || 60;

  const wordList = document.getElementById("wordList").value.trim().split("\n");
  const realWord = wordList[Math.floor(Math.random() * wordList.length)];

  const fakeWord = document.getElementById("fakeWord").value;

  // Generate imposter positions
  const imposters = new Set();
  while (imposters.size < imposterCount) {
    imposters.add(Math.floor(Math.random() * playerCount));
  }

  roles = [];
  for (let i = 0; i < playerCount; i++) {
    roles.push({
      name: playerNames[i] || "Player " + (i + 1),
      isimposter: imposters.has(i),
      word: imposters.has(i) ? fakeWord : realWord
    });
  }

  currentPlayer = 0;

  document.getElementById("setupScreen").classList.add("hidden");
  document.getElementById("revealScreen").classList.remove("hidden");

  showRole();
}

function showRole() {
  const r = roles[currentPlayer];

  document.getElementById("playerHeader").innerText = r.name;

  const roleText = document.getElementById("roleText");
  roleText.innerText = r.word;
  roleText.classList.add("hidden");

  const button = document.getElementById("revealButton");
  button.innerText = "Show My Word";
}

function toggleWord() {
  const roleText = document.getElementById("roleText");
  const button = document.getElementById("revealButton");

  if (roleText.classList.contains("hidden")) {
    roleText.classList.remove("hidden");
    button.innerText = "Hide My Word";
  } else {
    roleText.classList.add("hidden");
    button.innerText = "Show My Word";
  }
}


function nextPlayer() {
  currentPlayer++;

  if (currentPlayer >= roles.length) {
    startTimer();
    return;
  }

  showRole();
}


// --------------------------
// TIMER + FINAL REVEAL
// --------------------------

function startTimer() {
  document.getElementById("revealScreen").classList.add("hidden");
  document.getElementById("timerScreen").classList.remove("hidden");

// countdown is already set in startGame()
document.getElementById("timerDisplay").innerText = countdown;

  document.getElementById("timerDisplay").innerText = countdown;

  timer = setInterval(() => {
    countdown--;
    document.getElementById("timerDisplay").innerText = countdown;

    if (countdown <= 0) {
      clearInterval(timer);
      document.getElementById("showimpostersBtn").classList.remove("hidden");
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);

  // Show the reveal button immediately
  document.getElementById("showimpostersBtn").classList.remove("hidden");

  // Optionally show "0" on the display
  document.getElementById("timerDisplay").innerText = "0";
}


function showimposters() {
  document.getElementById("timerScreen").classList.add("hidden");
  document.getElementById("finalScreen").classList.remove("hidden");

  const list = document.getElementById("isimposter");
  list.innerHTML = "";

  roles.forEach(r => {
    if (r.isimposter) {
      list.innerHTML += `<p>${r.name}</p>`;
    }
  });
}

function returnToMenu() {
  // Hide final screen
  document.getElementById("finalScreen").classList.add("hidden");

  // Show setup screen
  document.getElementById("setupScreen").classList.remove("hidden");

  // Ensure the player list matches the stored names
  document.getElementById("playerCount").value = playerNames.length;

  // (Optional) Reset nothing else — all values remain in the fields
}


let roles = [];
let currentPlayer = 0;
let countdownInterval;

function startGame() {
  const playerCount = parseInt(document.getElementById("playerCount").value);
  const impostorCount = parseInt(document.getElementById("impostorCount").value);
  const rawWords = document.getElementById("wordList").value;
  const timerSeconds = parseInt(document.getElementById("timerLength").value);

  const words = rawWords
    .split(/[\n,]+/)
    .map(w => w.trim())
    .filter(Boolean);

  const chosenWord = words[Math.floor(Math.random() * words.length)];

  // Choose impostors
  let impostorIndexes = [];
  while (impostorIndexes.length < impostorCount) {
    let idx = Math.floor(Math.random() * playerCount);
    if (!impostorIndexes.includes(idx)) impostorIndexes.push(idx);
  }

  // Assign roles
  roles = [];
  for (let i = 0; i < playerCount; i++) {
    roles.push({
      isImpostor: impostorIndexes.includes(i),
      word: impostorIndexes.includes(i) ? null : chosenWord
    });
  }

  currentPlayer = 0;
  showReveal();
  switchScreen("setup", "reveal");
}

function showReveal() {
  document.getElementById("playerHeader").innerText =
    "Player " + (currentPlayer + 1);

  if (roles[currentPlayer].isImpostor) {
    document.getElementById("roleText").innerText = "IMPOSTOR";
    document.getElementById("roleText").style.color = "red";
  } else {
    document.getElementById("roleText").innerText =
      "Word: " + roles[currentPlayer].word;
    document.getElementById("roleText").style.color = "blue";
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

function startTimer() {
  const timerSeconds = parseInt(document.getElementById("timerLength").value);
  let timeLeft = timerSeconds;
  const display = document.getElementById("countdown");

  display.innerText = timeLeft;

  countdownInterval = setInterval(() => {
    timeLeft--;
    display.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      display.innerText = "Time's up!";
    }
  }, 1000);
}

function switchScreen(hideId, showId) {
  document.getElementById(hideId).classList.add("hidden");
  document.getElementById(showId).classList.remove("hidden");
}

function restart() {
  clearInterval(countdownInterval);
  switchScreen("timer", "setup");
}

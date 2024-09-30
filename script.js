if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registriert mit dem Scope: ",
          registration.scope
        );
      })
      .catch((error) => {
        console.log("ServiceWorker Registrierung fehlgeschlagen: ", error);
      });
  });
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dino-Bild und Ei-Bild laden
const dinoImg = new Image();
dinoImg.src = "dino.png";

const eggImg = new Image();
eggImg.src = "egg.png";

// Spielvariablen
let player = {
  x: 200,
  y: 200,
  size: 80,
  speed: 4,
  dx: 0,
  dy: 0,
};

let point = {
  x: Math.random() * (canvas.width - 40),
  y: Math.random() * (canvas.height - 40),
  size: 40,
};

let score = 0;
let highscore = 0;
let highscorePlayer = "Noch kein Highscore!";
let gameDuration = 60; // 60 Sekunden
let timeLeft = gameDuration;
let gameInterval = null;
let playerName = "";
let scoreList = []; // Liste der Punkte

// HTML-Elemente für den Timer, Highscore, Punktestand und Scoreboard
const timerElement = document.getElementById("timer");
const highscoreElement = document.getElementById("highscore");
const highscorePlayerElement = document.getElementById("highscorePlayer");
const playerScoreElement = document.getElementById("playerScore");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startButton = document.getElementById("startButton");
const scoreListElement = document.getElementById("scoreList");

// Spieler und Ei zeichnen
function drawPlayer() {
  ctx.drawImage(dinoImg, player.x, player.y, player.size, player.size);
}

function drawPoint() {
  ctx.drawImage(eggImg, point.x, point.y, point.size, point.size);
}

// Punktestand anzeigen
function drawScore() {
  playerScoreElement.innerText = `Punkte: ${score}`;
}

// Spielerposition aktualisieren
function updatePlayerPosition() {
  player.x += player.dx;
  player.y += player.dy;

  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x + player.size > canvas.width)
    player.x = canvas.width - player.size;
  if (player.y + player.size > canvas.height)
    player.y = canvas.height - player.size;
}

// Kollisionserkennung
function checkCollision() {
  if (
    player.x < point.x + point.size &&
    player.x + player.size > point.x &&
    player.y < point.y + point.size &&
    player.y + player.size > point.y
  ) {
    score++;
    point.x = Math.random() * (canvas.width - point.size);
    point.y = Math.random() * (canvas.height - point.size);
  }
}

// Timer aktualisieren und Spiel beenden
function updateTimer() {
  timeLeft--;
  timerElement.innerText = `Zeit übrig: ${timeLeft}`;

  if (timeLeft <= 0) {
    endGame();
  }
}

// Spiel beenden und Highscore aktualisieren
function endGame() {
  clearInterval(gameInterval);

  // Highscore aktualisieren
  if (score > highscore) {
    highscore = score;
    highscorePlayer = playerName;
    highscoreElement.innerText = `Highscore: ${highscore}`;
    highscorePlayerElement.innerText = `Bester Spieler: ${highscorePlayer}`;
  }

  // Punkteliste aktualisieren
  updateScoreList(playerName, score);

  alert(`Spiel vorbei! Dein Punktestand: ${score}`);
  resetGame();
}

// Spiel und Timer starten
function startGame() {
  playerName =
    document.getElementById("playerName").value || "Unbekannter Spieler";
  score = 0;
  timeLeft = gameDuration;

  startScreen.style.display = "none";
  gameScreen.style.display = "block";

  gameInterval = setInterval(() => {
    updateTimer();
  }, 1000);

  update();
}

// Spiel zurücksetzen
function resetGame() {
  player.x = 200;
  player.y = 200;
  score = 0;
  timeLeft = gameDuration;

  startScreen.style.display = "block";
  gameScreen.style.display = "none";
}

// Spiel aktualisieren
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawPoint();
  drawScore();

  updatePlayerPosition();
  checkCollision();

  if (timeLeft > 0) {
    requestAnimationFrame(update);
  }
}

// Punkteliste aktualisieren und anzeigen
function updateScoreList(name, score) {
  // Punktestand in Liste hinzufügen
  scoreList.push({ name: name, score: score });

  // Liste nach Punktestand sortieren
  scoreList.sort((a, b) => b.score - a.score);

  // Scoreboard aktualisieren
  scoreListElement.innerHTML = ""; // Alte Liste leeren
  scoreList.forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.innerText = `${entry.name}: ${entry.score} Punkte`;
    scoreListElement.appendChild(listItem);
  });
}

// Spielerbewegung
function moveUp() {
  player.dy = -player.speed;
}

function moveDown() {
  player.dy = player.speed;
}

function moveLeft() {
  player.dx = -player.speed;
}

function moveRight() {
  player.dx = player.speed;
}

function stopMove() {
  player.dx = 0;
  player.dy = 0;
}

// Tastenereignisse
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") moveUp();
  if (e.key === "ArrowDown") moveDown();
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
});

document.addEventListener("keyup", stopMove);

// Startbutton-Ereignis
startButton.addEventListener("click", startGame);

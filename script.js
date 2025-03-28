// 🎮 Sélection des éléments HTML
const menu = document.getElementById('menu');
const intro = document.getElementById('intro');
const gameCanvas = document.getElementById('gameCanvas');
const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('nextButton');
const dialogueText = document.getElementById('dialogueText');
const backgroundMusic = document.getElementById('backgroundMusic');

// 🎨 Initialisation du Canvas
const ctxGame = gameCanvas.getContext('2d');
const gameWidth = 800, gameHeight = 600;
gameCanvas.width = gameWidth;
gameCanvas.height = gameHeight;

// 🔥 Variables du jeu
let score = 0;
let lives = 3;
let gameRunning = false;
const keys = { ArrowLeft: false, ArrowRight: false };
let canShoot = true;

// 🏆 Joueur
const player = {
    x: gameWidth / 2 - 25,
    y: gameHeight - 50,
    width: 50,
    height: 20,
    color: 'purple',
    speed: 3
};

// 🗑️ Déchet (ennemi)
const trash = {
    x: Math.random() * (gameWidth - 50),
    y: 0,
    width: 50,
    height: 50,
    speed: 1.5,
    color: 'green'
};

// 🔫 Tableau des tirs
const shots = [];

// 💬 Dialogues d'introduction
const dialogue = [
    "Welcome to Trash Invaders!",
    "Your mission is to clean up the trash.",
    "Use the arrow keys to move.",
    "Press space to shoot.",
    "Good luck and have fun!"
];

let dialogueIndex = 0;

// 🎵 Vérification du chargement de la musique
backgroundMusic.addEventListener('error', () => {
    console.log("Erreur : Impossible de charger le fichier audio.");
});

backgroundMusic.addEventListener('canplaythrough', () => {
    console.log("🎶 Musique prête à être jouée.");
});

// 🚀 Lancer la musique et afficher l'intro après un clic sur Start
startButton.addEventListener('click', () => {
    menu.style.display = 'none';
    intro.style.display = 'flex'; // Afficher l'intro
    showDialogue();

    // 🎶 Jouer la musique après interaction utilisateur
    backgroundMusic.volume = 0.5;
    backgroundMusic.play().then(() => {
        console.log("🎵 Musique jouée avec succès !");
    }).catch(error => {
        console.log("❌ Erreur lors de la lecture de la musique :", error);
    });
});

// 🎬 Afficher les dialogues d'intro
nextButton.addEventListener('click', () => {
    dialogueIndex++;
    if (dialogueIndex < dialogue.length) {
        showDialogue();
    } else {
        intro.style.display = 'none';
        gameCanvas.style.display = 'block';
        startGame();
    }
});

function showDialogue() {
    dialogueText.textContent = dialogue[dialogueIndex];
}

// 🎯 Dessiner le joueur
function drawPlayer() {
    ctxGame.fillStyle = player.color;
    ctxGame.fillRect(player.x, player.y, player.width, player.height);
}

// 🗑️ Dessiner le déchet
function drawTrash() {
    ctxGame.fillStyle = trash.color;
    ctxGame.fillRect(trash.x, trash.y, trash.width, trash.height);
}

// 🔫 Dessiner les tirs
function drawShots() {
    ctxGame.fillStyle = 'red';
    shots.forEach((shot, index) => {
        ctxGame.fillRect(shot.x, shot.y, 5, 10);
        shot.y -= 3;

        // 🎯 Vérification des collisions avec le déchet
        if (shot.y <= trash.y + trash.height &&
            shot.y >= trash.y &&
            shot.x >= trash.x &&
            shot.x <= trash.x + trash.width) {
            score += 10;
            trash.y = 0;
            trash.x = Math.random() * (gameWidth - trash.width);
            shots.splice(index, 1);
        }

        // Suppression des tirs hors écran
        if (shot.y < 0) shots.splice(index, 1);
    });
}

// ♻️ Mise à jour du déchet
function updateTrash() {
    trash.y += trash.speed;
    if (trash.y > gameHeight) {
        trash.y = 0;
        trash.x = Math.random() * (gameWidth - trash.width);
        lives--;
        if (lives === 0) {
            alert(`Game Over! Final Score: ${score}`);
            resetGame();
        }
    }
}

// 🚀 Mise à jour du joueur
function updatePlayer() {
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x < gameWidth - player.width) player.x += player.speed;
}

// 🎮 Gestion des touches clavier
document.addEventListener('keydown', (event) => {
    if (event.key in keys) keys[event.key] = true;
    if (event.key === ' ' && canShoot) {
        shots.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
        canShoot = false;
        setTimeout(() => canShoot = true, 500); // Délai de tir augmenté
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key in keys) keys[event.key] = false;
});

// 🔄 Boucle du jeu (mise à jour continue)
function draw() {
    if (!gameRunning) return;

    ctxGame.clearRect(0, 0, gameWidth, gameHeight);
    drawTrash();
    drawPlayer();
    drawShots();
    updateTrash();
    updatePlayer();

    // Affichage du score et des vies
    ctxGame.fillStyle = 'black';
    ctxGame.font = '20px Arial';
    ctxGame.fillText(`Score: ${score}`, 10, 30);
    ctxGame.fillText(`Lives: ${lives}`, 700, 30);

    requestAnimationFrame(draw);
}

// 🎮 Démarrer le jeu
function startGame() {
    score = 0;
    lives = 3;
    gameRunning = true;
    draw();
}

// 🔄 Réinitialiser le jeu
function resetGame() {
    gameRunning = false;
    gameCanvas.style.display = 'none';
    menu.style.display = 'flex';
}

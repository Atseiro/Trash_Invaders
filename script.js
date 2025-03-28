// 🎮 Sélection des éléments HTML
const menu = document.getElementById('menu');
const intro = document.getElementById('intro');
const gameCanvas = document.getElementById('gameCanvas');
const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('nextButton');
const dialogueText = document.getElementById('dialogueText');
const backgroundMusic = new Audio('assets/Trash_Invalideras.mp3');

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

// 🚀 Chargement de l'image du joueur (vaisseau)
const playerImage = new Image();
playerImage.src = 'assets/spaceship.png';

// 🏆 Joueur (Vaisseau)
const player = {
    x: gameWidth / 2 - 25,
    y: gameHeight - 80,
    width: 50,
    height: 50,
    speed: 4
};

// 🗑️ Déchet (Ennemi)
const trash = {
    x: Math.random() * (gameWidth - 100),
    y: 0,
    width: 100,
    height: 120,
    speed: 2
};

// 🔄 Images possibles pour les déchets
const trashImages = [
    'assets/Bouteille.png',
    'assets/Canette.png',
    'assets/Sac.png'
];

let trashImage = new Image();
trashImage.src = trashImages[Math.floor(Math.random() * trashImages.length)];

// 🔄 Change l’image du déchet
function resetTrashImage() {
    trashImage.src = trashImages[Math.floor(Math.random() * trashImages.length)];
}

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

// 🚀 Lancer la musique et afficher l'intro après un clic sur Start
startButton.addEventListener('click', () => {
    menu.style.display = 'none';
    intro.style.display = 'flex';
    showDialogue();
    backgroundMusic.volume = 0.5;
    backgroundMusic.play();
});

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

// 🎯 Dessiner le joueur (Vaisseau)
function drawPlayer() {
    ctxGame.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// 🖼️ Dessiner le déchet
function drawTrash() {
    ctxGame.drawImage(trashImage, trash.x, trash.y, trash.width, trash.height);
}

// 🔫 Dessiner les tirs
function drawShots() {
    ctxGame.fillStyle = 'red';
    shots.forEach((shot, index) => {
        ctxGame.fillRect(shot.x, shot.y, 5, 10);
        shot.y -= 5;

        // Vérifier si un tir touche un déchet
        if (
            shot.y <= trash.y + trash.height &&
            shot.y >= trash.y &&
            shot.x >= trash.x &&
            shot.x <= trash.x + trash.width
        ) {
            score += 10;
            trash.y = 0;
            trash.x = Math.random() * (gameWidth - trash.width);
            shots.splice(index, 1);
            resetTrashImage();
        }

        if (shot.y < 0) shots.splice(index, 1);
    });
}

// ♻️ Mise à jour du déchet
function updateTrash() {
    trash.y += trash.speed;

    // Si un déchet atteint le bas, on perd une vie
    if (trash.y > gameHeight) {
        trash.y = 0;
        trash.x = Math.random() * (gameWidth - trash.width);
        lives--;
        resetTrashImage();

        // Vérification de la fin de partie
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

    // Tir (espace)
    if (event.key === ' ' && canShoot) {
        shots.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
        canShoot = false;
        setTimeout(() => canShoot = true, 500);
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key in keys) keys[event.key] = false;
});

// 🎯 Afficher le score et les vies
function drawHUD() {
    ctxGame.fillStyle = 'white';
    ctxGame.font = '20px Arial';
    ctxGame.fillText(`Score: ${score}`, 10, 30);
    ctxGame.fillText(`Lives: ${lives}`, gameWidth - 100, 30);
}

// 🔄 Boucle du jeu
function draw() {
    if (!gameRunning) return;

    ctxGame.clearRect(0, 0, gameWidth, gameHeight);

    drawTrash();
    drawPlayer();
    drawShots();
    updateTrash();
    updatePlayer();
    drawHUD(); // 🔥 Affichage du score et des vies

    requestAnimationFrame(draw);
}

// 🚀 Démarrer le jeu
function startGame() {
    score = 0;
    lives = 3;
    gameRunning = true;
    draw();
}

// 🔄 Réinitialisation du jeu
function resetGame() {
    gameRunning = false;
    gameCanvas.style.display = 'none';
    menu.style.display = 'flex';
}

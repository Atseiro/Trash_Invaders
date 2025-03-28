const menu = document.getElementById('menu');
const intro = document.getElementById('intro');
const gameCanvas = document.getElementById('gameCanvas');
const introCanvas = document.getElementById('introCanvas');
const startButton = document.getElementById('startButton');
const nextButton = document.getElementById('nextButton');
const dialogueText = document.getElementById('dialogueText');
const menuMusic = document.getElementById('menuMusic');

const ctxGame = gameCanvas.getContext('2d');
const ctxIntro = introCanvas.getContext('2d');

let score = 0;
let lives = 3;
let gameTime = 0;
const gameDuration = 3 * 60 * 60;

gameCanvas.width = 800;
gameCanvas.height = 600;

const trash = {
    x: Math.random() * (gameCanvas.width - 100),
    y: 0,
    width: 50,
    height: 50,
    speed: 2,
    color: 'green'
};

const player = {
    x: gameCanvas.width / 2,
    y: gameCanvas.height - 50,
    width: 50,
    height: 20,
    color: 'purple',
    speed: 5
};

const shots = [];
const keys = { ArrowLeft: false, ArrowRight: false };
const goodItems = [{ x: Math.random() * (gameCanvas.width - 100), y: 0, width: 50, height: 50, speed: 2, color: 'blue' }];
let canShoot = true;

const dialogue = [
    "Welcome to Trash Invaders!",
    "Your mission is to clean up the trash.",
    "Use the arrow keys to move.",
    "Press space to shoot.",
    "Good luck and have fun!"
];

let dialogueIndex = 0;

startButton.addEventListener('click', () => {
    menuMusic.volume = 0.5; // Set volume
    menuMusic.loop = true;  // Enable looping
    menuMusic.play().catch(error => console.log("Music autoplay blocked:", error)); // Handle autoplay errors
    menu.style.display = 'none';
    intro.style.display = 'block';
    showDialogue();
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

function drawTrash(item) {
    ctxGame.fillStyle = item.color;
    ctxGame.fillRect(item.x, item.y, item.width, item.height);
}

function updateTrash(item) {
    item.y += item.speed;
    if (item.y > gameCanvas.height) {
        item.y = 0;
        item.x = Math.random() * (gameCanvas.width - 100);
        if (item === trash) lives--;
    }
}

function drawPlayer() {
    ctxGame.fillStyle = player.color;
    ctxGame.fillRect(player.x, player.y, player.width, player.height);
}

function drawShots() {
    ctxGame.fillStyle = 'red';
    shots.forEach((shot, index) => {
        ctxGame.fillRect(shot.x, shot.y, 5, 10);
        shot.y -= shot.speed;

        if (shot.y <= trash.y + trash.height && shot.y >= trash.y && shot.x >= trash.x && shot.x <= trash.x + trash.width) {
            score += 10;
            hitEffect(trash);
            trash.y = 0;
            trash.x = Math.random() * (gameCanvas.width - 100);
            shots.splice(index, 1);
        }

        goodItems.forEach(item => {
            if (shot.y <= item.y + item.height && shot.y >= item.y && shot.x >= item.x && shot.x <= item.x + item.width) {
                score -= 5;
                item.y = 0;
                item.x = Math.random() * (gameCanvas.width - 100);
                shots.splice(index, 1);
            }
        });

        if (shot.y < 0) shots.splice(index, 1);
    });
}

function hitEffect(item) {
    let originalColor = item.color;
    item.color = 'red';
    setTimeout(() => item.color = originalColor, 200);
}

function updatePlayer() {
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x < gameCanvas.width - player.width) player.x += player.speed;
}

// Fix shooting issue
document.addEventListener('keydown', (event) => {
    if (event.key in keys) keys[event.key] = true;
    if (event.key === ' ' && canShoot) {
        shoot();
        canShoot = false;
        setTimeout(() => canShoot = true, 300);
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key in keys) keys[event.key] = false;
});

function shoot() {
    shots.push({ x: player.x + player.width / 2, y: player.y, speed: 5 });
}

function draw() {
    if (lives <= 0) {
        alert(`Game Over! Final Score: ${score}`);
        return;
    }

    ctxGame.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawTrash(trash);
    goodItems.forEach(drawTrash);
    drawPlayer();
    drawShots();
    updateTrash(trash);
    goodItems.forEach(updateTrash);
    updatePlayer();

    ctxGame.fillStyle = 'black';
    ctxGame.font = '20px Arial';
    ctxGame.fillText(`Score: ${score}`, 10, 30);
    ctxGame.fillText(`Lives: ${lives}`, 700, 30);

    requestAnimationFrame(draw);
}

function startGame() {
    lives = 3;
    score = 0;
    draw();
}

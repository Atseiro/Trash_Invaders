const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let lives = 3;

const trash = {
    x: Math.random() * (canvas.width - 50),
    y: 0,
    width: 50,
    height: 50,
    speed: 2
};

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 20,
    color: 'purple',
    speed: 5
};

const shots = [];
const keys = {};

function drawTrash() {
    ctx.fillStyle = 'green';
    ctx.fillRect(trash.x, trash.y, trash.width, trash.height);
}

function updateTrash() {
    trash.y += trash.speed;
    if (trash.y > canvas.height) {
        trash.y = 0;
        trash.x = Math.random() * (canvas.width - 50);
        lives--;
    }
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawShots() {
    ctx.fillStyle = 'red';
    shots.forEach((shot, index) => {
        ctx.fillRect(shot.x, shot.y, 5, 10);
        shot.y -= shot.speed;

        if (shot.y <= trash.y + trash.height &&
            shot.y >= trash.y &&
            shot.x >= trash.x &&
            shot.x <= trash.x + trash.width) {
            score++;
            trash.y = 0;
            trash.x = Math.random() * (canvas.width - 50);
            shots.splice(index, 1);
        }

        if (shot.y < 0) {
            shots.splice(index, 1);
        }
    });
}

function updatePlayer() {
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

function shoot() {
    if (keys[' ']) {
        shots.push({ x: player.x + player.width / 2, y: player.y, speed: 5 });
        keys[' '] = false;
    }
}

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrash();
    drawPlayer();
    drawShots();
    updateTrash();
    updatePlayer();
    shoot();
    requestAnimationFrame(draw);
}

draw();

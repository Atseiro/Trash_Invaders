const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let lives = 3;
let gameTime = 0;
const maxSpeed = 10; // Vitesse maximale
const gameDuration = 3 * 60 * 60; // 3 minutes en frames (60 frames par seconde)

const trash = {
    x: Math.random() * (canvas.width - 50),
    y: 0,
    width: 50,
    height: 50,
    speed: 2,
    color: 'green'
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
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ' ': false
};

const goodItems = [{
    x: Math.random() * (canvas.width - 50),
    y: 0,
    width: 50,
    height: 50,
    speed: 2,
    color: 'blue'
}];

function drawTrash(item) {
    ctx.fillStyle = item.color;
    ctx.fillRect(item.x, item.y, item.width, item.height);
}

function updateTrash(item) {
    item.y += item.speed;
    if (item.y > canvas.height) {
        item.y = 0;
        item.x = Math.random() * (canvas.width - 50);
        if (item === trash) {
            lives--;
        }
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

        // Vérifier les collisions avec les déchets
        if (shot.y <= trash.y + trash.height &&
            shot.y >= trash.y &&
            shot.x >= trash.x &&
            shot.x <= trash.x + trash.width) {
            score += 10; // Augmenter le score
            trash.y = 0;
            trash.x = Math.random() * (canvas.width - 50);
            shots.splice(index, 1);
        }

        // Vérifier les collisions avec les bons items
        goodItems.forEach(item => {
            if (shot.y <= item.y + item.height &&
                shot.y >= item.y &&
                shot.x >= item.x &&
                shot.x <= item.x + item.width) {
                score -= 5; // Diminuer le score
                item.y = 0;
                item.x = Math.random() * (canvas.width - 50);
                shots.splice(index, 1);
            }
        });

        if (shot.y < 0) {
            shots.splice(index, 1);
        }
    });
}

function updatePlayer() {
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.width) {
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
    if (event.key in keys) {
        keys[event.key] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
});

function draw() {
    if (gameTime >= gameDuration) {
        alert(`Game Over! Your score is: ${score}`);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrash(trash);
    goodItems.forEach(item => drawTrash(item));
    drawPlayer();
    drawShots();
    updateTrash(trash);
    goodItems.forEach(item => updateTrash(item));
    updatePlayer();
    shoot();

    // Augmenter la vitesse des objets au fil du temps
    gameTime++;
    if (gameTime % 120 === 0 && trash.speed < maxSpeed) { // Augmenter la vitesse toutes les 120 frames
        trash.speed += 0.1;
        goodItems.forEach(item => item.speed += 0.1);
    }

    // Afficher le score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(draw);
}

draw();

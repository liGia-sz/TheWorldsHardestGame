import levels from './assets/levels.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player;
let obstacles = [];
let levelData;
let currentLevel = 0;
let gameOver = false;
let score = 0;
let totalStars = 0;

const playerSpeed = 7; // Tente aumentar para 8 ou 10 para mais velocidade
let keys = {};

function init() {
    player = {
        x: 50,
        y: canvas.height - 60,
        width: 30,
        height: 30,
        speed: 5,
        color: 'red' // ou 'lime'
    };
    loadLevel(currentLevel);
    document.addEventListener('keydown', (e) => keys[e.key] = true);
    document.addEventListener('keyup', (e) => keys[e.key] = false);
    requestAnimationFrame(gameLoop);
}

function loadLevel(levelIndex) {
    levelData = levels[levelIndex];
    player.x = levelData.playerStart.x;
    player.y = levelData.playerStart.y;
    score = 0;
    totalStars = levelData.stars.length;
    levelData.stars.forEach(star => star.collected = false);
    levelData.goal.revealed = false;
}

function updatePlayer() {
    let nextX = player.x;
    let nextY = player.y;

    if (keys['ArrowUp'])    nextY -= player.speed;
    if (keys['ArrowDown'])  nextY += player.speed;
    if (keys['ArrowLeft'])  nextX -= player.speed;
    if (keys['ArrowRight']) nextX += player.speed;

    // Limitar o player dentro do canvas
    nextX = Math.max(0, Math.min(canvas.width - player.width, nextX));
    nextY = Math.max(0, Math.min(canvas.height - player.height, nextY));

    // Impedir atravessar paredes (type: 'wall')
    let collision = false;
    levelData.platforms.forEach(p => {
        if (p.type === 'wall') {
            if (
                nextX < p.x + p.width &&
                nextX + player.width > p.x &&
                nextY < p.y + p.height &&
                nextY + player.height > p.y
            ) {
                collision = true;
            }
        }
    });

    if (!collision) {
        player.x = nextX;
        player.y = nextY;
    }

    checkCollision();
}

// 1. Mover inimigos (bolas azuis) e rebater nas bordas
function updateEnemies() {
    levelData.enemies.forEach(e => {
        e.x += e.dx;
        e.y += e.dy;

        // Rebater nas bordas do canvas
        if (e.x - e.radius < 0 || e.x + e.radius > canvas.width) {
            e.dx *= -1;
        }
        if (e.y - e.radius < 0 || e.y + e.radius > canvas.height) {
            e.dy *= -1;
        }

        // Rebater nas plataformas (espaços seguros)
        levelData.platforms.forEach(p => {
            // Checa colisão circular-retangular
            const closestX = Math.max(p.x, Math.min(e.x, p.x + p.width));
            const closestY = Math.max(p.y, Math.min(e.y, p.y + p.height));
            const distX = e.x - closestX;
            const distY = e.y - closestY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            if (distance < e.radius) {
                // Rebater na horizontal ou vertical dependendo do lado mais próximo
                if (Math.abs(distX) > Math.abs(distY)) {
                    e.dx *= -1;
                } else {
                    e.dy *= -1;
                }
            }
        });
    });
}

// 2. Detectar colisão com inimigos
function checkEnemyCollision() {
    levelData.enemies.forEach(e => {
        const distX = (player.x + player.width / 2) - e.x;
        const distY = (player.y + player.height / 2) - e.y;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < e.radius + player.width / 2) {
            gameOver = true;
        }
    });
}

// 3. Detectar chegada na meta
function checkGoalCollision() {
    if (!levelData.goal.revealed) return; // Só permite passar se a chegada estiver revelada
    const g = levelData.goal;
    const distX = (player.x + player.width / 2) - g.x;
    const distY = (player.y + player.height / 2) - g.y;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < g.width / 2 + player.width / 2) {
        nextLevel();
    }
}

// 4. Trocar de nível
function nextLevel() {
    currentLevel++;
    if (currentLevel >= levels.length) {
        alert('Parabéns! Você completou todos os níveis!');
        currentLevel = 0;
    }
    loadLevel(currentLevel);
    // Reinicia posição do jogador
    player.x = levels[currentLevel].playerStart.x;
    player.y = levels[currentLevel].playerStart.y;
    gameOver = false;
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            gameOver = true;
        }
    });
}

function checkStarCollision() {
    levelData.stars.forEach(star => {
        if (!star.collected) {
            const distX = (player.x + player.width / 2) - star.x;
            const distY = (player.y + player.height / 2) - star.y;
            const distance = Math.sqrt(distX * distX + distY * distY);
            if (distance < 20) {
                star.collected = true;
                score++;
                // Revela a chegada se pegou todas as estrelas
                if (score === totalStars) {
                    levelData.goal.revealed = true;
                }
            }
        }
    });
}

function gameLoop() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = 'bold 48px "Outfit", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);

        // Desenha o botão
        ctx.fillStyle = '#222';
        ctx.fillRect(restartBtnRect.x, restartBtnRect.y, restartBtnRect.width, restartBtnRect.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(restartBtnRect.x, restartBtnRect.y, restartBtnRect.width, restartBtnRect.height);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px "Outfit", Arial, sans-serif';
        ctx.fillText('Reiniciar', canvas.width / 2, restartBtnRect.y + 34);

        showRestartButton = true;
        ctx.textAlign = 'left'; // volta ao padrão
        return;
    } else {
        showRestartButton = false;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updatePlayer();
    updateEnemies();
    drawPlatforms();
    drawEnemies();
    drawStars(); // <-- Adicione esta linha para desenhar as estrelas!
    drawGoal();
    drawPlayer();
    checkEnemyCollision();
    checkGoalCollision();
    checkStarCollision();

    ctx.fillStyle = 'black';
    ctx.font = '20px "Outfit", Arial, sans-serif';
    ctx.fillText(`Nível: ${currentLevel + 1} / ${levels.length}`, 20, 60); // Adiciona o contador de níveis
    ctx.fillText(`Estrelas: ${score} / ${totalStars}`, 20, 30);

    requestAnimationFrame(gameLoop);
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = 'black';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawPlatforms() {
    levelData.platforms.forEach(p => {
        if (p.type === 'safe') {
            ctx.fillStyle = 'cyan'; // Safespace
        } else {
            ctx.fillStyle = '#bbb'; // Cor de parede/corredor
        }
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });
}

function drawEnemies() {
    ctx.fillStyle = 'blue';
    levelData.enemies.forEach(e => {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawStars() {
    levelData.stars.forEach(star => {
        if (!star.collected) {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(star.x, star.y, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'orange';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}

function drawGoal() {
    if (levelData.goal.revealed) {
        ctx.fillStyle = 'gold';
        const g = levelData.goal;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

let showRestartButton = false;
const restartBtnRect = {
    x: canvas.width / 2 - 100,
    y: canvas.height / 2 + 30,
    width: 200,
    height: 50
};

const restartBtn = document.getElementById('restartBtn');
restartBtn.onclick = function() {
    currentLevel = 0;
    loadLevel(currentLevel);
    player.x = levels[currentLevel].playerStart.x;
    player.y = levels[currentLevel].playerStart.y;
    gameOver = false;
    score = 0;
    restartBtn.style.display = 'none';
    requestAnimationFrame(gameLoop);
};

canvas.addEventListener('click', function(evt) {
    if (showRestartButton) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = evt.clientX - rect.left;
        const mouseY = evt.clientY - rect.top;
        if (
            mouseX >= restartBtnRect.x &&
            mouseX <= restartBtnRect.x + restartBtnRect.width &&
            mouseY >= restartBtnRect.y &&
            mouseY <= restartBtnRect.y + restartBtnRect.height
        ) {
            currentLevel = 0;
            loadLevel(currentLevel);
            player.x = levels[currentLevel].playerStart.x;
            player.y = levels[currentLevel].playerStart.y;
            gameOver = false;
            score = 0;
            showRestartButton = false;
            requestAnimationFrame(gameLoop);
        }
    }
});

init();
// script.js

// 1. Elementos do DOM
const player = document.getElementById('player');
const gameContainer = document.querySelector('.game-container');
const platforms = document.querySelectorAll('.platform'); // Seleciona todas as plataformas

// 2. Variáveis de Jogo
let playerX = 50; // Posição X inicial do jogador
let playerY = 100; // Posição Y inicial do jogador (distância do fundo)
let playerWidth = 30;
let playerHeight = 30;

let gravity = 0.5; // Força da gravidade
let verticalVelocity = 0; // Velocidade vertical (para pular e cair)
let horizontalVelocity = 0; // Velocidade horizontal
let moveSpeed = 3; // Velocidade de movimento lateral
let jumpStrength = 10; // Força do pulo

let isOnGround = false; // Flag para saber se o jogador está no chão/plataforma
let keys = {}; // Objeto para controlar as teclas pressionadas

const enemies = [
    { x: 300, y: 150, radius: 15, dx: 2, dy: 2 }
];

// 3. Funções Principais

// Função para atualizar a posição do jogador no CSS
function updatePlayerPosition() {
    player.style.left = playerX + 'px';
    player.style.bottom = playerY + 'px';
}

// Função para detectar colisão com plataformas
function checkPlatformCollision() {
    isOnGround = false; // Assume que não está no chão no início de cada frame

    platforms.forEach(platform => {
        const platformRect = platform.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        // Converte as coordenadas do elemento DOM para as coordenadas do jogo (bottom em vez de top)
        const platformLeft = platformRect.left - gameContainer.getBoundingClientRect().left;
        const platformRight = platformRect.right - gameContainer.getBoundingClientRect().left;
        const platformBottom = gameContainer.clientHeight - platformRect.bottom; // Distância do fundo
        const platformTop = gameContainer.clientHeight - platformRect.top; // Distância do fundo

        // Verifica colisão horizontal
        const collidingX = playerX < platformRight && (playerX + playerWidth) > platformLeft;

        // Verifica colisão vertical (para pousar na plataforma)
        // O jogador está caindo (verticalVelocity < 0)
        // A parte de baixo do jogador está acima do topo da plataforma (playerY >= platformTop)
        // A parte de cima do jogador está abaixo do fundo da plataforma (playerY + playerHeight <= platformBottom)
        // NOTA: Ajuste esta lógica para ser mais precisa se tiver problemas.
        // Uma abordagem mais robusta seria verificar se a base do jogador está prestes a cruzar o topo da plataforma
        const playerBottom = playerY;
        const playerTop = playerY + playerHeight;

        // Verifica se a base do jogador está entrando em contato com o topo da plataforma
        const landingOnPlatform = (playerBottom <= platformTop && (playerBottom + verticalVelocity) >= platformTop) && // Se a base está acima ou encostando no topo da plataforma
                                  (playerTop > platformBottom); // E a parte de cima do jogador não está abaixo da plataforma

        if (collidingX && landingOnPlatform && verticalVelocity <= 0) {
            playerY = platformTop; // Coloca o jogador exatamente no topo da plataforma
            verticalVelocity = 0; // Para de cair
            isOnGround = true;
            return; // Se encontrou uma plataforma, não precisa verificar as outras para o chão
        }
    });

    // Se o jogador não está em nenhuma plataforma e não está no chão, aplica gravidade
    if (!isOnGround) {
        verticalVelocity -= gravity;
    }
}

function updateEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.dx;
        enemy.y += enemy.dy;
        // Rebater nas bordas
        if (enemy.x < 0 || enemy.x > gameContainer.clientWidth) enemy.dx *= -1;
        if (enemy.y < 0 || enemy.y > gameContainer.clientHeight) enemy.dy *= -1;

        // Atualize a posição visual (crie elementos ou use canvas)
        // Exemplo: document.getElementById('enemy1').style.left = enemy.x + 'px';
    });
}

// Loop principal do jogo
function gameLoop() {
    // Atualiza velocidade horizontal com base nas teclas
    horizontalVelocity = 0;
    if (keys['ArrowLeft'] || keys['a']) {
        horizontalVelocity = -moveSpeed;
    }
    if (keys['ArrowRight'] || keys['d']) {
        horizontalVelocity = moveSpeed;
    }

    // Aplica a velocidade horizontal
    playerX += horizontalVelocity;

    // Limita o jogador dentro do container horizontalmente
    if (playerX < 0) {
        playerX = 0;
    }
    if (playerX + playerWidth > gameContainer.clientWidth) {
        playerX = gameContainer.clientWidth - playerWidth;
    }

    // Aplica a velocidade vertical
    playerY += verticalVelocity;

    // Verifica colisão com plataformas (e chão)
    checkPlatformCollision();

    // Limita o jogador dentro do container verticalmente (para não cair abaixo do chão principal)
    if (playerY < 0) {
        playerY = 0;
        verticalVelocity = 0;
        isOnGround = true; // Se atingiu o fundo do container, está no chão
    }

    updatePlayerPosition(); // Atualiza o CSS do jogador
    updateEnemies();
    requestAnimationFrame(gameLoop); // Chama o loop novamente para o próximo frame
}

// 4. Event Listeners para Entradas do Usuário

// Captura teclas pressionadas
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
    // Pulo (só pula se estiver no chão)
    if ((event.key === 'ArrowUp' || event.key === 'w' || event.key === ' ') && isOnGround) {
        verticalVelocity = jumpStrength;
        isOnGround = false; // Não está mais no chão enquanto pula
    }
});

// Captura teclas soltas
document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// 5. Iniciar o Jogo
updatePlayerPosition(); // Posiciona o jogador na inicial
requestAnimationFrame(gameLoop); // Inicia o loop do jogo
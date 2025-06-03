const levels = [
    {
        playerStart: { x: 40, y: 260 },
        platforms: [
            // Safespace grande à esquerda (início)
            { x: 0, y: 160, width: 120, height: 280, type: 'safe' },
            // Safespace menor à direita (chegada)
            { x: 700, y: 260, width: 80, height: 80, type: 'safe' }
        ],
        enemies: [
            { x: 250, y: 300, radius: 15, dx: 4, dy: 3 },
            { x: 400, y: 250, radius: 15, dx: -3, dy: 4 },
            { x: 550, y: 350, radius: 15, dx: 4, dy: -4 },
            { x: 300, y: 200, radius: 15, dx: 3, dy: 5 },
            { x: 600, y: 400, radius: 15, dx: -5, dy: 3 }
        ],
        stars: [
            { x: 200, y: 200, collected: false },
            { x: 400, y: 350, collected: false },
            { x: 600, y: 250, collected: false }
        ],
        goal: { x: 730, y: 290, width: 30, height: 30, revealed: false }
    },
    {
        playerStart: { x: 50, y: 50 },
        platforms: [
            { x: 0, y: 0, width: 120, height: 120, type: 'safe' }, // Safe inicial
            { x: 680, y: 480, width: 120, height: 120, type: 'safe' } // Safe final
        ],
        enemies: [
            { x: 200, y: 150, radius: 15, dx: 5, dy: 4 },
            { x: 300, y: 250, radius: 15, dx: -4, dy: 5 },
            { x: 500, y: 100, radius: 15, dx: 4, dy: -4 },
            { x: 600, y: 400, radius: 15, dx: -5, dy: 3 },
            { x: 400, y: 500, radius: 15, dx: 3, dy: -5 }
        ],
        stars: [
            { x: 200, y: 500, collected: false },
            { x: 400, y: 300, collected: false },
            { x: 600, y: 150, collected: false },
            { x: 700, y: 550, collected: false }
        ],
        goal: { x: 750, y: 30, width: 30, height: 30, revealed: false } // Canto superior direito, longe dos safespaces
    },
    {
        playerStart: { x: 50, y: 50 },
        platforms: [
            { x: 0, y: 0, width: 120, height: 120, type: 'safe' },
            { x: 680, y: 480, width: 120, height: 120, type: 'safe' }
        ],
        enemies: [
            { x: 350, y: 100, radius: 15, dx: 4, dy: 5 },
            { x: 400, y: 300, radius: 15, dx: -5, dy: 4 },
            { x: 600, y: 200, radius: 15, dx: 5, dy: -5 },
            { x: 700, y: 100, radius: 15, dx: -4, dy: 4 },
            { x: 500, y: 400, radius: 15, dx: 4, dy: 4 }
        ],
        stars: [
            { x: 200, y: 500, collected: false },
            { x: 400, y: 200, collected: false },
            { x: 600, y: 400, collected: false }
        ],
        goal: { x: 700, y: 50, width: 30, height: 30, revealed: false }
    }
];

export default levels;
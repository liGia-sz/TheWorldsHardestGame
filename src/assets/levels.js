const levels = [
    {
        playerStart: { x: 50, y: 100 },
        platforms: [
            { x: 0, y: 0, width: 120, height: 120 }, // canto superior esquerdo
            { x: 680, y: 480, width: 120, height: 120 } // canto inferior direito
        ],
        enemies: [
            { x: 300, y: 150, radius: 15, dx: 4, dy: 4 },
            { x: 400, y: 200, radius: 15, dx: -3, dy: 5 },
            { x: 600, y: 100, radius: 15, dx: 5, dy: -3 }
        ],
        goal: { x: 750, y: 350, width: 30, height: 30 }
    },
    {
        playerStart: { x: 50, y: 50 },
        platforms: [
            { x: 0, y: 0, width: 120, height: 120 },
            { x: 680, y: 480, width: 120, height: 120 }
        ],
        enemies: [
            { x: 200, y: 150, radius: 15, dx: 5, dy: 4 },
            { x: 300, y: 250, radius: 15, dx: -4, dy: 5 },
            { x: 500, y: 100, radius: 15, dx: 4, dy: -4 }
        ],
        goal: { x: 400, y: 50, width: 30, height: 30 }
    },
    {
        playerStart: { x: 50, y: 50 },
        platforms: [
            { x: 0, y: 0, width: 120, height: 120 },
            { x: 680, y: 480, width: 120, height: 120 }
        ],
        enemies: [
            { x: 350, y: 100, radius: 15, dx: 4, dy: 5 },
            { x: 400, y: 300, radius: 15, dx: -5, dy: 4 },
            { x: 600, y: 200, radius: 15, dx: 5, dy: -5 },
            { x: 700, y: 100, radius: 15, dx: -4, dy: 4 }
        ],
        goal: { x: 700, y: 50, width: 30, height: 30 }
    }
];

export default levels;
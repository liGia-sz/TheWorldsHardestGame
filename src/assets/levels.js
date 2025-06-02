const levels = [
    {
        playerStart: { x: 50, y: 100 },
        platforms: [
            { x: 0, y: 0, width: 800, height: 20 },
            { x: 200, y: 100, width: 150, height: 20 }
        ],
        enemies: [
            { x: 300, y: 150, radius: 15, dx: 2, dy: 2 }
        ],
        goal: { x: 750, y: 350, width: 30, height: 30 }
    },
    {
        playerStart: { x: 50, y: 50 },
        platforms: [
            { x: 0, y: 0, width: 800, height: 20 },
            { x: 100, y: 100, width: 100, height: 20 },
            { x: 200, y: 200, width: 100, height: 20 }
        ],
        enemies: [
            { x: 200, y: 150, radius: 15, dx: 3, dy: 2 }
        ],
        goal: { x: 400, y: 50, width: 30, height: 30 }
    },
    {
        playerStart: { x: 50, y: 50 },
        platforms: [
            { x: 0, y: 0, width: 800, height: 20 },
            { x: 100, y: 100, width: 100, height: 20 },
            { x: 200, y: 150, width: 100, height: 20 },
            { x: 300, y: 200, width: 100, height: 20 }
        ],
        enemies: [
            { x: 350, y: 100, radius: 15, dx: 2, dy: 3 }
        ],
        goal: { x: 700, y: 50, width: 30, height: 30 }
    }
];

export default levels;
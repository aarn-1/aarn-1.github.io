let character;
let obstacles = [];
let running = false;

function startGame() {
    if (!running) {
        running = true;
        initGame();
    }
}

function initGame() {
    character = new Component(10, 10, "red", 40, 40);
    gameArea.start();
}

const gameArea = {
    canvas: document.getElementById("myCanvas"),
    start: function () {
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.key] = (e.type === "keydown");
        })
        window.addEventListener('keyup', function (e) {
            gameArea.keys[e.key] = false;
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
        running = false;
    }
};

function Component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        let ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function (otherObj) {
        const myLeft = this.x;
        const myRight = this.x + (this.width);
        const myTop = this.y;
        const myBottom = this.y + (this.height);
        const otherLeft = otherObj.x;
        const otherRight = otherObj.x + (otherObj.width);
        const otherTop = otherObj.y;
        const otherBottom = otherObj.y + (otherObj.height);
        let crash = true;
        if ((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || (myLeft > otherRight)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    for (let i = 0; i < obstacles.length; i++) {
        if (character.crashWith(obstacles[i])) {
            gameArea.stop();
            return;
        }
    }
    gameArea.clear();

    gameArea.frameNo += 1;
    if (gameArea.frameNo === 1 || everyInterval(75)) {
        let x = gameArea.canvas.width;
        let minHeight = 0;
        let maxHeight = gameArea.canvas.height * 0.8;
        let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        let minGap = gameArea.canvas.height * 0.2;
        let maxGap = gameArea.canvas.height * 0.4;
        let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        obstacles.push(new Component(10, height, "green", x, 0));
        obstacles.push(new Component(10, x - height - gap, "green", x, height + gap));
    }
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x += -2;
        obstacles[i].update();
    }

    character.speedX = 0;
    character.speedY = 0;
    if (gameArea.keys && gameArea.keys['ArrowLeft']) {
        moveLeft();
    }
    if (gameArea.keys && gameArea.keys['ArrowRight']) {
        moveRight();
    }
    if (gameArea.keys && gameArea.keys['ArrowUp']) {
        moveUp();
    }
    if (gameArea.keys && gameArea.keys['ArrowDown']) {
        moveDown();
    }

    character.newPos();
    character.update();

}

// true if gameArea.frameNo is a multiple of n
function everyInterval(n) {
    return (gameArea.frameNo / n) % 1 === 0;
}

function moveUp() {
    character.speedY -= 1;
}

function moveDown() {
    character.speedY += 1;
}

function moveLeft() {
    character.speedX -= 2;
}

function moveRight() {
    character.speedX += 2;
}

function stopMove() {
    character.speedX = 0;
    character.speedY = 0;
}


function fireLaser() {
    const laser = new Audio('laser.mp3');
    laser.play().then(() => null);
}

function getLocation() {
    const x = document.getElementById('location');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                x.innerHTML = 'Latitude: ' + latitude + '<br>Longitude: ' + longitude + '<br>Link: ' +
                    '<a href=\"https://www.google.de/maps/@' + latitude + ',' + longitude + ',16z\">Google Maps</a>';
            },
            () => x.innerHTML = 'Geolocation not available');
    } else {
        x.innerHTML = 'Geolocation is not supported by this browser.';
    }
}

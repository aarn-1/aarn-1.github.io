let character;
let obstacles;
let running = false;

function startGame() {
    if (!running) {
        running = true;
        obstacles = [];
        initGame();
    }
}

function initGame() {
    character = new Component(10, 10, "red", 40, 40);
    field.start();
}

const field = {
    canvas: document.getElementById("myCanvas"),
    start: function () {
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateField, 20);
        window.addEventListener('keydown', function (e) {
            field.keys = (field.keys || []);
            field.keys[e.key] = (e.type === "keydown");
        })
        window.addEventListener('keyup', function (e) {
            field.keys[e.key] = false;
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
        let ctx = field.context;
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

function updateField() {
    for (let i = 0; i < obstacles.length; i++) {
        if (character.crashWith(obstacles[i])) {
            field.stop();
            fireLaser();
            return;
        }
    }
    field.clear();

    field.frameNo += 1;
    if (field.frameNo === 1 || everyInterval(75)) {
        let x = field.canvas.width;
        let minHeight = 0;
        let maxHeight = field.canvas.height * 0.8;
        let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        let minGap = field.canvas.height * 0.2;
        let maxGap = field.canvas.height * 0.4;
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
    if (field.keys && field.keys['ArrowLeft']) {
        moveLeft();
    }
    if (field.keys && field.keys['ArrowRight']) {
        moveRight();
    }
    if (field.keys && field.keys['ArrowUp']) {
        moveUp();
    }
    if (field.keys && field.keys['ArrowDown']) {
        moveDown();
    }

    character.newPos();
    character.update();

}

// true if field.frameNo is a multiple of n
function everyInterval(n) {
    return (field.frameNo / n) % 1 === 0;
}

function moveUp() {
    if (character.y > 0) character.speedY -= 1;
}

function moveDown() {
    if (character.y < field.canvas.height - character.height) character.speedY += 1;
}

function moveLeft() {
    character.speedX -= 2;
}

function moveRight() {
    character.speedX += 2;
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

document.getElementById("year").innerHTML = new Date().getFullYear().toString();
function toggleBackground() {
    let c = document.getElementById("myCanvas").style.backgroundColor;
    if(c === "black") {
        document.getElementById("myCanvas").style.backgroundColor = "white";
    }
    else {
        document.getElementById("myCanvas").style.backgroundColor = "black";
    }
}

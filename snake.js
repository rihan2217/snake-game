// Direction of snake movement
let inputdir = { x: 0, y: 0 };

// Audio files
const start_sound = new Audio('music/music.mp3');
const end_sound = new Audio('music/gameover.mp3');
const food_sound = new Audio('music/food.mp3');
const move_sound = new Audio('music/move.mp3');

let board = document.querySelector(".board");
let highscorebox = document.querySelector(".highscore");
let scoreboard = document.querySelector(".scoreboard");
let snake_speed = document.querySelector(".speed");

let speed = 0.5;
let score = 0;
let lastpainttime = 0;
let snakearr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// Swipe variables for mobile
let touchstartX = 0;
let touchstartY = 0;
const threshold = 50; // Minimum swipe distance

// Initialize highscore
let highscoreval = localStorage.getItem("highscore") ? JSON.parse(localStorage.getItem("highscore")) : 0;
highscorebox.innerHTML = "High Score : " + highscoreval;

// Main game loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastpainttime) / 100 < 1 / speed) return;
    lastpainttime = ctime;
    gameEngine();
}

// Check collisions
function collide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) return true;
    return false;
}

// Game logic
function gameEngine() {
    // Collision
    if (collide(snakearr)) {
        end_sound.play();
        start_sound.pause();
        inputdir = { x: 0, y: 0 };
        alert("Game Over! Press any key or swipe to play again.");
        snakearr = [{ x: 13, y: 15 }];
        score = 0;
        speed = 0.5;
        scoreboard.innerHTML = "Score : 0";
        snake_speed.innerHTML = "Speed : 1";
        start_sound.play();
    }

    // Eating food
    if (snakearr[0].x === food.x && snakearr[0].y === food.y) {
        food_sound.play();
        score++;
        if (score > 2) speed += 0.1;
        if (score > highscoreval) {
            highscoreval = score;
            localStorage.setItem("highscore", JSON.stringify(highscoreval));
            highscorebox.innerHTML = "High Score : " + highscoreval;
        }
        scoreboard.innerHTML = "Score : " + score;
        snake_speed.innerHTML = "Speed : " + Math.round(speed);

        snakearr.unshift({ x: snakearr[0].x + inputdir.x, y: snakearr[0].y + inputdir.y });

        let a = 1, b = 17;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Move snake
    for (let i = snakearr.length - 2; i >= 0; i--) {
        snakearr[i + 1] = { ...snakearr[i] };
    }
    snakearr[0].x += inputdir.x;
    snakearr[0].y += inputdir.y;

    // Display snake
    board.innerHTML = "";
    snakearr.forEach((segment, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    // Display food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Keyboard input (desktop)
window.addEventListener("keydown", e => {
    move_sound.play();
    switch (e.key) {
        case "ArrowUp": inputdir = { x: 0, y: -1 }; break;
        case "ArrowDown": inputdir = { x: 0, y: 1 }; break;
        case "ArrowLeft": inputdir = { x: -1, y: 0 }; break;
        case "ArrowRight": inputdir = { x: 1, y: 0 }; break;
    }
});

// Swipe input (mobile)
document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', e => {
    let touchendX = e.changedTouches[0].screenX;
    let touchendY = e.changedTouches[0].screenY;
    let dx = touchendX - touchstartX;
    let dy = touchendY - touchstartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > threshold) inputdir = { x: 1, y: 0 }; // right
        else if (dx < -threshold) inputdir = { x: -1, y: 0 }; // left
    } else {
        if (dy > threshold) inputdir = { x: 0, y: 1 }; // down
        else if (dy < -threshold) inputdir = { x: 0, y: -1 }; // up
    }
    move_sound.play();
});

// Start the game
start_sound.play();
window.requestAnimationFrame(main);

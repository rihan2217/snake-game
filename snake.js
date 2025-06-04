let inputdir = {
    x: 0,
    y: 0
}


const start_sound=new Audio('music/music.mp3');
const end_sound=new Audio('music/gameover.mp3');
const food_sound=new Audio('music/food.mp3');
const move_sound=new Audio('music/move.mp3');


let board = document.querySelector(".board");
let highscorebox = document.querySelector(".highscore");
let scoreboard = document.querySelector(".scoreboard");
let snake_speed= document.querySelector(".speed");
//const music audio like const movesound = new audio('audio');

let speed = 0.5;
let score = 0;
let lastpainttime = 0;
let snakearr = [
    { x: 13, y: 15 }
];

food = { x: 6, y: 7 };

let start = document.querySelector("#start");


// game function
function main(ctime) {
    window.requestAnimationFrame(main);
    //console.log(ctime);
    if ((ctime - lastpainttime) / 100 < 1 / speed) {
        return;
    }
    lastpainttime = ctime;

    gameEngine();
}

function collide(snake){
    for(let i=1; i<snakearr.length; i++){
        //if u bump into yourself
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // if you bump into the wall
    if(snake[0].x >=18 || snake[0].x <=0 ||snake[0].y >=18 || snake[0].y <=0){
        return true;
    }

    return false;
}

function gameEngine() {
    // part 1 updating snakearr and food---
    if(collide(snakearr)){
        //sound
        end_sound.play();
        //sound pause
        start_sound.pause();
        inputdir={x:0,y:0};
        alert("Game is over press any key to play again");
        snakearr = [{x:13,y:15}];
        //music play
        start_sound.play();

        score=0;
        scoreboard.innerHTML="Score : 0";
        snake_speed.innerHTML="Speed : 1";
        speed=0.5;
    }
    //if snake eat the food increase the size of snake and regenreate the food
    if(snakearr[0].y ===food.y  && snakearr[0].x ===food.x){
        //other work like score and highscore
        food_sound.play();
        score+=1;
        if(score>2 )
        {
            speed +=0.1;
            console.log(speed);
        }
        if(score>highscoreval){
            highscoreval=score;
            localStorage.setItem("high score", JSON.stringify(highscoreval));
            highscorebox.innerHTML="High Score : "+highscoreval;
        }
        scoreboard.innerHTML="Score : "+score;
        snake_speed.innerHTML="Speed : "+Math.round(speed);

        // snake size increase
        snakearr.unshift({x:snakearr[0].x + inputdir.x , y:snakearr[0].y + inputdir.y});

        let a=1;
        let b=17;

        food = {x:Math.round(a+(b-a)*Math.random()), y:Math.round(a+(b-a)*Math.random())}
    }



    //move the snake
    for(let i = snakearr.length-2; i>=0; i--){
        snakearr[i+1] = {...snakearr[i]};
    }

    snakearr[0].x += inputdir.x;
    snakearr[0].y += inputdir.y;




    //part 2 display the snake and food ----
    //display the snake
    board.innerHTML = "";
    snakearr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        //console.log(snakeElement);

        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);

    });
    //display the food

    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}




//main logic start here

window.requestAnimationFrame(main);
//sound play
let highscore = localStorage.getItem("highscore");
if(highscore === null){
    highscoreval = 0;
    localStorage.setItem("High Score : ",JSON.stringify(highscoreval));

}
else{
    highscoreval = JSON.parse(highscore);
    highscorebox.innerHTML = "High Score : "+highscoreval;
}

window.addEventListener("keydown", e => {

    move_sound.play();
    inputdir = { x: 0, y: 0 } //start the game
    //sound move play

    switch(e.key){
        case "ArrowUp":
            console.log("ArrowUp");
            inputdir.x = 0;
            inputdir.y = -1;
            break;
        case "ArrowDown":
            console.log("ArrowDown");
            inputdir.x = 0;
            inputdir.y = 1;
            break;
        case "ArrowLeft":
            console.log("ArrowLeft");
            inputdir.x = -1;
            inputdir.y = 0;
            break;
        case "ArrowRight":
            console.log("ArrowRight");
            inputdir.x = 1;
            inputdir.y = 0;
            break;
    }

});



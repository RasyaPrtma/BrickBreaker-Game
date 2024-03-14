const canvas = document.getElementById('canvas');
canvas.width = 640;
canvas.height = 320;

const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 4;
let dy = -4;

const ballRadius = 10;

function drawBall(){
    ctx.beginPath()
    ctx.arc(x,y,ballRadius,0,Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill()
    ctx.closePath()
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    if( y - ballRadius < 0){
        dy = -dy;
    }else if(y + ballRadius > canvas.height){
        if(x > paddleX  && x < paddleX + paddleWidth){
            dy = -dy;
        }else{
            lives--;
            if(!lives){
                alert("Game Over");
                document.location.reload();
                clearInterval(interval);
            }else{
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 4;
                dy = -4;
                paddleX (canvas.width - paddleWidth) /2;
            }
        }
    }

    if(x + ballRadius > canvas.width || x - ballRadius < 0){
        dx = -dx;
    }
    x += dx;
    y += dy;

    if(right){
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
    }else if(left){
        paddleX = Math.max(paddleX - 7,0);
    }
    drawBricks();
    collisionDetection();
    requestAnimationFrame(animate)
}

function startGame(){
    animate()
}

const start = document.getElementById("start");
start.addEventListener('click',function(){
    startGame()
})

const paddleHeight = 10;
const paddleWidth = 85;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = (canvas.height - paddleHeight);

let right = false;
let left = false;

function drawPaddle(){
    ctx.beginPath()
    ctx.rect(paddleX,paddleY,paddleWidth,paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill()
    ctx.closePath()
}

document.addEventListener('keydown',function(e){
    if(e.key === "Right" || e.key === "ArrowRight"){
        right = true;
    }else if (e.key === "Left" || e.key === "ArrowLeft"){
        left = true;
    }
})

document.addEventListener('keyup',function(e){
    if(e.key === "Right" || e.key === "ArrowRight"){
        right = false;
    }else if (e.key === "Left" || e.key === "ArrowLeft"){
        left = false;
    }
})

document.addEventListener("mousemove",function(e){
    const relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth / 2;
    }
})

function collisionDetection(){
    for(let c = 0;c < brickColumCount; c++){
        for(let r = 0; r < brickRowCount; r++){
            const b = bricks[c][r];
            // calculations
            if(b.status === 2){
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                    dy = -dy;
                    b.status--;
                }
            }else if(b.status === 1){
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                    dy = -dy;
                       b.status = 0;
                    score++;
                    if(score === brickRowCount * brickColumCount){
                        alert("KAMU MENANG,SELAMAT!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

const brickRowCount = 4;
const brickColumCount = 6;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 70;
const bricks = [];

for(let c = 0; c < brickColumCount; c++){
    bricks[c] = [];
    for(let r = 0;r < brickRowCount; r++){
        bricks[c][r] = {x: 0, y: 0, status : 2};
    }
}

function drawBricks(){
    for(let c = 0; c < brickColumCount; c++){
        for(let r = 0; r < brickRowCount; r++){
           if(bricks[c][r].status === 2){
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;

            ctx.beginPath();
            ctx.rect(brickX,brickY,brickWidth,brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath()
           }else if(bricks[c][r].status === 1){
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;

            ctx.beginPath();
            ctx.rect(brickX,brickY,brickWidth,brickHeight);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath()
           }
        }
    }
}

let score = 0;

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`,8,20);
}

let lives = 3;
function drawLives(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives ${lives}`,canvas.width - 65,20);
}
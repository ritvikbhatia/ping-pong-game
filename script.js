var ball = document.getElementById("ball");
var rod1 = document.getElementById("rod1");
var rod2 = document.getElementById("rod2");

const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";
const firstTime="firstTime";
localStorage.setItem(firstTime,true);
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";


let score,
  maxScore,
  movement,
  rod,
  ballSpeedX = 3,
  ballSpeedY = 3;

let gameOn = false;

let windowWidth = window.innerWidth,
  windowHeight = window.innerHeight;

(function () {
  rod = localStorage.getItem(storeName);
  maxScore = localStorage.getItem(storeScore);
  let isFirstTime=localStorage.getItem(firstTime);
  console.log(isFirstTime);
  if (isFirstTime==="true")
    {
    alert("LET'S START \nPress Space or Enter to Start  \nUse A or D for left Right  \nOR \n<--Side Arrows-->");
    maxScore = 0;
    rod = "Rod1";
    localStorage.setItem(firstTime, false);
  } else {
      
    alert(rod + " has maximum score of " + maxScore * 100);
  }

  resetBoard(rod);
})();

function resetBoard(rodName) {
  rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + "px";
  rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + "px";
  ball.style.left = (windowWidth - ball.offsetWidth) / 2 + "px";

  // Lossing player gets the ball
  if (rodName === rod2Name) {
    ball.style.top = rod1.offsetTop + rod1.offsetHeight + "px";
    ballSpeedY = 2;
  } else if (rodName === rod1Name) {
    ball.style.top = rod2.offsetTop - rod2.offsetHeight + "px";
    ballSpeedY = -2;
  }

  score = 0;
  gameOn = false;
}

function storeWin(rod, score) {
  if (score > maxScore) {
    maxScore = score;
    
    localStorage.setItem(storeName, rod);
    localStorage.setItem(storeScore, maxScore);
  }

  clearInterval(movement);
  resetBoard(rod);

  alert(
    rod +
      " wins with a score of " +
      score * 100 +
      ". Max score is: " +
      maxScore * 100
  );
  userScore.play();
}

window.addEventListener("keypress" && "keydown", function () {
  let rodSpeed = 20;
        console.log(" I MA HEre" , event.code);
  let rodRect = rod1.getBoundingClientRect();

  if (
    event.code === "KeyD" ||
    (event.code === "ArrowRight" &&
      rodRect.x + rodRect.width < window.innerWidth)
  ) {
    rod1.style.left = rodRect.x + rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  } else if (
    event.code === "KeyA" ||
    (event.code === "ArrowLeft" && rodRect.x > 0)
  ) {
    rod1.style.left = rodRect.x - rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  }

  if (event.code === "Enter" || event.code==="Space") {
    if (!gameOn) {
      gameOn = true;
      let ballRect = ball.getBoundingClientRect();
      let ballX = ballRect.x;
      let ballY = ballRect.y;
      let ballDia = ballRect.width;

      let rod1Height = rod1.offsetHeight;
      let rod2Height = rod2.offsetHeight;
      let rod1Width = rod1.offsetWidth;
      let rod2Width = rod2.offsetWidth;

      movement = setInterval(function () {
        // Move ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        rod1X = rod1.getBoundingClientRect().x;
        rod2X = rod2.getBoundingClientRect().x;

        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";

        if (ballX + ballDia > windowWidth || ballX < 0) {
          ballSpeedX = -ballSpeedX; // Reverses the direction
                wall.play();
        }

        // It specifies the center of the ball on the viewport
        let ballPos = ballX + ballDia /2;

        // Check for Rod 1
        if (ballY <= rod1Height) {
          ballSpeedY = -ballSpeedY; // Reverses the direction
          score++;
          hit.play();

          // Check if the game ends
          if (ballPos < rod1X || ballPos> rod1X + rod1Width) {
            comScore.play();
            storeWin(rod1Name, score);
            console.log("ballPos11", ballPos);
            console.log("rod2x", rod2X);
            console.log("rod2width", rod2Width);
            storeWin(rod2Name, score);
            // userScore.play();  
          }
        }

        // Check for Rod 2
        else if (ballY + ballDia >= windowHeight - rod2Height) {
          ballSpeedY = -ballSpeedY; // Reverses the direction
          hit.play();
          score++;

          // Check if the game ends
          if (ballPos < rod2X || ballPos > rod2X + rod2Width) {
            comScore.play();
            storeWin(rod1Name, score);
           
            console.log("ballPos", ballPos);
            console.log("rod2x", rod2X);
            console.log("rod2width", rod2Width);

          }
        }
      }, 10);
    }
  }
});

// Calling DOM for rods and ball
var rod1 = document.getElementById("rod1");
var rod2 = document.getElementById("rod2");
var ball = document.getElementById("ball");

const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";

let score,
  maxScore,
  movement,
  rod,
  ballSpeedX = 4,
  ballSpeedY = 4;

//   Initially game stop
let gamestart = false;

// Window width and height
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// Using IIFE
(function () {
  // Score stored at local storage
  rod = localStorage.getItem(storeName);
  maxScore = localStorage.getItem(storeScore);

  //   Check if playing game for first time
  if (rod === "null" || maxScore === "null") {
    alert("This is the first time you are playing this game. LET'S START");
    maxScore = 0;
    rod = "Rod1";
  } else {
    alert(rod + " has maximum score of " + maxScore * 100);
  }
  resetBoard(rod);
})();

// Reset board fn
function resetBoard(rodName) {
  // Initializing/reseting position of ball and rods
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
  gamestart = false;
}

// Checking the winner and storing at local storage
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
}

// Key press controlls for rod
window.addEventListener("keypress", function (event) {
  let SpeedofRod = 15;

  let rodRect = rod1.getBoundingClientRect();

  // Actions taken on press D
  if (event.code === "KeyD" && rodRect.x + rodRect.width < window.innerWidth) {
    rod1.style.left = rodRect.x + SpeedofRod + "px";
    rod2.style.left = rod1.style.left;
  }
  //   Actions taken on pressing A
  else if (event.code === "KeyA" && rodRect.x > 0) {
    rod1.style.left = rodRect.x - SpeedofRod + "px";
    rod2.style.left = rod1.style.left;
  }

  //   Game start on pressing enter
  if (event.code === "Enter") {
    alert("Let Go... Hit Enter to start");
    if (!gamestart) {
      gamestart = true;
      let ballRect = ball.getBoundingClientRect();
      let ballX = ballRect.x;
      let ballY = ballRect.y;
      let ballDia = ballRect.width;

      let rod1Height = rod1.offsetHeight;
      let rod2Height = rod2.offsetHeight;
      let rod1Width = rod1.offsetWidth;
      let rod2Width = rod2.offsetWidth;

      movement = setInterval(function () {
        // Movement of ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        var rod1X = rod1.getBoundingClientRect().x;
        var rod2X = rod2.getBoundingClientRect().x;

        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";

        // Reversing the direction
        if (ballX + ballDia > windowWidth || ballX < 0) {
          ballSpeedX = -ballSpeedX;
        }

        // specifies the center of the ball on the viewport
        let ballPos = ballX + ballDia / 2;

        // Check for Rod 1
        if (ballY <= rod1Height) {
          ballSpeedY = -ballSpeedY; // Reverses the direction
          score++;

          // Check if the game ends
          if (ballPos < rod1X || ballPos > rod1X + rod1Width) {
            storeWin(rod2Name, score);
          }
        }

        // Check for Rod 2
        else if (ballY + ballDia >= windowHeight - rod2Height) {
          ballSpeedY = -ballSpeedY; // Reverses the direction
          score++;

          // Check if the game ends
          if (ballPos < rod2X || ballPos > rod2X + rod2Width) {
            storeWin(rod1Name, score);
          }
        }
      }, 10);
    }
  }
});

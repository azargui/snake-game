// select elements
const board = document.querySelector('.con-3')
const startDiv = document.querySelector('div#startDiv')
const scoreDiv = document.querySelector('#score span')
const bestScoreDiv = document.querySelector('#bestScore span')
const eatAudio = document.querySelector('#eatSound')
const gameOverSound = document.querySelector('#gameOverSound')

// constants
const GRID_SIZE = 25

// variables
let food ,gameIntervall;
let 
    score = 0,
    snake = [{x: 15, y:12}, {x: 15, y:13}],
    direction = 'left',
    newDirection = direction,
    gameDelay = 200,
    gameStart = false;

//get best score
get_best_score()

// get best score from local storage
function get_best_score(){
    const old_best_score = localStorage.getItem('best_score')
    
    if (old_best_score){
        bestScoreDiv.textContent = String(old_best_score).padStart(3,'0')
    }else{
        bestScoreDiv.textContent = '000'
    }
}

// generate food 
function generateFood(){
    while (true){
        let x =Math.floor(Math.random() * GRID_SIZE ) + 1;
        let y = Math.floor(Math.random() * GRID_SIZE ) + 1

        let isOnsnake = snake.some(segment => segment.x === x && segment.y === y)
        if (!isOnsnake){
            return {x, y}
        }
    }
}

// create element
function CreateGameElement(className, tag){
    let createdElement = document.createElement(tag)
    createdElement.className = className
    return createdElement
}

// draw snak
function drawSnake(){
    snake.forEach(segment=>{
        let snakeElement = CreateGameElement('snak', 'div')
        snakeElement.style.gridColumn = segment.x
        snakeElement.style.gridRow = segment.y
        board.appendChild(snakeElement)
    })
}

//draw food
function drawFood(){
    let foodElement = CreateGameElement('food', 'div')
    foodElement.style.gridColumn = food.x
    foodElement.style.gridRow = food.y
    board.appendChild(foodElement)
}

//move snake
function moveSnake(){
    direction = newDirection
    let head = {...snake[0]}
    switch (direction) {
        case 'up':
            if (head.y==1)  head.y = GRID_SIZE
            else head.y--
            break;
        case 'down':
            if (head.y==GRID_SIZE) head.y = 1
            else head.y++
            break;
        case 'right':
            if (head.x==GRID_SIZE) head.x = 1
            else head.x++
            break;
        case 'left':
            if (head.x==1) head.x = GRID_SIZE
            else head.x--
            break;
    };
    snake.unshift(head);
    if (!(food.x == head.x && food.y == head.y)) snake.pop()
    else {
        eatAudio.play()
        food = generateFood()
        clearInterval(gameIntervall)
        gameDelay = Math.max(50, gameDelay - 5) // To avoid game becoming impossibly fast:
        gameIntervall = setInterval(()=>{
            moveSnake()
            draw()
        }, gameDelay)
        score ++
        scoreDiv.textContent = String(score).padStart(3,0)
    }
    
    checkCollision(head)
}

// draw game 
function draw(){
    if (!gameStart){
        return;
    }
    board.innerHTML=''
    drawSnake()
    drawFood()
}

// start the game
function startGame(){
    gameStart = true;
    startDiv.style.display = 'none'
    food = generateFood()
    gameDelay = 200;
    score = 0
    scoreDiv.textContent = String(score).padStart(3,0)
    gameIntervall = setInterval(() => {moveSnake(); draw();}, gameDelay);
}

// check collision
function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOverSound.play()
            gameStart = false
            setTimeout(() => endGame(), 3000)
            return;
        }
    }
}

// end the game
function endGame(){
    clearInterval(gameIntervall)
    removeSnakeFood()
    board.appendChild(startDiv)
    startDiv.style.display = 'flex'
    save_score()
    get_best_score()
}

// remove te snack and food from the board
function removeSnakeFood(){
    snake = [{x: 15, y:12}, {x: 15, y:13}]
    let all = board.querySelectorAll('div.snak, div.food')
    all.forEach(segment => board.removeChild(segment))
}

// save the best score in local storage
function save_score(){
    let old_best_score = localStorage.getItem('best_score')
    if (!old_best_score || +old_best_score < score){
        localStorage.setItem('best_score', score)
    }
}
// key press function
function handleKeyPress(event){
    event.preventDefault()
    if (!gameStart && (event.code == 'Space' || event.key == ' ')){
        startGame()
    }
    else if(gameStart && event.key == 'ArrowUp' && direction != 'down'){
        newDirection = 'up'
    }
    else if(gameStart && event.key == 'ArrowRight' && direction !='left'){
        newDirection = 'right'
    }
    else if(gameStart && event.key == 'ArrowLeft' && direction != 'right'){
        newDirection = 'left'
    }
    else if(gameStart && event.key == 'ArrowDown' && direction != 'up'){
        newDirection = 'down'
    }
}

// receive the key 
document.addEventListener('keydown',(event)=> {handleKeyPress(event)})
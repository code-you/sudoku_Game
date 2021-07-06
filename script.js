//loading boards
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

//create variables

var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function () {
    //run start game function when button is clicked
    id("start-btn").addEventListener("click", startGame);
    //add event listener to each number container
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function () {
            //if selecting is not disable
            if (!disableSelect) {
                //if number is already selected
                if (this.classList.contains("selected")) {
                    //remove selection
                    this.classList.remove("selected");
                    selectedNum = null;
                }
                else {
                    //deselect all other number
                    for (let i = 0; i < 9; i++) {
                        id("number-container").children[i].classList.remove("selected");

                    }
                    //select it and update  selectedNum
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }

}


function startGame() {
    //choose board difficulty
    let board;
    if (id("level-1").checked) board = easy[0];
    else if (id("level-2").checked) board = medium[0];
    else board = hard[0];

    //set lives is 3 and enable selecting numbers and tiles
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining: 3";
    //creates board based on difficulty
    generateBoard(board);
    //start timer
    startTimer();
    //sets theme based on input
    if (id("theme-1").checked) {
        qs("body").classList.remove("dark");
    }
    else {
        qs("body").classList.add("dark");
    }
    //show number container
    id("number-container").classList.remove("hidden");
}

function startTimer() {
    //sets time remaining based on input
    if (id("time-1").checked) timeRemaining = 180;
    else if (id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;

    //sets timer for first seconds
    id("timer").textContent = timeConversion(timeRemaining);
    //sets timer to update every second
    timer = setInterval(function () {
        timeRemaining--;
        //if no time remaining end game
        if (timeRemaining === 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    }, 1000)
}
//convert time into string MM:SS format
function timeConversion(time) {
    let minute = Math.floor(time / 60);
    if (minute < 10) minute = "0" + minute;

    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;

    return minute + ":" + seconds;
}

function generateBoard(board) {
    //clear previous board
    clearPrevious();
    //used to increment tiles id's
    let idCount = 0;
    //create 81 tiles
    for (let i = 0; i < 81; i++) {
        //create new paragraph element
        let tile = document.createElement("p");
        //if tile is supposed to be not blank
        if (board.charAt(i) != "-") {
            //set tile text to correct number
            tile.textContent = board.charAt(i);
        }
        else {
            // add click event listener to tile
            tile.addEventListener("click", function () {
                //if selecting is not disabled
                if (!disableSelect) {
                    //if the tile is already selected
                    if (tile.classList.contains("selected")) {
                        //going to remove selection
                        tile.classList.remove("selected");
                        selectedTile = null;
                    }
                    else {
                        //deselect all other tiles
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        //add selection and update variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });

        }
        tile.id = idCount;
        //increment for next tile
        idCount++;
        //add tile class to all tiles
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("buttomBorder");
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
        //add tile to board
        id("board").appendChild(tile);
    }
}

function updateMove() {
    //if a tile and number is selected
    if (selectedTile && selectedNum) {
        //set the tile to the currect number
        selectedTile.textContent = selectedNum.textContent;
        //if the number matches the corresponding number in the solution key
        if (checkCorrect(selectedTile)) {
            //deselect the tile
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //clear the selected variable as well
            selectedNum = null;
            selectedTile = null;
            //check if board is completed
            if(checkDone()){
                endGame();
            }
            //if the number does not match the solution key

        }
        else {
            //disable selecting number for 1 sec
            disableSelect = true;
            // make the tile turn red
            selectedTile.classList.add("incorrect");
            //run in one second
            setTimeout(function () {
                //subtract lives by one
                lives--;
                //if no lives left end game
                if (lives === 0) {
                    endGame();
                }
                else {
                    //if lives not equal to zero
                    //updates lives text
                    id("lives").textContent = "Lives Remaining: " + lives;
                    // renable selecting number and tiles
                    disableSelect = false;

                }

                //restore tile color and remove selected from both
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");

                //clear tiles text and clear selected variables
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;
            }, 1000);
        }

    }
}

function checkDone(){
     let tiles = qsa(".tile");
     for(let i=0;i<tiles.length;i++){
         if(tiles[i].textContent==="") return false;
     }
     return true;
}


function endGame(){
    //disable moves and stop the timer
    disableSelect = true;
    clearTimeout(timer);
    //display win or lose message
        if(lives === 0 || timeRemaining === 0){
            id("lives").textContent="You Lost!";
        }
        else{
            id("lives").textContent ="You Won!";
        }
}

function checkCorrect(tile) {
    // set solution based on difficulty selection
    let solution;
    if (id("level-1").checked) solution = easy[1];
    else if (id("level-2").checked) solution = medium[1];
    else solution = hard[1];
    //if tiles number is equal to solutions number
    if (solution.charAt(tile.id) === tile.textContent) return true;
    else return false;
}



function clearPrevious() {
    //access all of the tiles
    let tiles = qsa(".tile");

    //remove each tile
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();

    }
    //timer clear these
    if (timer) clearTimeout(timer);

    // deselect any number
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }

    // clear selected variables
    selectedTile = null;
    selectedNum = null;

}








//helper functions

function id(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}


function qsa(selector) {
    return document.querySelectorAll(selector);
}
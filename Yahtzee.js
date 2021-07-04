const numbers = [1, 2, 3, 4, 5, 6];
var dice = []; // to push current dice both set a side and being rolled
var diceInPlay = numbers.slice(0, 5) // dice being rolled
function randomize(array) { // roll the dice and get a random order

    var topfields = document.getElementById("gridContainer").getElementsByClassName("topCell")
    var bottomfields = document.getElementById("gridContainer").getElementsByClassName("bottomCell")
    var i, j, k;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * i)
        k = array[i]
        array[i] = array[j]
        array[j] = k
    }


}




var rollNumber = 1;
var playOptions = []; // what hands can be played based on dice
var diceHeld = []; // dice set aside
var scoreOptions = []; // the score associated with each item in playOptions
var player = 0
var round = 0
var gamepoints = [0, 0];


class Player {
    constructor(ones, twos, threes, fours, fives, sixes, threex, fourx, fh, sstraight, lstraight, yahtzee, chance, ybonus) {
        this.ones = 0;
        this.twos = 0;
        this.threes = 0;
        this.fours = 0;
        this.fives = 0;
        this.sixes = 0;
        this.threex = threex;
        this.fourx = fourx;
        this.fh = fh;
        this.sstraight = sstraight;
        this.lstraight = lstraight;
        this.yahtzee = yahtzee;
        this.chance = chance;
        this.ybonus = ybonus;


    }
    recordPoints() {

        var name = event.target.previousElementSibling.getAttribute("id")
        this[name] = Number(event.target.innerHTML)
        this.ybonus = document.getElementById("ybonus").innerHTML

    }


}
var players = [  // create object for each player
    new Player("ones", "twos", "threes", "fours", "fives", "sixes", "threex", "fourx", "fh", "sstraight", "lstraight", "yahtzee", "chance", "ybonus"),
    new Player("ones", "twos", "threes", "fours", "fives", "sixes", "threex", "fourx", "fh", "sstraight", "lstraight", "yahtzee", "chance", "ybonus")
]



function roll() {
    var cup = document.getElementById("cup")
    cup.style.transform = "rotateZ(45deg)"
    cup.style.transform = "rotateZ(-45deg)"


    playOptions.splice(0, playOptions.length)

    // if(rollNumber == 1) { REMOVE INITIAL DICEINPLAY VALUE AND ADD CONDITION
    //     randomize(numbers) 
    //     diceInPlay = numbers.slice(0,5) // resets to 5 dice is rollNumber equals 1
    // }

    var boardDice = document.getElementById("board").children // the img elements on the board

    for (i = 0; i < diceInPlay.length; i++) {   // rolls the dice only on the board
        randomize(numbers)
        diceInPlay[i] = numbers[i] //better outcomes with i instead of 0
        boardDice[i].src = "" + numbers[i] + ".png"
        boardDice[i].hidden = false

    }
    if (rollNumber == 3) {

        rollNumber = 1
    }
    else {
        rollNumber += 1
    } //increases the roll number
    dice = diceInPlay.concat(diceHeld)
    options() //runs options function to determine what hands have been rolled
    event.target.setAttribute("class", "cup")
}


function options() {
    clear() // runs clear function to clear the socreboard of any opetions from last roll
    var sum = dice[0] + dice[1] + dice[2] + dice[3] + dice[4]
    playOptions.push("chance")
    scoreOptions.push(sum)



    //top section
    var playerBoard = Object.keys(players[player])
    let i;

    for (i = 0; i < dice.length; i++) {

        var contain = document.getElementById("gridContainer").getElementsByClassName("topCell")[dice[i] - 1]

        var cell = contain.nextElementSibling
        var val = Number(cell.innerHTML)


        if (cell.getAttribute("class") == "topCellValue") {

            var newclick = document.createAttribute("onclick")
            newclick.value = "setPoints()"
            cell.innerHTML = val + dice[i]
            cell.setAttributeNode(newclick)

        }
    }

    //check for straights using sort() and filter
    dice.sort()

    var straight = dice.filter(duplicates).filter(filterStraight)

    var pair = dice.filter(pairs)
    var lowest = 0;



    if (straight.length > 3) {
        playOptions.push("sstraight")
        scoreOptions.push(30)

    }
    if (straight.length > 4) {
        playOptions.push("lstraight")
        scoreOptions.push(40)
    }


    //yahtzee/fullhouse
    if (pair.length == 5) {
        if (dice[0] == dice[4]) {
            playOptions.push("yahtzee")
            scoreOptions.push(50)

            playOptions.push("fh")
            scoreOptions.push(25)

        }
        else {

            playOptions.push("fh")
            scoreOptions.push(25)
        }
    }
    console.log(dice)
    var kind = pair.filter(threefour)
    if (kind.length == 1) {
        playOptions.push("threex")
        scoreOptions.push(sum)
    }

    else if (kind.length == 2) {
        playOptions.push("threex")
        scoreOptions.push(sum)
        playOptions.push("fourx")
        scoreOptions.push(sum)
    }
    console.log(kind)
    var cells = document.getElementsByClassName("bottomCellValue")
    for (let i = 0; i < cells.length; i++) {
        var previous = cells[i].previousElementSibling.getAttribute("id")
        if (playOptions.includes(previous)) {
            cells[i].innerHTML = scoreOptions[playOptions.indexOf(previous)]
            var newclick = document.createAttribute("onclick")
            newclick.value = "setPoints()"
            cells[i].setAttributeNode(newclick)
        }


    }

    setTimeout(function () { document.getElementById("cup").style.transform = "rotateZ(0deg)" }, 1000)
}

//three/four of a kind
function duplicates(value, index, array) { // filters out duplicates
    return value != array[index + 1]
}

//filters dice to small and large straight
function filterStraight(value, index, array) {
    // var cond1 = (value + 1 == array[index + 1]) || (value == array[index - 1] + 1)// is 1 greater than previous or 1 less then next
    // var cond2 = value == array[index - 1] + 1 || (value + 1 == array[index] + 1 && value + 2 == array[index + 2])// 
    var cond3 = (value + 2 == array[index + 2]) || (value == array[index - 2] + 2) || (value == array[index - 1] + 1 && value + 1 == array[index + 1])  // is 2 greater than index-2 or 2 less than index+2
    return cond3
}


//filters dice to only numbers with duplicates
function pairs(value, index, array) {
    return array.indexOf(value) != array.lastIndexOf(value)
}

function threefour(value, index, array) {
    return value == array[index + 2]
}

function clear() {
    var cells = document.getElementsByClassName("bottomCellValue")
    var topcells = document.getElementsByClassName("topCellValue")
    playOptions.splice(0, playOptions.length)
    scoreOptions.splice(0, scoreOptions.length)
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = ""
        cells[i].setAttribute("onclick", "scratch()")

    }
    for (let i = 0; i < topcells.length; i++) {
        topcells[i].innerHTML = ""
        topcells[i].setAttribute("onclick", "scratch()")
    }


}
function scratch() {
    event.target.innerHTML = "X"
}

function setPoints() {   //records points at the end of player's turn

    var lastplayer = document.getElementById("playerturn").innerHTML
    var target = event.target
    total()

    var newclass = "points"
    target.setAttribute("class", newclass)
    if (dice.filter(pairs).length == 5 && dice.filter(pairs)[0] == dice.filter(pairs)[4]) {
        document.getElementById("ybonus").innerHTML += 100
    }
    clear()

    players[player].recordPoints()


    diceInPlay = numbers.slice(0, 5)
    diceHeld.splice(0, diceHeld.length)
    resetImg()

    nextTurn()


}


function move() {

    var srcStr = event.target.src
    var dicenumber = Number(srcStr.slice(srcStr.indexOf(".png") - 1, srcStr.indexOf(".png")))
    if (event.target.getAttribute("class") == "boardimg") {
        diceHeld.push(dicenumber)
        diceInPlay.splice(diceInPlay.indexOf(dicenumber), 1)

    }
    else {
        diceInPlay.push(dicenumber)
        diceHeld.splice(diceHeld.indexOf(dicenumber), 1)

    }
    resetImg()
}
function resetImg() {
    var boardImgs = document.getElementById("board").getElementsByTagName("img")
    var diceImgs = document.getElementById("dice").getElementsByTagName("img")
    for (let i = 0; i < 5; i++) {

        diceImgs[i].hidden = true
        diceImgs[i].src = " "
        boardImgs[i].hidden = true
        boardImgs[i].src = " "
        if (diceInPlay.length > i) {
            boardImgs[i].src = "" + diceInPlay[i] + ".png"
            boardImgs[i].hidden = false
        }
        if (diceHeld.length > i) {


            diceImgs[i].src = "" + diceHeld[i] + ".png"
            diceImgs[i].hidden = false
        }


    }

}
// }
function log() {
    var boardDice = document.getElementById("board").children

    // console.log("dice number index " + diceInPlay.indexOf(dicenumber))
    // console.log("srcStr " + srcStr )
    console.log("player " + player)
    console.log("roll numbers " + boardDice[3].src)
    console.log("diceInPLay " + diceInPlay)

    console.log("dice held " + diceHeld)
    console.log("scoreOptions " + scoreOptions)
    console.log("dice " + dice)
    console.log("play options " + playOptions)

}

function total() {
    var lastplayer = document.getElementById("playerturn").innerHTML
    var bottomTotal = 0
    var totalPoints = 0
    var bonus35 = 0
    var topTotal = 0
    var ybonus = 0
    var currentPlayer = players[player]
    var playerBoard = Object.keys(currentPlayer)
    for (let i = 0; i < playerBoard.length; i++) {
        var points = Number(players[player][playerBoard[i]].toString())
        if (i < 6 && points > 0) {
            topTotal += points

        }
        else if (i < 13 && points > 0) {
            bottomTotal += points

        }

        if (players[player].ybonus > 0) {
            ybonus = players[player].ybonus
        }
        console.log(bottomTotal)
        document.getElementById("ttotal").innerHTML = topTotal
        document.getElementById("btotal").innerHTML = bottomTotal + ybonus
        document.getElementById("ybonus").innerHTML = ybonus
        if (topTotal >= 63) {
            document.getElementById("bonus35").innerHTML = 35
            topTotal += 35
        }
        totalPoints = bottomTotal + topTotal
        gamepoints[player] = totalPoints
        document.getElementById("pointtotal").innerHTML = topTotal + bottomTotal
        console.log(Number(points.toString()) * 1)
    }

    document.getElementById("player2").innerHTML = lastplayer
    console.log(lastplayer)
    document.getElementById("playerturn").innerHTML = "Player " + (player + 1) + ": " + (bottomTotal + topTotal)

}


function nextTurn() {
    if (player == 0) {
        player = 1
    }
    else {
        player = 0
    }
    document.getElementById("playerturn").innerHTML = "Player" + (Number(player) + 1)
    var currentBoard = players[player]
    var playerBoard = Object.keys(players[player])
    var cells = document.getElementById("gridContainer").getElementsByClassName("topCell")
    var bcells = document.getElementById("gridContainer").getElementsByClassName("bottomCell")
    for (let i = 0; i < cells.length; i++) {
        var pointCell = cells[i].nextElementSibling
        var cellid = cells[i].getAttribute("id")
        if (currentBoard[cellid] > 0) {
            pointCell.innerHTML = currentBoard[cellid]
            pointCell.setAttribute("class", "points")
        }
        else {
            pointCell.setAttribute("class", "topCellValue")
            pointCell.innerHTML = ""
        }
    }
    for (let i = 0; i < bcells.length; i++) {
        var pointCell = bcells[i].nextElementSibling
        var cellid = bcells[i].getAttribute("id")
        if (currentBoard[cellid] > 0) {
            pointCell.innerHTML = currentBoard[cellid]
            pointCell.setAttribute("class", "points")
        }
        else {
            pointCell.setAttribute("class", "bottomCellValue")
            pointCell.innerHTML = ""
        }
    }
    total()
    if (round == 3 && player == 0) {
        var winner = 0;
        for (let i = 0; i < gamepoints.length; i++) {
            if (gamepoints[i] > gamepoints[i + 1]) {
                winner = i
            }
        }

        document.getElementById("test").innerHTML = "Game Over<br>Player " + (Number(winner) + 1) + " is a winner"
        document.getElementById("test").setAttribute("id", "gameover")
    }
    else if (player == 1) {
        round += 1
    }
    console.log(round)
    console.log(gamepoints)
}

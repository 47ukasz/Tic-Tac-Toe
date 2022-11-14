let playerTurn = true // Player 1 starts 
let allBoardElements, mark, playersScores, modal, modalPlayer, btnNext, btnRestart
let playerOneMoves = []
let playerTwoMoves = []
let playerOneScore = 0
let playerTwoScore = 0
let noOneWins = true
const winningMoves = [
    [1, 2, 3], [1, 4, 7], [1, 5, 9],
    [4, 5, 6], [2, 5, 8], [3, 5, 7],
    [7, 8, 9], [3, 6, 9]
]

const main = () => {
    prepareDOMElements()
    prepareDOMEvents()
}

const prepareDOMEvents = () => {
    allBoardElements.forEach(el => {
        el.addEventListener('click', (e) => {
            handleTurn(e)
            handleDraw()
        })
    });
    btnNext.addEventListener('click', handleNextGame)
    btnRestart.addEventListener('click', handleRestartingGame)
}

const prepareDOMElements = () => {
    allBoardElements = document.querySelectorAll('.board__element')
    playersScores = document.querySelectorAll('.player__score')
    modal = document.querySelector('.modal')
    modalPlayer = modal.querySelector('.modal__text')
    btnNext = modal.querySelector('[data-modal="next"]')
    btnRestart = modal.querySelector('[data-modal="restart"]')
}

const handleTurn = (e) => {

    if (playerTurn) {
        playerOne(e)
    } else {
        playerTwo(e)
    }
    e.target.style.pointerEvents = 'none'
    playerTurn === true ? playerTurn = false : playerTurn = true;
}

const playerOne = (e) => {

    mark = '<i class="fa-solid fa-x"></i>'
    e.target.innerHTML = mark
    playerOneMoves.push(parseInt(e.target.getAttribute('data-board')))
    handleWinning(playerOneMoves)
}

const playerTwo = (e) => {
    mark = '<i class="fa-solid fa-o"></i>'
    e.target.innerHTML = mark
    playerTwoMoves.push(parseInt(e.target.getAttribute('data-board')))
    handleWinning(playerTwoMoves)
}

const handleWinning = (moves) => {
    winningMoves.forEach(el => {
        let k = 0

        moves.forEach(move => {
            if (el.includes(move)) {
                k++
            }

            if (k == 3) {
                playerTurn ? playerOneScore++ : playerTwoScore++
                noOneWins = false
                openModal()
                return 
            }
        })
    })

    playerTurn ? playersScores[0].textContent = playerOneScore : playersScores[1].textContent = playerTwoScore
}

const openModal = () => {
    modal.classList.add('modalActive')

    if (noOneWins) {
        modalPlayer.textContent = `It's a draw!`
    } else {
        modalPlayer.textContent = playerTurn ? 'Player one wins!' : 'Player two wins!'
    }
}

const handleNextGame = () => {
    clearBoard()
}

const handleDraw = (x) => {
    x = 0
    allBoardElements.forEach(el => el.innerHTML !== '' ? x++ : x)

    if(x == 9 && noOneWins){
        openModal()
    }
}

const clearBoard = () => {
    allBoardElements.forEach(el => {
        el.textContent = ''
        el.style.pointerEvents = 'auto'
    })
    playerOneMoves = []
    playerTwoMoves = []
    playerTurn = true
    noOneWins = true
    modal.classList.remove('modalActive')
}

const handleRestartingGame = () => {
    clearBoard()
    playerOneScore = 0
    playerTwoScore = 0
    playersScores.forEach(el => el.textContent = 0)
}

document.addEventListener('DOMContentLoaded', main)
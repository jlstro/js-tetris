document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    
    // define Tretrominoes
    const lTetro = [
        [1, width +1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2+2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetro = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]

    const tTetro = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
    const oTetro = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
    ]

    const iTetro = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
    ]

    const theTetros = [lTetro, tTetro, zTetro, oTetro, iTetro]

    let currentPosition = 4
    let currentRotation = 0

    //randomly select one tetromino
    let random = Math.floor(Math.random()*theTetros.length)
    let current = theTetros[random][currentRotation]

    //draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    //undraw the tetromino in its current rotation
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    //make the tetromino move down every second
    // timerId = setInterval(moveDown, 1000)

    // assign controlls to keys
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }

    }

    document.addEventListener('keyup', control)

    // function to move down
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }
    
    // freeze at the bottom of the grid
    function freeze() {
        if(current.some(index => squares[currentPosition +index +width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // let a new one fall from the top
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetros.length)
            current = theTetros[random][currentRotation] 
            currentPosition = 4
            draw()
            displayShape()
            addScore()
        }
    }
    
    // move left and right 
    function moveLeft() {
        undraw()
        // limit left movement to divs within the grid
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge) currentPosition -= 1
        if(current.some(index => squares[currentPosition +index +width].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }    
    
    function moveRight() {
        undraw()
        // limit right movement to divs within the grid
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
        if(!isAtRightEdge) currentPosition += 1
        if(current.some(index => squares[currentPosition +index +width].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }

    //rotate the tetromino
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetros[random][currentRotation]
        draw()
    }

    //show preview of next tetromino
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    
    
      //the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    //render shape to mini-grid
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
          })
          upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
          })
        //   console.log(nextRandom, displaySquares)
    }

    //add functionality to button
    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown,1000 )
            nextRandom = Math.floor(Math.random()*theTetros.length)
            displayShape()
        }
    })

    //add score coutner
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                })
                const squaresRemoved = squares.splice(i, width)
                console.log(squaresRemoved)
            }
        }
    }



})
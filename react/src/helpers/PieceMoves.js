let gameConstants = require('./GameConstants.js')

let pieceMoves = {

  pawn (color, col, row, boardState, lastMove) {
    let availableSquares = []
    let homeRow = gameConstants.secondRowFor(color)
    let rowStep = gameConstants.forwardStepFor(color)
    let nextRow = row + rowStep

    if (boardState[col][nextRow] == null) {
      availableSquares.push([col, nextRow])
      if (row === homeRow && boardState[col][nextRow + rowStep] == null) {
        availableSquares.push([col, nextRow + rowStep])
      }
    }

    let diagonals = this.pawnDiagonals(color, col, row, boardState)
    diagonals.forEach(square => {
      let occupant = boardState[square[0]][square[1]]
      if (occupant && occupant.color !== color) {
        // TODO: or if the last move was an enemy pawn jumping this square
        availableSquares.push(square)
      }
    })
    return availableSquares
  },

  pawnDiagonals (color, col, row, boardState) {
    let rowStep = gameConstants.forwardStepFor(color)
    let nextRow = row + rowStep
    let diagonals = [
      [col - 1, nextRow],
      [col + 1, nextRow]
    ]
    let attackedSquares = this.filterSquaresOutsideBoard(diagonals)

    return attackedSquares
  },

  king (color, col, row, boardState) {
    let translations = []
    for (let rowShift of [-1, 0, 1]) {
      for (let colShift of [-1, 0, 1]) {
        if (colShift !== 0 || rowShift !== 0) {
          translations.push([colShift, rowShift])
        }
      }
    }
    let possibleSquares = this.convertRelativeToAbsolute(translations, col, row)
    let squaresWithinBoard = this.filterSquaresOutsideBoard(possibleSquares)

    return squaresWithinBoard
  },

  knight (color, col, row, boardState) {
    let translations = []
    for (let xSign of [-1, 1]) {
      for (let ySign of [-1, 1]) {
        translations.push([2 * xSign, ySign])
        translations.push([xSign, 2 * ySign])
      }
    }
    let possibleSquares = this.convertRelativeToAbsolute(translations, col, row)
    let squaresWithinBoard = this.filterSquaresOutsideBoard(possibleSquares)

    return squaresWithinBoard
  },

  queen (color, col, row, boardState) {
    let rookSquares = this.rook(color, col, row, boardState)
    let bishopSquares = this.bishop(color, col, row, boardState)
    let availableSquares = rookSquares.concat(bishopSquares)

    return availableSquares
  },

  rook (color, col, row, boardState) {
    let possibleRow, possibleCol
    let newLane = []
    let outwardLanes = []
    for (possibleRow = row - 1 ; possibleRow >= 0; possibleRow--) {
      newLane.push([col, possibleRow])
    }
    outwardLanes.push(newLane)
    newLane = []
    for (possibleRow = row + 1; possibleRow <= 7; possibleRow++) {
      newLane.push([col, possibleRow])
    }
    outwardLanes.push(newLane)
    newLane = []
    for (possibleCol = col - 1; possibleCol >= 0; possibleCol--) {
      newLane.push([possibleCol, row])
    }
    outwardLanes.push(newLane)
    newLane = []
    for (possibleCol = col + 1; possibleCol <= 7; possibleCol++) {
      newLane.push([possibleCol, row])
    }
    outwardLanes.push(newLane)

    let possibleSquares = this.getSquaresFromLanes(outwardLanes, boardState)

    return possibleSquares
  },

  bishop (color, col, row, boardState) {
    let index
    let diagLanePlus = row + col
    let diagLaneMinus = row - col
    let outwardLanes = []
    let newLane = []
    for (index = col - 1; index >= 0; index--) {
      newLane.push([index, diagLanePlus - index])
    }
    outwardLanes.push(newLane)
    newLane = []
    for (index = col + 1; index <= 7; index++) {
      newLane.push([index, diagLanePlus - index])
    }
    outwardLanes.push(newLane)
    newLane = []
    for (index = col - 1; index >= 0; index--) {
      newLane.push([index, index + diagLaneMinus])
    }
    outwardLanes.push(newLane)
    newLane = []
    for (index = col + 1; index <= 7; index++) {
      newLane.push([index, index + diagLaneMinus])
    }
    outwardLanes.push(newLane)

    outwardLanes = outwardLanes.map(lane => {
      return this.filterSquaresOutsideBoard(lane)
    })

    let possibleSquares = this.getSquaresFromLanes(outwardLanes, boardState)

    return possibleSquares
  },

  //helper methods below

  filterSquaresOutsideBoard (possibleSquares) {
    let squaresWithinBoard = possibleSquares.filter(coords => {
      return (
        coords[0] >= 0 &&
        coords[0] <= 7 &&
        coords[1] >= 0 &&
        coords[1] <= 7
      )
    })
    return squaresWithinBoard
  },

  convertRelativeToAbsolute (translations, col, row) {
    let squares = translations.map(translation => {
      let [colShift, rowShift] = translation
      return [col + colShift, row + rowShift]
    })
    return squares
  },

  getSquaresFromLanes (outwardLanes, boardState) {
    let availableSquares = []
    let truncatedLanes = outwardLanes.map(lane => {
      return this.getOpenPath(lane, boardState)
    })
    truncatedLanes.forEach(lane => {
      lane.forEach(square => {
        availableSquares.push(square)
      })
    })
    return availableSquares
  },

  getOpenPath (pathArray, boardState) {
    let pathLength = pathArray.length
    for (let index = 0; index < pathLength; index++) {
      let [col, row] = pathArray[index]
      let occupant = boardState[col][row]
      if (occupant) {
        pathLength = index + 1
        break
      }
    }
    let openPath = pathArray.slice(0, pathLength)
    return openPath
  }
}

module.exports = pieceMoves

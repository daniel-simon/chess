let getSquares = require('./GetSquares.js')
let checkHelper = require('./CheckHelper.js')

let getLegalSquares = {

  forPiece (col, row, boardState) {
    let origin = [col, row]
    let destinations = getSquares.availableToPiece(...origin, boardState)
    let legalDestinations = destinations.filter(destination => {
      return checkHelper.moveIsLegal(origin, destination, boardState)
    })

    return legalDestinations
  },

  forPlayer (color, boardState) {
    let allPieceCoords = getSquares.getPieceCoordsOfSameColor(color, boardState)
    let allMoves = []
    allPieceCoords.forEach(square => {
      let origin = square
      let destinations = this.forPiece(...origin, boardState)
      destinations.forEach(destination => {
        allMoves.push( [origin, destination] )
      })
    })
    return allMoves
  }

}

module.exports = getLegalSquares

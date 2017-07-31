let squareMethods = {

  sameSquare (squareA, squareB) {
    return (
      squareA[0] === squareB[0] &&
      squareA[1] === squareB[1]
    )
  },

  includesSquare (squaresArray, squareGiven) {
    let included = false
    // squaresArray.forEach(squareListed => {
    for (let testSquare of squaresArray) {
      if (this.sameSquare(squareGiven, testSquare)) {
        included = true
        break
      }
    }
    return included
  },

  toUnique (squaresArray) {
    let uniqueArray = []
    for (let testSquare of squaresArray) {
      if (!this.includesSquare(uniqueArray, testSquare)) {
        uniqueArray.push(testSquare)
      }
    }
    return uniqueArray
  }
}

module.exports = squareMethods

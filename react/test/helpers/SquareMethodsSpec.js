describe('SquareMethods', () => {
  let squareMethods = require('../../src/helpers/SquareMethods.js')
  let randomCoord = () => { Math.floor(Math.random() * 8) }

  describe('sameSquare()', () => {

    it('should always return a boolean', () => {
      let testSquare1 = [randomCoord(), randomCoord()]
      let testSquare2 = [randomCoord(), randomCoord()]
      let result = squareMethods.sameSquare(testSquare1, testSquare2)
      let bool = (result === true || result === false)
      expect(bool).toEqual(true)
    })

    it('should return true for two arrays representing the same square', () => {
      let col = randomCoord()
      let row = randomCoord()
      let testSquare1 = [col, row]
      let testSquare2 = [col, row]
      expect(squareMethods.sameSquare(testSquare1, testSquare2)).toEqual(true)
    })

    it('should return false for two arrays representing different squares', () => {
      let testSquare1 = [2,5]
      let testSquare2 = [5,2]
      expect(squareMethods.sameSquare(testSquare1, testSquare2)).toEqual(false)
    })
  })

  describe("includesSquare", () => {

    let square = [4,6]
    let randomSquare = [randomCoord(), randomCoord()]
    let array = [ [3,6], [7,1], [6,4] ]

    it('should always return a boolean', () => {
      let testArray = array.concat([randomSquare])
      let result = squareMethods.includesSquare(testArray, randomSquare)
      let bool = (result === true || result === false)
      expect(bool).toEqual(true)
    })

    it("should return true if the square argument is included in the array argument", () => {
      let includeArray = array.concat([square])
      let included = squareMethods.includesSquare(includeArray, square)
      expect(included).toEqual(true)
    })

    it("should return false if the square argument isn't included in the array argument", () => {
      let included = squareMethods.includesSquare(array, square)
      expect(included).toEqual(false)
    })
  })

  describe("toUnique", () => {
    let sq1 = [2,5]
    let sq2 = [3,2]
    let sq3 = [4,0]
    let sq4 = [7,7]

    it("should return the same array it was given when all squares are already unique", () => {
      let testArray = [ sq1, sq2, sq3, sq4 ]
      expect(squareMethods.toUnique(testArray)).toEqual(testArray)
    })

    it("should remove duplicate squares from an array", () => {
      let testArray = [ sq1, sq2, sq3, sq4, sq4 ]
      testArray = squareMethods.toUnique(testArray)
      expect(testArray.length).toEqual(4)

      testArray = [ sq1, sq2, sq3, sq3, sq4, sq4, sq4 ]
      testArray = squareMethods.toUnique(testArray)
      expect(testArray.length).toEqual(4)
    })
  })
})

import TestBoard from '../../src/helpers/TestBoard'
let checkHelper = require('../../src/helpers/CheckHelper.js')

describe("CheckHelper", () => {

  describe("kingInCheck()", () => {

    it("should always return a boolean", () => {
      let board = new TestBoard()
      board.addNonPawns()
      let result = checkHelper.kingInCheck('black', board.state)
      let bool = (result === true || result === false)
      expect(bool).toEqual(true)
      board.movePiece( [3,0], [4,1] )

      result = checkHelper.kingInCheck('black', board.state)
      bool = (result === true || result === false)
      expect(bool).toEqual(true)
      board.clearAll()
    })

    it("should return true when the player's king is in an attacked square", () => {
      let board = new TestBoard()
      board.addKingAndRooks()
      board.movePiece( [0,7], [4,6] )
      let whiteInCheck = checkHelper.kingInCheck('white', board.state)
      expect(whiteInCheck).toEqual(true)
      board.clearAll()
    })

    it("should return false when the player's king would be attacked but has a piece in between itself and the attacking piece", () => {
      let board = new TestBoard()
      board.addKingAndRooks()
      board.movePiece( [0,7], [4,6] )
      board.movePiece( [0,0], [4,1] )
      let whiteInCheck = checkHelper.kingInCheck('white', board.state)
      expect(whiteInCheck).toEqual(false)
      let blackInCheck = checkHelper.kingInCheck('black', board.state)
      expect(blackInCheck).toEqual(false)
      board.clearAll()
    })

    it("should return false when the player's king is not in an attacked square", () => {
      let board = new TestBoard()
      board.addPiece('black', 3, 4, 'king')
      board.addPiece('white', 1, 1, 'king')
      let blackInCheck = checkHelper.kingInCheck('black', board.state)
      expect(blackInCheck).toEqual(false)
      let whiteInCheck = checkHelper.kingInCheck('white', board.state)
      expect(whiteInCheck).toEqual(false)
      board.clearAll()
    })
  })

  describe("moveIsLegal()", () => {

    it("should return true for moves that put neither king in check", () => {
      let board = new TestBoard()
      board.addKingAndRooks()
      let testMove = [ [0,0], [2,0], board.state ]
      expect(checkHelper.moveIsLegal(...testMove)).toEqual(true)
      board.clearAll()
    })

    it("should return true for moves that put the enemy king in check", () => {
      let board = new TestBoard()
      board.addKingAndRooks()
      board.movePiece( [0,0], [0,1] )
      let testMove = [ [0,1], [4,1], board.state ]
      expect(checkHelper.moveIsLegal(...testMove)).toEqual(true)
      board.clearAll()
    })

    it("should return false for moves that put both kings in check", () => {
      let board = new TestBoard()
      board.addPiece('black', 3, 3, 'king')
      board.addPiece('white', 5, 5, 'king')
      let testMove1 = [ [5,5], [4,4], board.state ]
      expect(checkHelper.moveIsLegal(...testMove1)).toEqual(false)

      board.addPiece('black', 3, 3, 'king')
      board.addPiece('white', 5, 5, 'king')
      let testMove2 = [ [3,3], [4,4], board.state ]
      expect(checkHelper.moveIsLegal(...testMove2)).toEqual(false)
      board.clearAll()
    })

    it("should return false for a king moving itself into check", () => {
      let board = new TestBoard()
      board.addKingAndRooks()
      board.movePiece( [0,0], [0,1] )
      board.movePiece( [0,1], [3,1] )
      let testMove = [ [4,7], [3,7], board.state ]
      expect(checkHelper.moveIsLegal(...testMove)).toEqual(false)
      board.clearAll()
    })

    it("should return true for a pinned piece moving in a way that doesn't expose its king", () => {
      let board = new TestBoard()
      board.addKingAndRooks()
      board.movePiece( [0,0], [0,1] )
      board.movePiece( [0,7], [0,6] )
      board.movePiece( [0,1], [4,1] )
      board.movePiece( [0,6], [4,6] )
      let testMove = [ [4,6], [4,3], board.state ]
      expect(checkHelper.moveIsLegal(...testMove)).toEqual(true)
      board.clearAll()
    })

    it("should return false for a pinned piece moving in a way that exposes its king", () => {
      let board = new TestBoard()
      board.addKingAndRooks()
      board.movePiece( [0,0], [0,1] )
      board.movePiece( [0,7], [0,6] )
      board.movePiece( [0,1], [4,1] )
      board.movePiece( [0,6], [4,6] )
      let testMove = [ [4,6], [5,6], board.state ]
      expect(checkHelper.moveIsLegal(...testMove)).toEqual(false)
      board.clearAll()
    })
  })
})

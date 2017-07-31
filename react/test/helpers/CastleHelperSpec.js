import TestBoard from '../../src/helpers/TestBoard'

describe('CastleHelper', () => {
  let gameConstants = require('../../src/helpers/GameConstants')
  let castleHelper = require('../../src/helpers/CastleHelper')

  let constants = {
    pieceTypes: ['pawn','knight','rook','bishop','king','queen'],
    colors: ['white','black']
  }

  describe("kingHasNotMoved()", () => {

    it("should return true for both players when no pieces have moved", () => {
      let board = new TestBoard('addNonPawns')
      constants.colors.forEach(player => {
        let kingHasNotMoved = castleHelper.kingHasNotMoved(board.moveHistory, player)
        expect(kingHasNotMoved).toEqual(true)
        board.clearAll()
      })
    })

    it("should return true for a player when they've only moved pieces other than their king", () => {
      let board = new TestBoard('addNonPawns')
      board.movePiece( [3,0], [2,1] )
      board.movePiece( [3,7], [2,6] )
      board.movePiece( [0,0], [0,1] )
      board.movePiece( [0,7], [0,5] )
      constants.colors.forEach(player => {
        let kingHasNotMoved = castleHelper.kingHasNotMoved(board.moveHistory, player)
        expect(kingHasNotMoved).toEqual(true)
        board.clearAll()
      })
    })

    it("should return false for a player whose king has moved", () => {
      let board = new TestBoard('addNonPawns')
      board.movePiece( [4,0], [4,1] )
      board.movePiece( [4,7], [4,6] )
      constants.colors.forEach(player => {
        let kingHasNotMoved = castleHelper.kingHasNotMoved(board.moveHistory, player)
        expect(kingHasNotMoved).toEqual(false)
        board.clearAll()
      })
    })

    it("should return true for a player when the given move history contains the other player's king moving but not their own", () => {
      constants.colors.forEach(player => {
        let board = new TestBoard('addNonPawns')
        let enemyRow = gameConstants.firstRowFor(gameConstants.enemyOf(player))
        let enemyStep = gameConstants.forwardStepFor(gameConstants.enemyOf(player))
        board.movePiece( [4, enemyRow], [4, enemyRow + enemyStep] )
        let kingHasNotMoved = castleHelper.kingHasNotMoved(board.moveHistory, player)
        expect(kingHasNotMoved).toEqual(true)
        board.clearAll()
      })
    })
  })

  describe("rookHasNotMoved()", () => {

    it("should return true for both players when no pieces have moved", () => {
      let board = new TestBoard('addNonPawns')
      constants.colors.forEach(player => {
        let rookHasNotMoved = castleHelper.rookHasNotMoved(board.moveHistory, player)
        expect(rookHasNotMoved).toEqual(true)
        board.clearAll()
      })
    })

    it("should return true for a player when they've only moved pieces other than the rook in question", () => {
      constants.colors.forEach(player => {
        let row = gameConstants.firstRowFor(player)
        let rowStep = gameConstants.forwardStepFor(player)
        let board = new TestBoard('addNonPawns', player)
        board.movePiece( [4, row], [4, row + rowStep] )
        board.movePiece( [0, row], [0, row + rowStep] )
        board.movePiece( [3, row], [3, row + rowStep] )
        let rookHasNotMoved = castleHelper.rookHasNotMoved(board.moveHistory, player, 7)
        expect(rookHasNotMoved).toEqual(true)
        board.clearAll()
      })
    })

    it("should return false for a player whose rook in question has moved", () => {
      constants.colors.forEach(player => {
        let row = gameConstants.firstRowFor(player)
        let rowStep = gameConstants.forwardStepFor(player)
        let board = new TestBoard('addKingAndRooks', player)
        board.movePiece( [7, row], [7, row + rowStep] )
        let rookHasNotMoved = castleHelper.rookHasNotMoved(board.moveHistory, player, 7)
        expect(rookHasNotMoved).toEqual(false)
        board.clearAll()
      })
    })

    it("should return true for a player when the given move history contains the other player's rook in question moving but not their own", () => {
      constants.colors.forEach(player => {
        let board = new TestBoard('addKingAndRooks')
        let enemyRow = gameConstants.firstRowFor(gameConstants.enemyOf(player))
        let enemyStep = gameConstants.forwardStepFor(gameConstants.enemyOf(player))
        board.movePiece( [7, enemyRow], [7, enemyRow + enemyStep] )
        let rookHasNotMoved = castleHelper.rookHasNotMoved(board.moveHistory, player, 0)
        expect(rookHasNotMoved).toEqual(true)
        board.clearAll()
      })
    })
  })

  describe("getAvailableCastlingRooks", () => {

    it("should return the rook in either corner when the board is empty except for a king and two rooks that haven't moved", () => {
      let board = new TestBoard('addKingAndRooks', 'white')
      let availableCastlingRooks = castleHelper.getAvailableCastlingRooks(board.moveHistory, 'white', board.state)
      expect(availableCastlingRooks).toContain( [0,0] )
      expect(availableCastlingRooks).toContain( [7,0] )
      expect(availableCastlingRooks.length).toEqual(2)
      board.clearAll()
    })

    it("should only return a rook if it hasn't moved", () => {
      let board = new TestBoard('addKingAndRooks', 'white')
      board.movePiece( [0,0], [0,1] )
      board.movePiece( [0,1], [0,0] )
      expect(board.state[0][0]).toEqual({ type: 'rook', color: 'white' })
      let availableCastlingRooks = castleHelper.getAvailableCastlingRooks(board.moveHistory, 'white', board.state)
      expect(availableCastlingRooks).not.toContain( [0,0] )
      expect(availableCastlingRooks).toContain( [7,0] )
      expect(availableCastlingRooks.length).toEqual(1)
      board.clearAll()
    })

    it("should not return any rooks if the king has moved", () => {
      let board = new TestBoard('addKingAndRooks', 'white')
      board.movePiece( [4,0], [4,1] )
      board.movePiece( [4,1], [4,0] )
      expect(board.state[4][0]).toEqual({ type: 'king', color: 'white' })
      let availableCastlingRooks = castleHelper.getAvailableCastlingRooks(board.moveHistory, 'white', board.state)
      expect(availableCastlingRooks.length).toEqual(0)
      board.clearAll()
    })

    it("should only return a rook that hasn't moved if it's it hasn't been captured", () => {
      let board = new TestBoard('addKingAndRooks')
      board.addPiece('white', 1, 0, 'knight')
      expect(board.state[0][0]).toEqual({ type: 'rook', color: 'white' })
      board.movePiece( [0,7], [0,0] )
      expect(board.state[0][0]).toEqual({ type: 'rook', color: 'black' })
      let availableCastlingRooks = castleHelper.getAvailableCastlingRooks(board.moveHistory, 'white', board.state)
      expect(availableCastlingRooks).not.toContain( [0,0] )
      expect(availableCastlingRooks).toContain( [7,0] )
      expect(availableCastlingRooks.length).toEqual(1)
      board.clearAll()
    })

    it("should not return any squares if the king is in check", () => {
      let board = new TestBoard('addKingAndRooks', 'white')
      board.addPiece('black', 4, 1, 'rook')
      let availableCastlingRooks = castleHelper.getAvailableCastlingRooks(board.moveHistory, 'white', board.state)
      expect(availableCastlingRooks.length).toEqual(0)
      board.clearAll()
    })

    it("should not return an otherwise available castling rook if the king would move through an attacked square", () => {
      let board = new TestBoard('addKingAndRooks', 'white')
      board.addPiece('black', 5, 2, 'rook')
      let availableCastlingRooks = castleHelper.getAvailableCastlingRooks(board.moveHistory, 'white', board.state)
      expect(availableCastlingRooks).not.toContain( [7,0] )
      expect(availableCastlingRooks).toContain( [0,0] )
      expect(availableCastlingRooks.length).toEqual(1)

      board = new TestBoard('addKingAndRooks', 'white')
      board.addPiece('black', 2, 2, 'rook')
      availableCastlingRooks = castleHelper.getAvailableCastlingRooks(board.moveHistory, 'white', board.state)
      expect(availableCastlingRooks).not.toContain( [0,0] )
      expect(availableCastlingRooks).toContain( [7,0] )
      expect(availableCastlingRooks.length).toEqual(1)

      board = new TestBoard('addKingAndRooks', 'white')
      board.addPiece('black', 4, 2, 'bishop')
      availableCastlingRooks = castleHelper.getAvailableCastlingRooks(board.moveHistory, 'white', board.state)
      expect(availableCastlingRooks.length).toEqual(0)
      board.clearAll()
    })

    it("should not return a rook if the path between rook and king isn't open", () => {
      let board = new TestBoard('addKingAndRooks', 'white')
      board.addPiece('white', 5, 0, 'bishop')
      let availableCastlingRooks = castleHelper.getAvailableCastlingRooks(board.moveHistory, 'white', board.state)
      expect(availableCastlingRooks).not.toContain( [7,0] )
      expect(availableCastlingRooks).toContain( [0,0] )
      expect(availableCastlingRooks.length).toEqual(1)

      board = new TestBoard('addKingAndRooks', 'white')
      board.addPiece('white', 2, 0, 'bishop')
      availableCastlingRooks = castleHelper.getAvailableCastlingRooks(board.moveHistory, 'white', board.state)
      expect(availableCastlingRooks).not.toContain( [0,0] )
      expect(availableCastlingRooks).toContain( [7,0] )
      expect(availableCastlingRooks.length).toEqual(1)

      board = new TestBoard('addKingAndRooks', 'white')
      board.addPiece('white', 5, 0, 'bishop')
      board.addPiece('white', 2, 0, 'bishop')
      availableCastlingRooks = castleHelper.getAvailableCastlingRooks(board.moveHistory, 'white', board.state)
      expect(availableCastlingRooks.length).toEqual(0)
      board.clearAll()
    })
  })
})

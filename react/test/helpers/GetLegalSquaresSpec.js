import TestBoard from '../../src/helpers/TestBoard'
let getLegalSquares = require('../../src/helpers/GetLegalSquares.js')

describe("getLegalSquares", () => {

  describe("forPiece()", () => {

    it("should not return any squares for a bishop pinned by a rook", () => {
      let board = new TestBoard()
      board.clearAll()
      board.addPiece('white', 4, 0, 'king')
      board.addPiece('white', 4, 3, 'bishop')
      board.addPiece('black', 4, 4, 'rook')
      let bishopSquares = getLegalSquares.forPiece(4, 3, board.state)
      expect(bishopSquares.length).toEqual(0)
      board.clearAll()
    })

    it("should return vertical squares for a rook pinned vertically by a rook", () => {
      let board = new TestBoard()
      board.clearAll()
      board.addPiece('white', 4, 0, 'king')
      board.addPiece('white', 4, 1, 'rook')
      board.addPiece('black', 4, 7, 'rook')
      let rookSquares = getLegalSquares.forPiece(4, 1, board.state)
      expect(rookSquares).toContain([4,2], [4,3], [4,4], [4,5], [4,6], [4,7])
      board.clearAll()
    })

    it("should not return horizontal squares for a rook pinned vertically by a rook", () => {
      let board = new TestBoard()
      board.clearAll()
      board.addPiece('white', 4, 0, 'king')
      board.addPiece('white', 4, 1, 'rook')
      board.addPiece('black', 4, 7, 'rook')
      let rookSquares = getLegalSquares.forPiece(4, 1, board.state)
      expect(rookSquares).not.toContain([0,1])
      expect(rookSquares).not.toContain([1,1])
      expect(rookSquares).not.toContain([2,1])
      expect(rookSquares).not.toContain([3,1])
      expect(rookSquares).not.toContain([5,1])
      expect(rookSquares).not.toContain([6,1])
      expect(rookSquares).not.toContain([7,1])
      board.clearAll()
    })

    it("should not return otherwise available capture moves for a veritcally pinned pawn", () => {
      let board = new TestBoard()
      board.clearAll()
      board.addPiece('white', 4, 0, 'king')
      board.addPiece('white', 4, 1, 'pawn')
      board.addPiece('black', 5, 2, 'queen')
      let pawnSquares = getLegalSquares.forPiece(4, 1, board.state)
      expect(pawnSquares).toContain([5,2])
      board.addPiece('black', 4, 5, 'rook')
      pawnSquares = getLegalSquares.forPiece(4, 1, board.state)
      expect(pawnSquares).not.toContain([5,2])
      board.clearAll()
    })
  })

  describe("forPlayer()", () => {

    it("should return two moves from the same origin for a pawn in its home row and no other pieces on the board", () => {
      let board = new TestBoard()
      board.addPiece('black', 3, 6, 'pawn')
      let allBlackMoves = getLegalSquares.forPlayer('black', board.state)
      let origins = []
      allBlackMoves.forEach(move => {
        origins.push(move[0])
      })
      expect(allBlackMoves.length).toEqual(2)
      expect(origins[0]).toEqual(origins[1])
      board.clearAll()
    })

    it("should return no moves for a victim of the four move checkmate", () => {
      let board = new TestBoard()
      board.addNonPawns()
      board.addPawns()
      board.movePiece( [4,6], [4,5] )
      board.movePiece( [5,7], [2,4] )
      board.movePiece( [3,7], [5,5] )
      board.movePiece( [5,5], [5,1] )
      let allWhiteMoves = getLegalSquares.forPlayer('white', board.state)
      expect(allWhiteMoves.length).toEqual(0)
      board.clearAll()
    })

    it("should return no moves for a victim of a two-rook endgame checkmate", () => {
      let board = new TestBoard()
      board.addPiece('white', 3, 0, 'king')
      board.addPiece('black', 0, 0, 'rook')
      board.addPiece('black', 7, 1, 'rook')

      let allWhiteMoves = getLegalSquares.forPlayer('white', board.state)
      expect(allWhiteMoves.length).toEqual(0)
      board.clearAll()
    })

    it("should return one move for a misplayed two-rook checkmate in which the king can capture one of the rooks", () => {
      let board = new TestBoard()
      board.addPiece('white', 3, 0, 'king')
      board.addPiece('black', 0, 0, 'rook')
      board.addPiece('black', 4, 1, 'rook')

      let allWhiteMoves = getLegalSquares.forPlayer('white', board.state)
      expect(allWhiteMoves).toEqual( [ [ [3,0], [4,1] ] ] )
      board.clearAll()
    })

    it("should return no moves for a stalemated king", () => {
      let board = new TestBoard()
      board.addPiece('white', 3, 0, 'king')
      board.addPiece('black', 2, 5, 'rook')
      board.addPiece('black', 4, 5, 'rook')
      board.addPiece('black', 0, 1, 'queen')

      let allWhiteMoves = getLegalSquares.forPlayer('white', board.state)
      expect(allWhiteMoves.length).toEqual(0)
      board.clearAll()
    })

    it("should return no moves for a checkmated king attacked by a knight and boxed in by its own pieces", () => {
      let board = new TestBoard()
      board.addPiece('white', 7, 0, 'king')
      board.addPiece('white', 7, 1, 'pawn')
      board.addPiece('black', 6, 3, 'rook')
      board.addPiece('black', 5, 1, 'knight')

      let allWhiteMoves = getLegalSquares.forPlayer('white', board.state)
      expect(allWhiteMoves.length).toEqual(0)
      board.clearAll()
    })

    it("should return one move when the only way to escape check is to capture the attacking piece", () => {
      let board = new TestBoard()
      board.addPiece('white', 7, 0, 'king')
      board.addPiece('white', 7, 1, 'pawn')
      board.addPiece('white', 6, 0, 'bishop')
      board.addPiece('black', 6, 3, 'rook')
      board.addPiece('black', 5, 1, 'knight')

      let allWhiteMoves = getLegalSquares.forPlayer('white', board.state)
      expect(allWhiteMoves).toEqual( [ [ [6,0], [5,1] ] ] )
      board.clearAll()
    })

    it("should return one move when the only way to escape check is to obstruct the attacking piece", () => {
      let board = new TestBoard()
      board.addPiece('white', 7, 0, 'king')
      board.addPiece('white', 6, 0, 'knight')
      board.addPiece('black', 7, 7, 'rook')
      board.addPiece('black', 6, 7, 'rook')

      let allWhiteMoves = getLegalSquares.forPlayer('white', board.state)
      expect(allWhiteMoves).toEqual( [ [ [6,0], [7,2] ] ] )
      board.clearAll()
    })

    it("should return no moves when the only way to escape check is to obstruct the attacking piece, but no such piece can make that move", () => {
      let board = new TestBoard()
      board.addPiece('white', 7, 0, 'king')
      board.addPiece('white', 6, 0, 'pawn')
      board.addPiece('black', 7, 7, 'rook')
      board.addPiece('black', 6, 7, 'rook')

      let allWhiteMoves = getLegalSquares.forPlayer('white', board.state)
      expect(allWhiteMoves.length).toEqual(0)
      board.clearAll()
    })
  })
})

let gameConstants = require('../../src/helpers/GameConstants')
import BoardInterface from '../../src/containers/BoardInterface'

describe('BoardInterface', () => {
  let wrapper
  let boardState = [
    [],[],[],[],[],[],[],[]
  ]
  for (let col = 0; col <= 7; col++) {
    for (let row = 0; row <= 7; row++) {
      boardState[col][row] = null
    }
  }

  ['white','black'].forEach(color => {
    for (let col = 0; col <= 7; col++) {
      let pawnHome = gameConstants.secondRowFor(color)
      boardState[col][pawnHome] = {
        type: 'pawn',
        color: color
      }
    }
    let home = gameConstants.firstRowFor(color)
    boardState[0][home] = boardState[7][home] = {
      type: 'rook',
      color: color
    }
    boardState[1][home] = boardState[6][home] = {
      type: 'knight',
      color: color
    }
    boardState[2][home] = boardState[5][home] = {
      type: 'bishop',
      color: color
    }
    boardState[3][home] = {
      type: 'queen',
      color: color
    }
    boardState[4][home] = {
      type: 'king',
      color: color
    }
  })

  beforeEach(() => {
    wrapper = shallow(
      <BoardInterface
        boardState={boardState}
        moveHistory={[]}
      />
    )
  })

  it('should have the specified initial state', () => {
    expect(wrapper.state()).toEqual({
      selectedSquare: [],
      availableSquares: [],
      availableCastlingRooks: [],
      activeColor: 'white'
    })
  })

  describe("selectPiece()", () => {
    let randomCoord = (range) => { return(Math.floor(Math.random() * range)) }
    let randomSquare = () => { return( [randomCoord(8), randomCoord(8)] ) }

    it("should set this.state.selectedSquare to its arguments", () => {
      let [col, row] = [4, 1]
      do {
        [col, row] = randomSquare()
      } while (boardState[col][row] == null)
      wrapper.instance().selectPiece(col, row)
      expect(wrapper.state().selectedSquare).toEqual([col, row])
    })

    it("should set this.state.availableSquares to the squares available to the piece on that square", () => {
      let col = randomCoord(8)
      wrapper.instance().selectPiece(col, 1)
      expect(wrapper.state().availableSquares).toEqual( [ [col, 2], [col, 3] ] )

      col = randomCoord(8)
      wrapper.instance().selectPiece(col, 6)
      expect(wrapper.state().availableSquares).toEqual( [ [col, 5], [col, 4] ] )

      wrapper.instance().selectPiece(1, 0)
      expect(wrapper.state().availableSquares).toEqual( [ [0, 2], [2, 2] ] )
    })

    it("should set this.state.availableCastlingRooks to the squares containing rooks available to castle", () => {
      boardState[1][0] = null
      boardState[2][0] = null
      boardState[3][0] = null
      boardState[5][0] = null
      boardState[6][0] = null

      wrapper = shallow(
        <BoardInterface
          boardState={boardState}
          moveHistory={[]}
        />
      )
      wrapper.instance().selectPiece(4, 0)
      expect(wrapper.state().availableCastlingRooks).toEqual( [ [0, 0], [7, 0] ] )
    })

  })


})

describe('GetSquares', () => {
  let getSquares = require('../../src/helpers/GetSquares.js')

  let board = {
    state: [
      [],[],[],[],[],[],[],[]
    ],

    clearAll() {
      for (let col = 0; col <= 7; col++) {
        for (let row = 0; row <= 7; row++) {
          this.state[col][row] = null
        }
      }
    },

    clearSquare(col, row) {
      this.state[col][row] = null
    },

    addPiece(color, col, row, type) {
      this.state[col][row] = {
        type: type,
        color: color
      }
    }
  }
  board.clearAll();

  let helpers = {
    sameSquare(squareA, squareB) {
      return (
        squareA[0] == squareB[0] &&
        squareA[1] == squareB[1]
      )
    },

    includesSquare(squaresArray, squareGiven) {
      let included = false;
      squaresArray.forEach(squareListed => {
        if (this.sameSquare(squareGiven, squareListed)) {
          included = true;
        }
      })
      return (included)
    },

    toUnique(squaresArray) {
      let uniqueArray = [];
      let uniqueSquare;
      squaresArray.forEach((square, index, array) => {
        if (!this.includesSquare(uniqueArray, square)) {
          uniqueArray.push(square);
        }
      })
      return (uniqueArray)
    }
  }

  let constants = {
    pawnHome(color) { return ((color == 'white') ? 1 : 6) },
    pawnStep(color) { return ((color == 'white') ? 1 : -1) },
    enemyOf(color) { return ((color == 'white') ? 'black' : 'white') },
    pieceTypes: ['pawn','knight','rook','bishop','king','queen'],
    colors: ['white','black']
  }

  let randomCoord = (scale = 8, offset = 0) => { return (Math.floor(Math.random() * scale) + offset) }
  let randomSquare = (xScale = 8, yScale = 8, xOffset = 0, yOffset = 0) => {

    return [randomCoord(xScale, xOffset), randomCoord(yScale, yOffset)]
  }

  beforeEach(() => {
    board.clearAll()
  })

  describe('availableToPiece()', () => {

    describe("for any piece", () => {

      it('should always return an array', () => {
        constants.pieceTypes.forEach(type => {
          for (let row = 0; row <= 7; row++) {
            for (let col = 0; col <= 7; col++) {
              let square = [col, row]
              board.addPiece('white', ...square, type)
              let availableSquares = getSquares.availableToPiece(...square, board.state)
              expect(typeof(availableSquares)).toEqual('object')
              expect(availableSquares.length).toBeDefined()
              board.clearAll()
            }
          }
        })
      })

      it('should always return an array whose elements are arrays of length 2', () => {
        constants.pieceTypes.forEach(type => {
          for (let row = 0; row <= 7; row++) {
            for (let col = 0; col <= 7; col++) {
              let square = [col, row]
              board.addPiece('black', ...square, type)
              let availableSquares = getSquares.availableToPiece(...square, board.state)
              availableSquares.forEach(square => {
                expect(typeof(square)).toEqual('object')
                expect(square.length).toEqual(2)
              })
              board.clearAll()
            }
          }
        })
      })

      it("should never return squares occupied by allied pieces", () => {
        let testSquare = [4,4]
        let alliedSquares = [ [2,2], [3,3], [3,5], [5,6], [3,4], [3,2], [3,6], [4,5], [2,4], [4,1] ]
        alliedSquares.forEach(square => {
          let allyType = constants.pieceTypes[ Math.floor(Math.random() * 6) ]
          board.addPiece('black', ...square, allyType)
        })
        constants.pieceTypes.forEach(type => {
          board.addPiece('black', ...testSquare, type)
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          alliedSquares.forEach(alliedSquare => {
            expect(availableSquares).not.toContain(alliedSquare)
          })
        })
        board.clearAll()
      })

      it("should never return the same square that the piece is on", () => {
        for (let col = 0; col <= 7; col++) {
          for (let row = 0; row <= 7; row++) {
            let testSquare = [col, row]
            constants.pieceTypes.forEach(type => {
              let color = ['white','black'][Math.floor(Math.random() * 2)]
              board.addPiece(color, ...testSquare, type)
              let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
              expect(availableSquares).not.toContain(testSquare)
            })
          }
        }
      })
    })

    describe("for a pawn", () => {

      it("should not return any squares when the square in front of the pawn is occupied by any piece and the diagonals are vacant", () => {
        constants.colors.forEach(color => {
          for (let rowShift = 0; rowShift <= 2; rowShift++) {
            let col = 3
            let row = constants.pawnHome(color) + rowShift
            let testSquare = [col, row]
            let blockingSquare = [col, row + constants.pawnStep(color)]
            board.addPiece(color, ...testSquare, 'pawn')
            board.addPiece('white', ...blockingSquare, 'rook')
            let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
            expect(availableSquares.length).toEqual(0)
            board.clearAll()
          }
        })
      })

      describe("in its home row", () => {

        it("should only return the two squares in front of the pawn with no other pieces on the board", () => {
          constants.colors.forEach(color => {
            let col = 3
            let row = constants.pawnHome(color)
            board.addPiece(color, col, row, 'pawn')
            let availableSquares = getSquares.availableToPiece(col, row, board.state)
            expect(availableSquares).toContain([col, row + constants.pawnStep(color)])
            expect(availableSquares).toContain([col, row + constants.pawnStep(color) * 2])
            expect(availableSquares.length).toEqual(2)
            board.clearAll()
          })
        })

        it("should return the two squares in front and both diagonals when enemy pieces occupy the diagonals", () => {
          constants.colors.forEach(color => {
            let pawnSquare = [3, constants.pawnHome(color)]
            let enemySquares = [ [2, constants.pawnHome(color) + constants.pawnStep(color)], [4, constants.pawnHome(color) + constants.pawnStep(color)] ]
            board.addPiece(color, ...pawnSquare, 'pawn')
            enemySquares.forEach(square => {
              board.addPiece(constants.enemyOf(color), ...square, 'knight')
            })
            let availableSquares = getSquares.availableToPiece(...pawnSquare, board.state)
            expect(availableSquares).toContain([3, constants.pawnHome(color) + constants.pawnStep(color)])
            expect(availableSquares).toContain([3, constants.pawnHome(color) + constants.pawnStep(color) * 2])
            expect(availableSquares).toContain([2, constants.pawnHome(color) + constants.pawnStep(color)])
            expect(availableSquares).toContain([4, constants.pawnHome(color) + constants.pawnStep(color)])
            expect(availableSquares.length).toEqual(4)
            board.clearAll()
          })
        })

        it("should return the two squares in front and only the diagonal occupied by an enemy", () => {
          constants.colors.forEach(color => {
            let pawnSquare = [3, constants.pawnHome(color)]
            let allyDiagonal =  [2, constants.pawnHome(color) + constants.pawnStep(color)]
            let enemySquare =  [4, constants.pawnHome(color) + constants.pawnStep(color)]
            board.addPiece(color, ...pawnSquare, 'pawn')
            board.addPiece(color, ...allyDiagonal, 'king')
            board.addPiece(constants.enemyOf(color), ...enemySquare, 'knight')
            let availableSquares = getSquares.availableToPiece(...pawnSquare, board.state)
            expect(availableSquares).toContain([3, constants.pawnHome(color) + constants.pawnStep(color)])
            expect(availableSquares).toContain([3, constants.pawnHome(color) + constants.pawnStep(color) * 2])
            expect(availableSquares).toContain(enemySquare)
            expect(availableSquares).not.toContain(allyDiagonal)
            expect(availableSquares.length).toEqual(3)
            board.clearAll()
          })
        })

        it("should return only the square in front of the pawn when the second square in front of it is occupied by any piece", () => {
          constants.colors.forEach(color => {
            for (let col = 0; col <= 7; col++) {
              let row = constants.pawnHome(color)
              let testSquare = [col, row]
              board.addPiece(color, ...testSquare, 'pawn')

              board.addPiece('white', col, row + constants.pawnStep(color) * 2, 'bishop')
              let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
              expect(availableSquares).toContain([col, row + constants.pawnStep(color)])
              expect(availableSquares.length).toEqual(1)

              board.clearAll()
            }
          })
        })
      })

      describe("that isn't in its home row", () => {

        it("should only return the square in front of the pawn with no other pieces on the board", () => {
          let square = [3,5]
          constants.colors.forEach(color => {
            board.addPiece(color, ...square, 'pawn')
            let availableSquares = getSquares.availableToPiece(...square, board.state)
            expect(availableSquares).toContain([3, 5 + constants.pawnStep(color)])
            board.clearAll()
          })
        })

        it("should return the square in front and both diagonals when enemy pieces occupy the diagonals", () => {
          constants.colors.forEach(color => {
            board.clearAll()
            let pawnSquare = [3, 4]
            let enemySquares = [ [2, 4 + constants.pawnStep(color)], [4, 4 + constants.pawnStep(color)] ]
            board.addPiece(color, ...pawnSquare, 'pawn')
            enemySquares.forEach(square => {
              board.addPiece(constants.enemyOf(color), ...square, 'knight')
            })
            let availableSquares = getSquares.availableToPiece(...pawnSquare, board.state)
            expect(availableSquares).toContain([3, 4 + constants.pawnStep(color)])
            expect(availableSquares).toContain([2, 4 + constants.pawnStep(color)])
            expect(availableSquares).toContain([4, 4 + constants.pawnStep(color)])
            expect(availableSquares.length).toEqual(3)
            board.clearAll()
          })
        })

        it("should return only the square in front when allies occupy the diagonals", () => {
          board.clearAll()
          let color = 'white'
          let pawnSquare = [3, 4]
          let allySquares = [ [2, 5], [4, 5] ]
          board.addPiece(color, ...pawnSquare, 'pawn')
          allySquares.forEach(square => {
            board.addPiece('white', ...square, 'knight')
          })
          let availableSquares = getSquares.availableToPiece(...pawnSquare, board.state)
          expect(availableSquares).toEqual([ [3, 5] ])
          board.clearAll()
        })

        it("should return the square in front and only the diagonal occupied by an enemy", () => {
          constants.colors.forEach(color => {
            let pawnSquare = [3, 4]
            let enemySquare =  [2, 4 + constants.pawnStep(color)]
            board.addPiece(color, ...pawnSquare, 'pawn')
            board.addPiece(constants.enemyOf(color), ...enemySquare, 'knight')
            let availableSquares = getSquares.availableToPiece(...pawnSquare, board.state)
            expect(availableSquares).toContain([3, 4 + constants.pawnStep(color)])
            expect(availableSquares).toContain(enemySquare)
            expect(availableSquares.length).toEqual(2)
            board.clearAll()
            //test both sides of the pawn
            enemySquare = [4, 4 + constants.pawnStep(color)]
            board.addPiece(color, ...pawnSquare, 'pawn')
            board.addPiece(constants.enemyOf(color), ...enemySquare, 'pawn')
            availableSquares = getSquares.availableToPiece(...pawnSquare, board.state)
            expect(availableSquares).toContain([3, 4 + constants.pawnStep(color)])
            expect(availableSquares).toContain(enemySquare)
            expect(availableSquares.length).toEqual(2)
            board.clearAll()
          })
        })
      })
    })

    describe('for a king', () => {

      describe("unobstructed by any other pieces", () => {

        it('should return 8 squares for a king not on the edge of the board', () => {
          let midSquares = [ [4,5], [2,1], [6,4], [3,3], [3,5], [1,6] ]
          midSquares.forEach(square => {
            board.addPiece('white', ...square, 'king')
            let availableSquares = (getSquares.availableToPiece(...square, board.state))
            expect(availableSquares.length).toEqual(8)
            board.clearAll()
          })
        })

        it('should return 5 squares for a king on the edge of the board but not in a corner', () => {
          let edgeSquares = [ [0,5], [0,2], [7,3], [7,6], [4,0], [6,0], [1,7], [4,7] ]
          edgeSquares.forEach(square => {
            board.addPiece('black', ...square, 'king')
            let availableSquares = (getSquares.availableToPiece(...square, board.state))
            expect(availableSquares.length).toEqual(5)
            board.clearAll()
          })
        })

        it('should return 3 squares for a king on a corner square', () => {
          let cornerSquares = [ [0,0], [0,7], [7,0], [7,7] ]
          cornerSquares.forEach(square => {
            board.addPiece('white', ...square, 'king')
            let availableSquares = (getSquares.availableToPiece(...square, board.state))
            expect(availableSquares.length).toEqual(3)
            board.clearAll()
          })
        })
      })

      it("should return non-attacked squares occupied by enemy pieces", () => {
        let kingSquare = [5,3]
        let enemySquare = [6,4]
        board.addPiece('black', ...kingSquare, 'king')
        board.addPiece('white', ...enemySquare, 'bishop')
        let availableSquares = getSquares.availableToPiece(...kingSquare, board.state)
        expect(availableSquares).toContain(enemySquare)
        board.clearAll()
      })

      it('should never return a square more than one square away from the king', () => {
        let squares = [ [7,7], [2,2], [5,0] ]
        squares.forEach(square => {
          board.addPiece('black', ...square, 'king')
          let availableSquares = getSquares.availableToPiece(...square, board.state)
          availableSquares.forEach(availableSquare => {
            let diff = [ Math.abs(availableSquare[0] - square[0]), Math.abs(availableSquare[1] - square[1]) ]
            expect(diff[0]).toBeLessThan(2)
            expect(diff[1]).toBeLessThan(2)
          })
          board.clearAll()
        })
      })
    })

    describe("for a knight", () => {

      it("should always return only the squares given by a (1,2) or (2,1) jump from the knight", () => {
        for (let i = 1; i <= 5; i++) {
          let testSquare = randomSquare()
          let [col, row] = testSquare
          board.addPiece('black', ...testSquare, 'knight')
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          availableSquares.forEach(moveSquare => {
            let diff = [ Math.abs(col - moveSquare[0]), Math.abs(row - moveSquare[1]) ]
            expect(diff).toContain(1)
            expect(diff).toContain(2)
          })
          board.clearAll()
        }
      })

      describe("on an empty board", () => {

        it("should always return 8 squares for a knight in the center 4x4 section of the board", () => {
          for (let i = 1; i <= 5; i++) {
            let testSquare = randomSquare(4, 4, 2, 2)
            let [col, row] = testSquare
            board.addPiece('black', ...testSquare, 'knight')
            let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
            expect(availableSquares.length).toEqual(8)
            board.clearAll()
          }
        })

        it("should always return 6 squares for a knight outside the center 4x4 section of the board but not within the 2x2 corners or along the edges", () => {
          for (let col = 1; col <= 6; col += 5) {
            for (let row = 2; row <= 5; row++) {
              let testSquare = [col, row]
              board.addPiece('black', ...testSquare, 'knight')
              let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
              expect(availableSquares.length).toEqual(6)
              board.clearAll()
            }
          }
          for (let row = 1; row <= 6; row += 5) {
            for (let col = 2; col <= 5; col++) {
              let testSquare = [col, row]
              board.addPiece('black', ...testSquare, 'knight')
              let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
              expect(availableSquares.length).toEqual(6)
              board.clearAll()
            }
          }
        })

        it("should always return 4 squares for a knight along an edge and not within the 2x2 corners", () => {
          for (let col = 0; col <= 7; col += 7) {
            for (let row = 2; row <= 5; row++) {
              let testSquare = [col, row]
              board.addPiece('black', ...testSquare, 'knight')
              let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
              expect(availableSquares.length).toEqual(4)
              board.clearAll()
            }
          }
          for (let row = 0; row <= 7; row += 7) {
            for (let col = 2; col <= 5; col++) {
              let testSquare = [col, row]
              board.addPiece('black', ...testSquare, 'knight')
              let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
              expect(availableSquares.length).toEqual(4)
              board.clearAll()
            }
          }
        })

        it("should return the correct number of squares for a knight within the 2x2 corners", () => {
          for (let col = 0; col <= 7; col++) {
            if (col >= 2 && col <= 5) { continue; }
            for (let row = 0; row <= 7; row++) {
              if (row >= 2 && row <= 5) { continue; }
              board.clearAll()
              let testSquare = [col, row]
              board.addPiece('black', ...testSquare, 'knight')
              let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
              if (
                (row == 0 && col == 0) ||
                (row == 0 && col == 7) ||
                (row == 7 && col == 0) ||
                (row == 7 && col == 7)
              ) {
                  expect(availableSquares.length).toEqual(2)
                  continue;
              } else if (
                (row == 1 && col == 1) ||
                (row == 1 && col == 6) ||
                (row == 6 && col == 1) ||
                (row == 6 && col == 6)
              ) {
                  expect(availableSquares.length).toEqual(4)
                  continue;
              } else {
                  expect(availableSquares.length).toEqual(3)
              }
            }
          }
          board.clearAll()
        })
      })

      describe("with other pieces on the board", () => {

        it("should not return squares occupied by allied pieces", () => {
          let testSquare = [3,4]
          let allySquare = [4,2]
          board.addPiece('black', ...testSquare, 'knight')
          board.addPiece('black', ...allySquare, 'pawn')
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          expect(availableSquares).not.toContain(allySquare)
          expect(availableSquares.length).toEqual(7)
          board.clearAll()
        })

        it("should return squares occupied by enemy pieces", () => {
          let testSquare = [3,4]
          let enemySquare = [4,2]
          board.addPiece('black', ...testSquare, 'knight')
          board.addPiece('white', ...enemySquare, 'pawn')
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          expect(availableSquares).toContain(enemySquare)
          expect(availableSquares.length).toEqual(8)
          board.clearAll()
        })
      })
    })

    describe("for a rook", () => {

      it("should only return squares in the same row or column as the rook", () => {
        for (let i = 1; i <= 5; i++) {
          let testSquare = randomSquare()
          let [col, row] = testSquare
          board.addPiece('white', ...testSquare, 'rook')
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          availableSquares.forEach(square => {
            let diff = [ col - square[0], row - square[1] ]
            expect(diff).toContain(0)
          })
          board.clearSquare(...testSquare)
        }
      })

      describe("on an empty board", () => {

        it("should return all squares on the board in the same row or column as the rook", () => {
          for (let i = 1; i <= 5; i++) {
            let testSquare = randomSquare()
            let [col, row] = testSquare
            board.addPiece('black', ...testSquare, 'rook')
            let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
            expect(availableSquares.length).toEqual(14)
            board.clearSquare(...testSquare)
          }
        })
      })

      describe("with other pieces on the board", () => {

        it("should not return squares past obstructing pieces", () => {
          constants.colors.forEach(color => {
            let testSquare = [4,6]
            let obstructSquares = [ [3,6], [4,5] ]
            board.addPiece(color, ...testSquare, 'rook')
            obstructSquares.forEach(square => {
              board.addPiece('white', ...square, 'pawn')
            })
            let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
            expect(availableSquares).toContain([4,7])
            expect(availableSquares).toContain([5,6])
            expect(availableSquares).not.toContain([4,4])
            expect(availableSquares).not.toContain([2,6])
            board.clearSquare(...testSquare)
          })
        })

        it("should return squares occupied by enemy pieces", () => {
          let testSquare = [4,6]
          let enemySquares = [ [3,6], [4,5] ]
          board.addPiece('black', ...testSquare, 'rook')
          enemySquares.forEach(square => {
            board.addPiece('white', ...square, 'pawn')
          })
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          expect(availableSquares).toContain([4,5])
          expect(availableSquares).toContain([3,6])
          board.clearSquare(...testSquare)
        })

        it("should return not squares occupied by allied pieces", () => {
          let testSquare = [4,6]
          let allySquares = [ [3,6], [4,5] ]
          board.addPiece('white', ...testSquare, 'rook')
          allySquares.forEach(square => {
            board.addPiece('white', ...square, 'pawn')
          })
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          expect(availableSquares).not.toContain([4,5])
          expect(availableSquares).not.toContain([3,6])
          board.clearSquare(...testSquare)
        })
      })
    })

    describe("for a bishop", () => {

      it("should only return squares that share a diagonal lane with the bishop", () => {
        for (let i = 1; i <= 5; i++) {
          let testSquare = randomSquare()
          let [col, row] = testSquare
          let lanePlus = col + row
          let laneMinus = col - row
          board.addPiece('white', ...testSquare, 'bishop')
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          availableSquares.forEach(square => {
            let plusDiag = (lanePlus == square[0] + square[1])
            let minusDiag = (laneMinus == square[0] - square[1])
            let validSquare = plusDiag || minusDiag
            expect(validSquare).toEqual(true)
          })
          board.clearAll()
        }
      })

      describe("on an empty board", () => {

        it("should return all squares on the board that share a diagonal with the bishop", () => {
          let testSquare = [4,4]
          board.addPiece('black', ...testSquare, 'bishop')
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          expect(availableSquares.length).toEqual(13)
          board.clearSquare(...testSquare)

          testSquare = [1,1]
          board.addPiece('black', ...testSquare, 'bishop')
          availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          expect(availableSquares.length).toEqual(9)
          board.clearAll
        })
      })

      describe("with other pieces on the board", () => {

        it("should not return squares past obstructing pieces", () => {
          constants.colors.forEach(color => {
            let testSquare = [4,4]
            let obstructSquares = [ [3,3], [5,5] ]
            board.addPiece(color, ...testSquare, 'bishop')
            obstructSquares.forEach(square => {
              board.addPiece('white', ...square, 'pawn')
            })
            let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
            expect(availableSquares).toContain([3,5])
            expect(availableSquares).toContain([5,3])
            expect(availableSquares).not.toContain([2,2])
            expect(availableSquares).not.toContain([6,6])
            board.clearAll()
          })
        })

        it("should return squares occupied by enemy pieces", () => {
          let testSquare = [4,4]
          let enemySquares = [ [3,3], [5,5] ]
          board.addPiece('black', ...testSquare, 'bishop')
          enemySquares.forEach(square => {
            board.addPiece('white', ...square, 'pawn')
          })
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          expect(availableSquares).toContain([3,3])
          expect(availableSquares).toContain([5,5])
          board.clearAll()
        })

        it("should not return squares occupied by allied pieces", () => {
          let testSquare = [4,4]
          let allySquares = [ [3,3], [5,5] ]
          board.addPiece('white', ...testSquare, 'bishop')
          allySquares.forEach(square => {
            board.addPiece('white', ...square, 'pawn')
          })
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          expect(availableSquares).not.toContain([3,3])
          expect(availableSquares).not.toContain([5,5])
          board.clearAll()
        })
      })
    })

    describe("for a queen", () => {

      describe("on an empty board", () => {

        it("should only return squares that share a row, column, or diagonal with the queen", () => {
          for (let i = 1; i <= 5; i++) {
            let testSquare = randomSquare()
            let [col, row] = testSquare
            let lanePlus = col + row
            let laneMinus = col - row
            board.addPiece('white', ...testSquare, 'queen')
            let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
            availableSquares.forEach(square => {
              let diff = [ col - square[0], row - square[1] ]
              let plusDiag = (lanePlus == square[0] + square[1])
              let minusDiag = (laneMinus == square[0] - square[1])
              let validSquare = (diff.includes(0) || plusDiag || minusDiag)
              expect(validSquare).toEqual(true)
            })
            board.clearSquare(...testSquare)
          }
        })

        it("should return all squares that share a row, column, or diagonal with the queen", () => {
          let testSquare = [4,4]
          board.addPiece('white', ...testSquare, 'queen')
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          expect(availableSquares.length).toEqual(27)
          board.clearSquare(...testSquare)

          testSquare = [7,7]
          board.addPiece('white', ...testSquare, 'queen')
          availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          expect(availableSquares.length).toEqual(21)
          board.clearSquare(...testSquare)
        })
      })

      describe("with other pieces on the board", () => {

        it("should not return squares past obstructing pieces", () => {
          constants.colors.forEach(color => {
            let testSquare = [3,3]
            let obstructSquares = [ [4,4], [3,4], [4,3,], [4,2] ]
            board.addPiece(color, ...testSquare, 'queen')
            obstructSquares.forEach(square => {
              board.addPiece('white', ...square, 'pawn')
            })
            let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
            expect(availableSquares).toContain([2,2])
            expect(availableSquares).toContain([2,3])
            expect(availableSquares).toContain([2,4])
            expect(availableSquares).toContain([3,2])
            expect(availableSquares).not.toContain([3,5])
            expect(availableSquares).not.toContain([5,5])
            expect(availableSquares).not.toContain([5,3])
            expect(availableSquares).not.toContain([5,1])
            board.clearSquare(...testSquare)
          })
        })

        it("should return squares occupied by enemy pieces", () => {
          let testSquare = [3,3]
          let enemySquares = [ [4,4], [3,4], [4,3,], [4,2] ]
          board.addPiece('black', ...testSquare, 'queen')
          enemySquares.forEach(square => {
            board.addPiece('white', ...square, 'pawn')
          })
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          expect(availableSquares).toContain([4,4])
          expect(availableSquares).toContain([4,3])
          expect(availableSquares).toContain([3,4])
          expect(availableSquares).toContain([4,2])
          board.clearSquare(...testSquare)
        })

        it("should not return squares occupied by allied pieces", () => {
          let testSquare = [3,3]
          let enemySquares = [ [4,4], [3,4], [4,3,], [4,2] ]
          board.addPiece('black', ...testSquare, 'queen')
          enemySquares.forEach(square => {
            board.addPiece('black', ...square, 'pawn')
          })
          let availableSquares = getSquares.availableToPiece(...testSquare, board.state)
          expect(availableSquares).not.toContain([4,4])
          expect(availableSquares).not.toContain([4,3])
          expect(availableSquares).not.toContain([3,4])
          expect(availableSquares).not.toContain([4,2])
          board.clearSquare(...testSquare)
        })
      })
    })
  })

  describe("attackedByPiece()", () => {

    describe("for a pawn", () => {

      it("should only return the pawn's diagonals with no other pieces on the board", () => {
        board.clearAll()
        let testSquare = randomSquare(6,6,1,1)
        let [col, row] = testSquare
        let diagonalLeft = [col - 1, row + 1]
        let diagonalRight = [col + 1, row + 1]
        board.addPiece('white', ...testSquare, 'pawn')
        let attackedSquares = getSquares.attackedByPiece(...testSquare, board.state)
        expect(attackedSquares).toContain(diagonalLeft)
        expect(attackedSquares).toContain(diagonalRight)
        expect(attackedSquares.length).toEqual(2)
      })

      it("should return the pawn's diagonals when they're obstructed by allies", () => {
        board.clearAll()
        let testSquare = randomSquare(6,6,1,1)
        let [col, row] = testSquare
        let diagonalLeft = [col - 1, row + 1]
        let diagonalRight = [col + 1, row + 1]
        board.addPiece('white', ...testSquare, 'pawn')
        board.addPiece('white', ...diagonalLeft, 'rook')
        board.addPiece('white', ...diagonalRight, 'bishop')
        let attackedSquares = getSquares.attackedByPiece(...testSquare, board.state)
        expect(attackedSquares).toContain(diagonalLeft)
        expect(attackedSquares).toContain(diagonalRight)
        expect(attackedSquares.length).toEqual(2)
      })

      it("should return the pawn's diagonals when they're obstructed by enemies", () => {
        board.clearAll()
        let testSquare = randomSquare(6,6,1,1)
        let [col, row] = testSquare
        let diagonalLeft = [col - 1, row + 1]
        let diagonalRight = [col + 1, row + 1]
        board.addPiece('white', ...testSquare, 'pawn')
        board.addPiece('black', ...diagonalLeft, 'rook')
        board.addPiece('black', ...diagonalRight, 'bishop')
        let attackedSquares = getSquares.attackedByPiece(...testSquare, board.state)
        expect(attackedSquares).toContain(diagonalLeft)
        expect(attackedSquares).toContain(diagonalRight)
        expect(attackedSquares.length).toEqual(2)
      })
    })

    describe("for a king", () => {

      it("should only return squares surrounding the king with no other pieces on the board", () => {
        board.clearAll()
        let testSquare = randomSquare(6,6,1,1)
        let [col, row] = testSquare
        let neighborSquares = []
        for (let colShift of [-1, 0, 1]) {
          for (let rowShift of [-1, 0, 1]) {
            if (colShift !== 0 || rowShift !== 0) {
              neighborSquares.push([col + colShift, row + rowShift])
            }
          }
        }
        board.addPiece('white', ...testSquare, 'king')
        let attackedSquares = getSquares.attackedByPiece(...testSquare, board.state)
        neighborSquares.forEach(neighborSquare => {
          expect(attackedSquares).toContain(neighborSquare)
        })
        expect(attackedSquares.length).toEqual(8)
      })
    })

    //TBC...
  })
})

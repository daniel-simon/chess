import React, { Component } from 'react'
import Square from '../components/Square'
let getLegalSquares = require('../helpers/GetLegalSquares.js')
let castleHelper = require('../helpers/CastleHelper.js')
let gameConstants = require('../helpers/GameConstants.js')
let squareMethods = require('../helpers/SquareMethods.js')
let myColor = 'white'

class BoardInterface extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedSquare: [],
      availableSquares: [],
      availableCastlingRooks: [],
      activeColor: 'white'
    }
    this.selectPiece = this.selectPiece.bind(this)
    this.selectDestinationAndMovePiece = this.selectDestinationAndMovePiece.bind(this)
    this.castleWithRook = this.castleWithRook.bind(this)
    this.clearSelection = this.clearSelection.bind(this)
  }

  selectPiece (col, row) {
    let player = this.state.activeColor
    let pieceSelected = this.props.boardState[col][row]
    let moveHistory = this.props.moveHistory
    let availableSquares = getLegalSquares.forPiece(col, row, this.props.boardState)

    let castlingRooks = []
    if (
      pieceSelected.type === 'king' &&
      castleHelper.kingHasNotMoved(moveHistory, player)
    ) {
        castlingRooks = castleHelper.getAvailableCastlingRooks(moveHistory, player, this.props.boardState)
    }
    this.setState({
      selectedSquare: [col, row],
      availableSquares: availableSquares,
      availableCastlingRooks: castlingRooks
    })
  }

  selectDestinationAndMovePiece (col, row) {
    let origin = this.state.selectedSquare
    let destination = [col, row]
    let newMove = {
      origin: origin,
      destination: destination,
      player: this.state.activeColor,
      castle: false
    }
    this.props.recordMove(newMove)
    this.props.movePiece(origin, destination)
    this.endTurn()
  }

  castleWithRook (col, row) {
    let side
    if (col === 7) {
      side = 'kingside'
    } else if (col === 0) {
      side = 'queenside'
    }
    let player = this.state.activeColor
    let homeRow = gameConstants.firstRowFor(player)
    let kingToCol = gameConstants.castleDestinationFor('king', side)
    let rookToCol = gameConstants.castleDestinationFor('rook', side)
    let kingFromCol = 4
    let rookFromCol = col
    let kingOrigin = [kingFromCol, homeRow]
    let rookOrigin = [rookFromCol, homeRow]
    let kingDestination = [kingToCol, homeRow]
    let rookDestination = [rookToCol, homeRow]

    let newMove = {
      origin: kingOrigin,
      destination: kingDestination,
      player: this.state.activeColor,
      castle: true
    }

    this.props.recordMove(newMove)

    this.props.movePiece(kingOrigin, kingDestination)
    this.props.movePiece(rookOrigin, rookDestination)
    this.endTurn()
  }

  endTurn () {
    let nextPlayer = (this.state.activeColor === 'white') ? 'black' : 'white'
    this.clearSelection()
    this.setState({ activeColor: nextPlayer })
  }

  clearSelection () {
    this.setState({
      selectedSquare: [],
      availableSquares: [],
      availableCastlingRooks: []
    })
  }

  renderSquare (col, row) {
    let occupant = this.props.boardState[col][row]
    let currentSquare = [col, row]
    let selected = false
    let available = false
    let victim = false
    let castlingRook = false
    if (squareMethods.sameSquare(this.state.selectedSquare, currentSquare)) {
      selected = true
    } else if (squareMethods.includesSquare(this.state.availableSquares, currentSquare)) {
      available = true
      if (occupant) victim = true
    } else if (squareMethods.includesSquare(this.state.availableCastlingRooks, currentSquare)) {
      available = true
      castlingRook = true
    }
    let selectable
    let handleClick
    if (!selected && !castlingRook && occupant && occupant.color === this.state.activeColor) {
      handleClick = () => { this.selectPiece(...currentSquare) }
      selectable = true
    } else if (available) {
      let moveToMe = () => { this.selectDestinationAndMovePiece(...currentSquare) }
      let castleWithMe = () => { this.castleWithRook(...currentSquare) }
      handleClick = castlingRook ? castleWithMe : moveToMe
      selectable = true
    } else {
      handleClick = () => { this.clearSelection() }
      selectable = false
    }
    return (
      <Square
        key={col}
        col={col}
        row={row}
        occupant={occupant}
        handleClick={handleClick}
        selected={selected}
        selectable={selectable}
        available={available}
        victim={victim}
        pieceSet={this.props.pieceSet}
        asViewedBy={myColor}
      />
    )
  }

  renderRow (row) {
    // let myColor = this.state.activeColor
    let rowSquares = []
    let cssBorderClass = 'chess-row'
    //TODO: label row and col names
    // maybe for labeling rows/cols on the board?:
    // let colName
    // let colLetters = "ABCDEFGH"
    // let colName = colLetters.charAt(col)
    let colStep = (myColor === 'white') ? 1 : -1
    let startCol = (myColor === 'white') ? 0 : 7
    let endCol = (myColor === 'white') ? 7 : 0
    let topRow = (myColor === 'white') ? 7 : 0
    let bottomRow = (myColor === 'white') ? 0 : 7
    for (let col = startCol; col !== endCol + colStep; col += colStep) {
      rowSquares.push(this.renderSquare(col, row))
    }
    if (row === topRow) {
      cssBorderClass += ' top'
    }
    if (row === bottomRow) {
      cssBorderClass += ' bottom'
    }
    return (
      <div key={row} className={`${cssBorderClass} row`}>
        {/* TODO: row labels **COULD** go here? */}
        {rowSquares}
      </div>
    )
  }

  renderGrid () {
    // let myColor = this.state.activeColor
    let gridRows = []
    let rowStep = (myColor === 'white') ? -1 : 1
    let startRow = (myColor === 'white') ? 7 : 0
    let endRow = (myColor === 'white') ? 0 : 7
    for (let row = startRow; row !== endRow + rowStep; row += rowStep) {
      gridRows.push(this.renderRow(row))
    }
    return (
      <div className="chess-board">
        {gridRows}
      </div>
    )
  }

  render () {
    let chessBoard = this.renderGrid()
    return (
      <div>
        {chessBoard}
      </div>
    )
  }
}

export default BoardInterface

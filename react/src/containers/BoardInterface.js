import React, { Component } from 'react'
import Square from '../components/Square'
let getLegalSquares = require('../helpers/GetLegalSquares.js')
let castleHelper = require('../helpers/CastleHelper.js')
let gameConstants = require('../helpers/GameConstants.js')
let squareMethods = require('../helpers/SquareMethods.js')

class BoardInterface extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedSquare: [],
      availableSquares: [],
      availableCastlingRooks: []
    }
    this.selectPiece = this.selectPiece.bind(this)
    this.selectDestinationAndMovePiece = this.selectDestinationAndMovePiece.bind(this)
    this.castleWithRook = this.castleWithRook.bind(this)
    this.clearSelection = this.clearSelection.bind(this)
  }

  selectPiece (col, row) {
    let player = this.props.myColor
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
      player: this.props.myColor,
      castle: false
    }
    this.props.recordMove(newMove)
    this.props.movePiece(origin, destination)
    this.clearSelection()
  }

  castleWithRook (col, row) {
    let side
    if (col === 7) {
      side = 'kingside'
    } else if (col === 0) {
      side = 'queenside'
    }
    let player = this.props.myColor
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
      player: this.props.myColor,
      castle: true
    }

    this.props.recordMove(newMove)

    this.props.movePiece(kingOrigin, kingDestination)
    this.props.movePiece(rookOrigin, rookDestination)
    this.endTurn()
  }

  // could be reused in sandbox mode
  // endTurn () {
  //   let nextPlayer = (this.props.myColor === 'white') ? 'black' : 'white'
  //   this.clearSelection()
  //   this.setState({ activeColor: nextPlayer })
  // }

  clearSelection () {
    this.setState({
      selectedSquare: [],
      availableSquares: [],
      availableCastlingRooks: []
    })
  }

  renderSquare (col, row) {
    let selected = false
    let available = false
    let victim = false
    let castlingRook = false
    let selectable = false
    let handleClick = () => {}
    let occupant = this.props.boardState[col][row]

    if (this.props.isMyTurn) {
      let currentSquare = [col, row]
      if (squareMethods.sameSquare(this.state.selectedSquare, currentSquare)) {
        selected = true
      } else if (squareMethods.includesSquare(this.state.availableSquares, currentSquare)) {
        available = true
        if (occupant) victim = true
      } else if (squareMethods.includesSquare(this.state.availableCastlingRooks, currentSquare)) {
        available = true
        castlingRook = true
      }
      if (!selected && !castlingRook && occupant && occupant.color === this.props.myColor) {
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
        asViewedBy={this.props.myColor}
      />
    )
  }

  renderRow (row) {
    // let myColor = this.props.myColor
    let rowSquares = []
    //TODO: label row and col names
    // maybe for labeling rows/cols on the board?:
    // let colName
    // let colLetters = "ABCDEFGH"
    // let colName = colLetters.charAt(col)
    let bottomRow, topRow, startCol, endCol, colStep
    startCol = bottomRow = (this.props.myColor === 'white') ? 0 : 7
    endCol = topRow = (this.props.myColor === 'white') ? 7 : 0
    colStep = (this.props.myColor === 'white') ? 1 : -1
    for (let col = startCol; col !== endCol + colStep; col += colStep) {
      rowSquares.push(this.renderSquare(col, row))
    }

    let cssBorderClass = 'chess-row row'
    if (row === topRow) {
      cssBorderClass += ' top'
    }
    if (row === bottomRow) {
      cssBorderClass += ' bottom'
    }
    return (
      <div key={row} className={cssBorderClass}>
        {/* TODO: row labels **COULD** go here? */}
        {rowSquares}
      </div>
    )
  }

  renderGrid () {
    // let myColor = this.props.myColor
    let gridRows = []
    let rowStep = (this.props.myColor === 'white') ? -1 : 1
    let startRow = (this.props.myColor === 'white') ? 7 : 0
    let endRow = (this.props.myColor === 'white') ? 0 : 7
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

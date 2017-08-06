class Move < ApplicationRecord
  belongs_to :game
  validates :game_id, presence: true
  validates :move_number, presence: true
  validates :move_number, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 0
  }
  validates :player_color, inclusion: { in: ['white', 'black'] }
  validates :moved_piece, inclusion: { in:
    ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king']
  }
  validates :captured_piece, inclusion: { in:
    ['pawn', 'rook', 'knight', 'bishop', 'queen', nil]
  }
  validates :origin_col, presence: true
  validates :origin_col, numericality: {
    greater_than_or_equal_to: 0,
    less_than_or_equal_to: 7,
    only_integer: true
  }
  validates :origin_row, presence: true
  validates :origin_row, numericality: {
    greater_than_or_equal_to: 0,
    less_than_or_equal_to: 7,
    only_integer: true
  }
  validates :destination_col, presence: true
  validates :destination_col, numericality: {
    greater_than_or_equal_to: 0,
    less_than_or_equal_to: 7,
    only_integer: true
  }
  validates :destination_row, presence: true
  validates :destination_row, numericality: {
    greater_than_or_equal_to: 0,
    less_than_or_equal_to: 7,
    only_integer: true
  }

  def origin
    [origin_col, origin_row]
  end

  def destination
    [destination_col, destination_row]
  end
end

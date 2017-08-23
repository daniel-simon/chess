class Game < ApplicationRecord
  belongs_to :creator, class_name: "User", foreign_key: "creator_id"
  belongs_to :joiner, class_name: "User", foreign_key: "joiner_id", optional: true

  belongs_to :white, class_name: "User", foreign_key: "white_id", optional: true
  belongs_to :black, class_name: "User", foreign_key: "black_id", optional: true

  belongs_to :winner, class_name: "User", foreign_key: "winner_id", optional: true
  belongs_to :loser, class_name: "User", foreign_key: "loser_id", optional: true

  has_many :moves

  def captured_pieces(capturer_color)
    capture_moves = self.moves.select do |move|
      move.player_color == capturer_color &&
      move.captured_piece != nil
    end
    captured_pieces = capture_moves.map { |move| move.captured_piece }
    return captured_pieces
  end
end

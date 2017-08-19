class Game < ApplicationRecord
  belongs_to :creator, class_name: "User", foreign_key: "creator_id"
  belongs_to :joiner, class_name: "User", foreign_key: "joiner_id", optional: true

  belongs_to :winner, class_name: "User", foreign_key: "winner_id", optional: true
  belongs_to :loser, class_name: "User", foreign_key: "loser_id", optional: true

  belongs_to :white, class_name: "User", foreign_key: "white_id", optional: true
  belongs_to :black, class_name: "User", foreign_key: "black_id", optional: true

  has_many :moves

  def total_moves
    Move.where(game_id: :id).count
  end
end

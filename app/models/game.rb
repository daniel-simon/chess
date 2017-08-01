class Game < ApplicationRecord
  belongs_to :creator, class_name: "User", foreign_key: "creator_id"
  belongs_to :joiner, class_name: "User", foreign_key: "joiner_id"

  belongs_to :active_player, class_name: "User", foreign_key: "active_player_id"
  belongs_to :inactive_player, class_name: "User", foreign_key: "inactive_player_id"

  belongs_to :white, class_name: "User", foreign_key: "white_id"
  belongs_to :black, class_name: "User", foreign_key: "black_id"

  belongs_to :winner, class_name: "User", foreign_key: "winner_id"
  belongs_to :loser, class_name: "User", foreign_key: "loser_id"
  # has_many :moves
end

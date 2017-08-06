class Game < ApplicationRecord
  belongs_to :creator, class_name: "User", foreign_key: "creator_id"
  belongs_to :joiner, class_name: "User", foreign_key: "joiner_id", optional: true

  belongs_to :winner, class_name: "User", foreign_key: "winner_id", optional: true
  belongs_to :loser, class_name: "User", foreign_key: "loser_id", optional: true
  has_many :moves

  def white_id
    return creator.id
  end

  def black_id
    return joiner.id
  end

end

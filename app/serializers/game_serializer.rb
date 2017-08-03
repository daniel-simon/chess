class GameSerializer < ActiveModel::Serializer
  attributes :id, :creator_id, :in_progress, :show_legal_moves, :active_player_id, :created_at
end

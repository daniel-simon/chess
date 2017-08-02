class GameSerializer < ActiveModel::Serializer
  attributes :id, :creator_id, :public_game, :started, :show_legal_moves, :active_player_id, :inactive_player_id
end

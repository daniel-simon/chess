class GameSerializer < ActiveModel::Serializer
  attributes :id, :creator_id, :public_game, :show_legal_moves, :started
end

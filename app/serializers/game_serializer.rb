class GameSerializer < ActiveModel::Serializer
  attributes :id, :started, :finished, :show_legal_moves, :active_player_id, :created_at
  attribute :creator do
    creator = object.creator
    {
      id: creator.id,
      username: creator.username,
      email: creator.email
    }
  end
end

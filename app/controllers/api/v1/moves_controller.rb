class Api::V1::MovesController < ApplicationController
  def index
    moves = []
    move_models = Move.where(game_id: game_id)
    move_models.each_with_index do |move_model, i|
      moves << move_model.serializable_hash
      moves[i]['origin'] = move_model.origin
      moves[i]['destination'] = move_model.destination
    end
    move_history = moves.sort_by { |move| move['move_number'] }
    render json: { moves: move_history }, adapter: :json
  end

  def create
  end

  private

  def game_id
    params.require(:game_id)
  end
end

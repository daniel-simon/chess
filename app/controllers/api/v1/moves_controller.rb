class Api::V1::MovesController < ApplicationController
  skip_before_action :verify_authenticity_token

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
    move_request_hash = JSON.parse(request.body.read)["move"]
    new_move_obj = Move.new(
      {
        game_id: move_request_hash["gameId"],
        move_number: move_request_hash["moveNumber"],
        origin_col: move_request_hash["origin"][0],
        origin_row: move_request_hash["origin"][1],
        destination_col: move_request_hash["destination"][0],
        destination_row: move_request_hash["destination"][1],
        moved_piece: move_request_hash["movedPiece"]["type"],
        player_color: move_request_hash["player"],
        castle: move_request_hash["castle"]
      }
    )
    if move_request_hash["capturedPiece"]
      new_move_obj.captured_piece = move_request_hash["capturedPiece"]["type"]
    end
    game_model = Game.find(move_request_hash["gameId"])
    player_ids = [ game_model.white_id, game_model.black_id ]
    opponent_id = get_opponent_id(*player_ids)
    if new_move_obj.save
      ActionCable.server.broadcast("games_index", { type: "new_move", opponent_id: opponent_id })
      render json: { move: new_move_obj }, adapter: :json
    else
      render json: { errors: new_move_obj.errors.full_messages }, status: 422
    end
  end

  private

  def game_id
    params.require(:game_id)
  end
end

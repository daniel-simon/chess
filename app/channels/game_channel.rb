class GameChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "game_#{params[:game_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(fetch_cue)
    ActionCable.server.broadcast("game_#{params[:game_id]}", fetch_cue)
  end
end

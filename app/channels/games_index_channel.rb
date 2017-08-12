class GamesIndexChannel < ApplicationCable::Channel
  def subscribed
    stream_from "games_index"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def recieve(refresh_cue)
    ActionCable.server.broadcast("games_index", refresh_cue)
  end
end

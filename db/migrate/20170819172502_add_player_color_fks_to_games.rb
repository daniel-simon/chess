class AddPlayerColorFksToGames < ActiveRecord::Migration[5.1]
  def up
    add_column :games, :white_id, :bigint
    add_column :games, :black_id, :bigint
    add_index :games, :white_id
    add_index :games, :black_id
    Game.all.each do |game|
      game.white_id = game.creator_id
      game.black_id = game.joiner_id unless game.joiner_id.nil?
      game.save
    end
  end

  def down
    remove_column :games, :white_id
    remove_column :games, :black_id
  end
end

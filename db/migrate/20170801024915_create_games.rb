class CreateGames < ActiveRecord::Migration[5.1]
  def change
    create_table :games do |t|
      t.belongs_to :creator, null: false
      t.belongs_to :joiner
      t.boolean :show_legal_moves, null: false, default: true
      t.boolean :started, null: false, default: false
      t.boolean :finished, null: false, default: false
      t.bigint :active_player_id
      t.belongs_to :winner
      t.belongs_to :loser
      t.timestamps
    end
  end
end

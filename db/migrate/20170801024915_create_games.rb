class CreateGames < ActiveRecord::Migration[5.1]
  def change
    create_table :games do |t|
      t.belongs_to :creator, null: false
      t.belongs_to :joiner
      t.boolean :public, null: false
      t.boolean :show_legal_moves, null: false
      t.boolean :started, null: false, default: false
      t.belongs_to :active_player
      t.belongs_to :inactive_player
      t.belongs_to :white
      t.belongs_to :black
      t.belongs_to :winner
      t.belongs_to :loser

      t.timestamps
    end
  end
end

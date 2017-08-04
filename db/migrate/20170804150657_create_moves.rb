class CreateMoves < ActiveRecord::Migration[5.1]
  def change
    create_table :moves do |t|
      t.belongs_to :game, null: false
      t.integer :move_number, null: false, limit: 2
      t.string :player_color, null: false
      t.integer :origin_col, null: false, limit: 1
      t.integer :origin_row, null: false, limit: 1
      t.integer :destination_col, null: false, limit: 1
      t.integer :destination_row, null: false, limit: 1
      t.string :moved_piece, null: false
      t.string :captured_piece, default: nil
      t.boolean :castle, null: false, default: false
      t.timestamps
    end
  end
end

FactoryGirl.define do
  factory :move do
    game { FactoryGirl.create(:game) }
    origin_col { rand(0..7) }
    origin_row { rand(0..7) }
    destination_col { rand(0..7) }
    destination_row { rand(0..7) }
    player_color { ['white', 'black'][rand(0..1)] }
    move_number { rand(0..100) }
    moved_piece { ['pawn', 'rook', 'knight', 'bishop', 'king', 'queen'][rand(0..5)] }
  end
end

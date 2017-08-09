# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

dan = FactoryGirl.create(:user, username: "dansaccount", email: "d@n.com", password: "dan")
FactoryGirl.create(:user, username: "test", email: "test", password: "test")
dave = FactoryGirl.create(:user, username: "davey", email: "d@ve.com", password: "dave")
Game.create(creator: dan, show_legal_moves: false)
Game.create(creator: dave, show_legal_moves: false)
FactoryGirl.create_list(:game, 3, creator: User.find_by(username: "dansaccount"), show_legal_moves: true)
FactoryGirl.create_list(:game, 2, creator: User.find_by(username: "davey"), show_legal_moves: true)
FactoryGirl.create_list(:game, 2)

# test_moves = []
#
# 4.times do |i|
#   test_moves[i] = Move.new(move_number: i, game_id: 1, moved_piece: 'pawn')
# end
#
# test_moves[0].player_color = 'white'
# test_moves[0].origin_col = 1
# test_moves[0].origin_row = 1
# test_moves[0].destination_col = 1
# test_moves[0].destination_row = 3
#
# test_moves[1].player_color = 'black'
# test_moves[1].origin_col = 1
# test_moves[1].origin_row = 6
# test_moves[1].destination_col = 1
# test_moves[1].destination_row = 5
#
# test_moves[2].player_color = 'white'
# test_moves[2].origin_col = 1
# test_moves[2].origin_row = 3
# test_moves[2].destination_col = 1
# test_moves[2].destination_row = 4
#
# test_moves[3].player_color = 'black'
# test_moves[3].origin_col = 3
# test_moves[3].origin_row = 6
# test_moves[3].destination_col = 3
# test_moves[3].destination_row = 4
#
# test_moves.each do |move|
#   move.save
# end

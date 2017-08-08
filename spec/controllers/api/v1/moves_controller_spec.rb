require 'rails_helper'

RSpec.describe Api::V1::MovesController, type: :controller do
  describe "GET#index" do

    before(:each) do
      @bobby_f = FactoryGirl.create(:user, username: "bfischer")
      @john_a = FactoryGirl.create(:user, username: "jakers")
      session[:user_id] = @john_a.id
      @bobbys_game = FactoryGirl.create(:game, creator: @bobby_f, show_legal_moves: false)
      FactoryGirl.create(:game, creator: @john_a, started: true)
      test_moves = []
      4.times do |i|
        test_moves[i] = Move.new(move_number: i, game: @bobbys_game, moved_piece: 'pawn')
      end

      test_moves[0].player_color = 'white'
      test_moves[0].origin_col = 1
      test_moves[0].origin_row = 1
      test_moves[0].destination_col = 1
      test_moves[0].destination_row = 3

      test_moves[1].player_color = 'black'
      test_moves[1].origin_col = 1
      test_moves[1].origin_row = 6
      test_moves[1].destination_col = 1
      test_moves[1].destination_row = 5

      test_moves[2].player_color = 'white'
      test_moves[2].origin_col = 1
      test_moves[2].origin_row = 3
      test_moves[2].destination_col = 1
      test_moves[2].destination_row = 4

      test_moves[3].player_color = 'black'
      test_moves[3].origin_col = 3
      test_moves[3].origin_row = 6
      test_moves[3].destination_col = 3
      test_moves[3].destination_row = 4

      test_moves.each do |move|
        move.save
      end
    end

    after(:each) do

    end

    it "should respond by rendering a javascript object in JSON" do
      get(:index, params: { game_id: @bobbys_game.id })

      expect(response.status).to eq 200
      expect(response.content_type).to eq "application/json"
      expect{ JSON.parse(response.body) }.not_to raise_error
    end

    it "should render a list of moves with the correct length" do
      get(:index, params: { game_id: @bobbys_game.id })
      returned_json = JSON.parse(response.body)

      expect(returned_json.length).to eq 1
      expect(returned_json["moves"].length).to eq @bobbys_game.moves.count
    end

  end

  describe "POST#create" do
    before(:each) do

    end

    after(:each) do

    end
    it "text" do

    end
  end
end

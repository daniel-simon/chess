require 'rails_helper'

RSpec.describe Api::V1::GamesController, type: :controller do
  context "With a user signed in and public games available" do

    before(:each) do
      @bobby_f = FactoryGirl.create(:user, username: "bfischer")
      @john_a = FactoryGirl.create(:user, username: "jakers")
      session[:user_id] = @bobby_f.id
      FactoryGirl.create(:game, creator: @bobby_f, show_legal_moves: false)
      FactoryGirl.create(:game, creator: @john_a, started: true)
    end

    after(:each) do
      session[:user_id] = nil
    end

    describe "GET#index" do

      it "should respond by rendering a javascript object in JSON" do
        get :index

        expect(response.status).to eq 200
        expect(response.content_type).to eq "application/json"
        expect{ JSON.parse(response.body) }.not_to raise_error
      end

      it "should render a list of games with the correct length" do
        get :index
        returned_json = JSON.parse(response.body)

        expect(returned_json.length).to eq 1
        expect(returned_json["games"].length).to eq Game.where(finished: false).length
      end

      it "should render a list of games with the correct value for creator" do
        get :index
        returned_json = JSON.parse(response.body)

        bobbys_game = returned_json["games"][0]
        johns_game = returned_json["games"][1]

        expect(bobbys_game["creator_id"]).to eq @bobby_f.id
        expect(johns_game["creator_id"]).to eq @john_a.id
      end

      it "should render a list of games with the correct value for 'my_game'" do
        get :index
        returned_json = JSON.parse(response.body)

        bobbys_game = returned_json["games"][0]
        johns_game = returned_json["games"][1]

        expect(bobbys_game["my_game"]).to eq true
        expect(johns_game["my_game"]).to eq false
      end

      it "should render a list of games with the correct value for 'playing_this_game'" do
        get :index
        returned_json = JSON.parse(response.body)

        bobbys_game = returned_json["games"][0]
        johns_game = returned_json["games"][1]

        expect(bobbys_game["playing_this_game"]).to eq true
        expect(johns_game["playing_this_game"]).to eq false
      end

      it "should render a list of games with the correct value for 'show_legal_moves'" do
        get :index
        returned_json = JSON.parse(response.body)

        bobbys_game = returned_json["games"][0]
        johns_game = returned_json["games"][1]

        expect(bobbys_game["show_legal_moves"]).to eq false
        expect(johns_game["show_legal_moves"]).to eq true
      end

      it "should render a list of games with the correct value for 'started'" do
        get :index
        returned_json = JSON.parse(response.body)

        bobbys_game = returned_json["games"][0]
        johns_game = returned_json["games"][1]

        expect(bobbys_game["started"]).to eq false
        expect(johns_game["started"]).to eq true
      end

      it "should not render a list that contains finished games" do
        finished_game = FactoryGirl.create(:game, finished: true)
        get :index
        returned_json = JSON.parse(response.body)
        returned_games = returned_json["games"]
        returned_ids = []
        returned_games.each do |game|
          returned_ids << game["id"]
        end

        expect(returned_ids).to_not include finished_game["id"]
      end
    end

    describe "PATCH#update" do

      let!(:current_user) { @bobby_f }

      context "for a join-game request" do

        let!(:join_game_request) do
          {
            patchType: "join-game"
          }.to_json
        end

        it "should set the value of the game's joiner_id to the joining player's id" do
          expect(Game.all[1].joiner_id).to eq nil

          patch(:update, params: { id: Game.all[1].id }, body: join_game_request)

          expect(Game.all[1].joiner_id).to eq current_user.id
        end

        it "should set the value of the game's started boolean to true" do
          test_game = FactoryGirl.create(:game, creator: @john_a)

          expect(test_game.started).to eq false

          patch(:update, params: { id: test_game.id }, body: join_game_request)
          test_game = Game.find(test_game.id)

          expect(test_game.started).to eq true
        end

        it "should set the value of the game's active_player_id to the game's white player id" do
          expect(Game.all[1].active_player_id).to eq nil

          patch(:update, params: { id: Game.all[1].id }, body: join_game_request)

          expect(Game.all[1].active_player_id).to eq Game.all[1].white_id
        end

        it "should respond by rendering a javascript object in JSON" do
          patch(:update, params: { id: Game.all[1].id }, body: join_game_request)

          expect(response.status).to eq 200
          expect(response.content_type).to eq "application/json"
          expect{ JSON.parse(response.body) }.not_to raise_error
        end

        it "should respond by rendering the joined game as a JS object" do
          patch(:update, params: { id: Game.all[1].id }, body: join_game_request)

          returned_json = JSON.parse(response.body)["joined_game"]
          game_hash = Game.all[1].serializable_hash

          expect(returned_json["id"]).to eq game_hash["id"]
          expect(returned_json["creator_id"]).to eq game_hash["creator_id"]
          expect(returned_json["joiner_id"]).to eq game_hash["joiner_id"]
        end
        # test the sad paths
      end

      context "for a switch-turns request" do

        before(:each) do
          @creator = FactoryGirl.create(:user)
          @joiner = FactoryGirl.create(:user)
          @test_game = FactoryGirl.create(:game,
            creator: @creator,
            joiner: @joiner,
            started: true
          )
          @test_game.active_player_id = @test_game.white_id
        end

        let!(:switch_turns_request_black) do
          {
            patchType: "switch-turns",
            activeColor: 'black'
          }.to_json
        end

        let!(:switch_turns_request_white) do
          {
            patchType: "switch-turns",
            activeColor: 'white'
          }.to_json
        end

        it "should set the value of the active player's id to id of the other player in the game" do
          expect(@test_game.active_player_id).to eq @test_game.white_id

          patch(:update, params: { id: @test_game.id }, body: switch_turns_request_black)
          @test_game = Game.find(@test_game.id)

          expect(@test_game.active_player_id).to eq @test_game.black_id

          patch(:update, params: { id: @test_game.id }, body: switch_turns_request_white)
          @test_game = Game.find(@test_game.id)

          expect(@test_game.active_player_id).to eq @test_game.white_id
        end

        it "should respond by rendering a javascript object in JSON" do
          patch(:update, params: { id: @test_game.id }, body: switch_turns_request_black)

          expect(response.status).to eq 200
          expect(response.content_type).to eq "application/json"
          expect{ JSON.parse(response.body) }.not_to raise_error
        end

        it "should respond by rendering the affected game as a JS object" do
          patch(:update, params: { id: @test_game.id }, body: switch_turns_request_black)

          returned_json = JSON.parse(response.body)["updated_game"]
          @test_game = Game.find(@test_game.id)
          game_hash = @test_game.serializable_hash

          expect(returned_json["id"]).to eq game_hash["id"]
          expect(returned_json["creator_id"]).to eq game_hash["creator_id"]
          expect(returned_json["joiner_id"]).to eq game_hash["joiner_id"]
          expect(returned_json["active_player_id"]).to eq game_hash["active_player_id"]
        end
      end
    end

  end
end

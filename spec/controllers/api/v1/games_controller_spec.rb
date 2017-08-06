require 'rails_helper'

RSpec.describe Api::V1::GamesController, type: :controller do
  fdescribe "GET#index" do

    before(:each) do
      @bobby_f = FactoryGirl.create(:user, username: "bfischer")
      @john_a = FactoryGirl.create(:user, username: "jakers")
      session[:user_id] = @bobby_f.id
      FactoryGirl.create(:game, creator: @bobby_f, show_legal_moves: false)
      FactoryGirl.create(:game, creator: @john_a)
    end

    after(:each) do
      session[:user_id] = nil
    end

    it "should respond by rendering a javascript object in JSON" do
      get :index

      expect(response.status).to eq 200
      expect(response.content_type).to eq "application/json"
      returned_json = JSON.parse(response.body)
    end

    it "should render a list of games with the correct length" do
      get :index
      returned_json = JSON.parse(response.body)

      expect(returned_json.length).to eq 1
      expect(returned_json["games"].length).to eq 2
    end

    it "should render a list of games with the correct creator information" do
      get :index
      returned_json = JSON.parse(response.body)

      bobbys_game = returned_json["games"][0]
      johns_game = returned_json["games"][1]

      expect(bobbys_game["creator_id"]).to eq @bobby_f.id
      expect(johns_game["creator_id"]).to eq @john_a.id
    end

    it "should render a list of games with the correct 'my_game' information" do
      get :index
      returned_json = JSON.parse(response.body)

      bobbys_game = returned_json["games"][0]
      johns_game = returned_json["games"][1]

      expect(bobbys_game["my_game"]).to eq true
      expect(johns_game["my_game"]).to eq false
    end

    it "should render a list of games with the correct 'playing_this_game' information" do
      get :index
      returned_json = JSON.parse(response.body)

      bobbys_game = returned_json["games"][0]
      johns_game = returned_json["games"][1]

      expect(bobbys_game["playing_this_game"]).to eq true
      expect(johns_game["playing_this_game"]).to eq false
    end

    it "should render a list of games with the correct :show_legal_moves information" do
      get :index
      returned_json = JSON.parse(response.body)

      bobbys_game = returned_json["games"][0]
      johns_game = returned_json["games"][1]

      expect(bobbys_game["show_legal_moves"]).to eq false
      expect(johns_game["show_legal_moves"]).to eq true
    end

    it "should render a list of games with the correct :started information" do
      get :index
      returned_json = JSON.parse(response.body)

      bobbys_game = returned_json["games"][0]
      johns_game = returned_json["games"][1]

      expect(bobbys_game["started"]).to eq false
      expect(johns_game["started"]).to eq false
    end
  end
end
require 'rails_helper'

RSpec.describe Api::V1::GamesController, type: :controller do
  describe "GET#index" do

    before(:each) do
      @bobby_f = FactoryGirl.create(:user, username: "bfischer")
      @john_a = FactoryGirl.create(:user, username: "jakers")
      FactoryGirl.create(:game, creator: @bobby_f, show_legal_moves: false)
      FactoryGirl.create(:game, creator: @john_a, public_game: true)
    end

    it "should render a list of games with the correct length" do
      get :index
      returned_json = JSON.parse(response.body)
      expect(response.status).to eq 200
      expect(response.content_type).to eq "application/json"

      expect(returned_json.length).to eq 1
      expect(returned_json["games"].length).to eq 2
    end

    it "should render a list of games with the correct creator information" do
      get :index
      returned_json = JSON.parse(response.body)
      expect(response.status).to eq 200
      expect(response.content_type).to eq "application/json"

      bobbys_game = returned_json["games"][0]
      johns_game = returned_json["games"][1]

      expect(bobbys_game["creator_id"]).to eq @bobby_f.id
      expect(johns_game["creator_id"]).to eq @john_a.id
    end

    it "should render a list of games with the correct public/private information" do
      get :index
      returned_json = JSON.parse(response.body)
      expect(response.status).to eq 200
      expect(response.content_type).to eq "application/json"

      bobbys_game = returned_json["games"][0]
      johns_game = returned_json["games"][1]

      expect(bobbys_game["public_game"]).to eq false
      expect(johns_game["public_game"]).to eq true
    end

    it "should render a list of games with the correct :show_legal_moves information" do
      get :index
      returned_json = JSON.parse(response.body)
      expect(response.status).to eq 200
      expect(response.content_type).to eq "application/json"

      bobbys_game = returned_json["games"][0]
      johns_game = returned_json["games"][1]

      expect(bobbys_game["show_legal_moves"]).to eq false
      expect(johns_game["show_legal_moves"]).to eq true
    end

    it "should render a list of games with the correct :started information" do
      get :index
      returned_json = JSON.parse(response.body)
      expect(response.status).to eq 200
      expect(response.content_type).to eq "application/json"

      bobbys_game = returned_json["games"][0]
      johns_game = returned_json["games"][1]

      expect(bobbys_game["started"]).to eq false
      expect(johns_game["started"]).to eq false
    end
  end
end

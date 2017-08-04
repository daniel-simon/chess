require 'rails_helper'

RSpec.describe Move, type: :model do
  it { should belong_to(:game) }

  it { should have_valid(:origin_col).when(0, 1, 2, 3, 4, 5, 6, 7) }
  it { should have_valid(:origin_row).when(0, 1, 2, 3, 4, 5, 6, 7) }
  it { should have_valid(:destination_col).when(0, 1, 2, 3, 4, 5, 6, 7) }
  it { should have_valid(:destination_row).when(0, 1, 2, 3, 4, 5, 6, 7) }

  it { should_not have_valid(:origin_col).when(-1, 2.3, 8, 20, nil, 'bob') }
  it { should_not have_valid(:origin_row).when(-1, 2.3, 8, 20, nil, 'bob') }
  it { should_not have_valid(:destination_col).when(-1, 2.3, 8, 20, nil, 'bob') }
  it { should_not have_valid(:destination_row).when(-1, 2.3, 8, 20, nil, 'bob') }

  it { should have_valid(:player_color).when('white', 'black') }
  it { should_not have_valid(:player_color).when('', nil, 'red', 4) }

  it { should have_valid(:move_number).when(0, 5, 38) }
  it { should_not have_valid(:move_number).when(nil, '', -3) }

  it { should have_valid(:moved_piece).when('pawn', 'rook', 'knight', 'bishop', 'queen', 'king') }
  it { should_not have_valid(:moved_piece).when('', nil, 4, 'jimbob') }

  it { should have_valid(:captured_piece).when(nil, 'pawn', 'rook', 'knight', 'bishop', 'queen') }
  it { should_not have_valid(:captured_piece).when('king', 'jed', 4) }

  context "array methods" do
    before(:each) do
      @test_move = FactoryGirl.create(:move)
    end

    describe "#origin" do

      it "should return an array" do
        expect(@test_move.origin).to be_a Array
      end

      it "should return an array with two elements" do
        expect(@test_move.origin.length).to eq 2
      end

      it "should return an array in the format of [col, row]" do
        expect(@test_move.origin[0]).to eq @test_move.origin_col
        expect(@test_move.origin[1]).to eq @test_move.origin_row
      end
    end

    describe "#destination" do

      it "should return an array" do
        expect(@test_move.destination).to be_a Array
      end

      it "should return an array with two elements" do
        expect(@test_move.destination.length).to eq 2
      end

      it "should return an array in the format of [col, row]" do
        expect(@test_move.destination[0]).to eq @test_move.destination_col
        expect(@test_move.destination[1]).to eq @test_move.destination_row
      end
    end
  end

end

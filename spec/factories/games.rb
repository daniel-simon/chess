FactoryGirl.define do
  factory :game do
    creator { FactoryGirl.create(:user) }
    show_legal_moves { [true, false][rand 0..1] }
  end
end

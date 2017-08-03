FactoryGirl.define do
  factory :game do
    creator { FactoryGirl.create(:user) }
  end
end

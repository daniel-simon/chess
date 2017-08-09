FactoryGirl.define do
  factory :user do
    username { Faker::Name.unique.first_name }
    email { Faker::Internet.unique.email }
    password "password"
  end
end

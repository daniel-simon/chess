FactoryGirl.define do
  factory :user do
    username { Faker::Name.unique.name }
    email { Faker::Internet.unique.email }
    password_digest { Faker::Name.name }
  end
end

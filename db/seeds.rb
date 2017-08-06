# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

dan = FactoryGirl.create(:user, username: "dantheman", email: "d@n.com", password: "dan")
FactoryGirl.create(:user, username: "test", email: "test", password: "test")
dave = FactoryGirl.create(:user, username: "davey", email: "d@ve.com", password: "dave")
game1 = Game.create(creator: dan)
game2 = Game.create(creator: dave, started: true)
game3 = Game.create(creator: dave)

# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170801024915) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "games", force: :cascade do |t|
    t.bigint "creator_id", null: false
    t.bigint "joiner_id"
    t.boolean "public_game", default: false, null: false
    t.boolean "show_legal_moves", default: true, null: false
    t.boolean "started", default: false, null: false
    t.bigint "active_player_id"
    t.bigint "inactive_player_id"
    t.bigint "white_id"
    t.bigint "black_id"
    t.bigint "winner_id"
    t.bigint "loser_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active_player_id"], name: "index_games_on_active_player_id"
    t.index ["black_id"], name: "index_games_on_black_id"
    t.index ["creator_id"], name: "index_games_on_creator_id"
    t.index ["inactive_player_id"], name: "index_games_on_inactive_player_id"
    t.index ["joiner_id"], name: "index_games_on_joiner_id"
    t.index ["loser_id"], name: "index_games_on_loser_id"
    t.index ["white_id"], name: "index_games_on_white_id"
    t.index ["winner_id"], name: "index_games_on_winner_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end

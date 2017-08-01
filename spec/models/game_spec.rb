require 'rails_helper'

RSpec.describe Game, type: :model do
  it { should belong_to(:creator) }
  it { should belong_to(:joiner) }
  it { should belong_to(:active_player) }
  it { should belong_to(:inactive_player) }
  it { should belong_to(:white) }
  it { should belong_to(:black) }
  it { should belong_to(:winner) }
  it { should belong_to(:loser) }
end

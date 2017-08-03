require 'rails_helper'

RSpec.describe Game, type: :model do
  it { should belong_to(:creator) }
  it { should belong_to(:joiner) }
  it { should belong_to(:winner) }
  it { should belong_to(:loser) }
end

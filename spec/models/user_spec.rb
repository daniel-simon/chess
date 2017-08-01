require 'rails_helper'

RSpec.describe User, type: :model do
  it { should have_valid(:username).when('Dan') }
  it { should have_valid(:username).when('Dan_S') }
  it { should_not have_valid(:username).when('Dan S') }
  it { should_not have_valid(:username).when('Ds') }
  it { should_not have_valid(:username).when('', nil) }
  it { should have_secure_password }
end

require 'rails_helper'

feature 'User registration' do
  scenario 'user visits sign up page' do
    visit '/'
    click_on 'Sign up'

    expect(page).to have_content('Create your account')
  end

  scenario 'user fills all fields and submits' do
    visit '/'
    click_on 'Sign up'

    fill_in 'Username', with: 'TestUser'
    fill_in 'Email', with: 'TestUser@launch.com'
    fill_in 'Password', with: 'TestUserPassword'
    fill_in 'Confirm Password', with: 'TestUserPassword'

    click_on 'Sign up'

    expect(page).to have_content('Account successfully created')
  end

  scenario "user doesn't fill in email and submit fails" do
    visit '/'
    click_on 'Sign up'

    fill_in 'Username', with: 'TestUser'
    fill_in 'Password', with: 'TestUserPassword'
    fill_in 'Confirm Password', with: 'TestUserPassword'

    click_on 'Sign up'

    expect(page).to have_content('Failed to create account')
  end

  scenario "user doesn't fill in username and submit fails" do
    visit '/'
    click_on 'Sign up'

    fill_in 'Email', with: 'TestUser@launch.com'
    fill_in 'Password', with: 'TestUserPassword'
    fill_in 'Confirm Password', with: 'TestUserPassword'

    click_on 'Sign up'

    expect(page).to have_content('Failed to create account')
  end

  scenario "password and confirmation don't match" do
    visit '/'
    click_on 'Sign u'

    fill_in 'Username', with: 'TestUser'
    fill_in 'Email', with: 'TestUser@launch.com'
    fill_in 'Password', with: 'I got my own '
    fill_in 'Confirm Password', with: ' password wrong :('

    click_on 'Sign up'

    expect(page).to have_content('Failed to create account')
  end

end

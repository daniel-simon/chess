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

    expect(page).to have_content('Account created successfully')
  end

  scenario 'user does not fill all fields and submit fails' do
    visit '/'
    click_on 'Sign up'

    fill_in 'Username', with: 'TestUser'
    fill_in 'Password', with: 'TestUserPassword'

    click_button 'Sign up'

    expect(page).to have_content('Failed to create account')
  end

end

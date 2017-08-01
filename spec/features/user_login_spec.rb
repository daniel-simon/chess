require 'rails_helper'

feature 'User logs in' do
  scenario 'user visits log in page' do
    visit '/'

    expect(page).to have_content('Log in')
  end

  scenario 'user fills all fields and submits' do
    test_user = FactoryGirl.create(:user)
    visit '/'
    fill_in 'Email', with: test_user.email
    fill_in 'Password', with: test_user.password

    click_on 'Log in'

    expect(page).to have_content('IT WORKED!')
  end

  scenario 'user does not enter a password' do
    visit '/'

    fill_in 'Email', with: 'TestUser'

    click_on 'Log in'

    expect(page).to have_content('Please enter a password')
    expect(page).to have_no_content('IT WORKED!')
  end

  scenario 'user does not enter an email address' do
    visit '/'

    fill_in 'Password', with: 'TestUser'

    click_on 'Log in'

    expect(page).to have_content('Please enter an email address')
    expect(page).to have_no_content('IT WORKED!')
  end

  scenario 'user does not enter an email/password pair found in the database' do
    visit '/'

    fill_in 'Email', with: 'TestUser'
    fill_in 'Password', with: 'TestUser'

    click_on 'Log in'

    expect(page).to have_content('Invalid email address or password')
    expect(page).to have_no_content('IT WORKED!')
  end

end

class User < ApplicationRecord
  validates :username,
    presence: true,
    length: { in: 3..20 },
    format: { with: /\A[a-zA-Z0-9_-]+\z/ }
  has_secure_password
end

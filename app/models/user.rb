class User < ApplicationRecord
  #has_many :moves
  validates :username,
    presence: true,
    length: { in: 3..20 },
    format: { with: /\A[a-zA-Z0-9_-]+\z/ },
    uniqueness: true
  has_secure_password
end

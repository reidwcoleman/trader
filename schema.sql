-- Create family_users table in Neon database
CREATE TABLE IF NOT EXISTS family_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  family_access BOOLEAN DEFAULT false,
  family_access_granted_at TIMESTAMP,
  stripe_session_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_family_users_email ON family_users(LOWER(email));

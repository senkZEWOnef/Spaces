-- USERS table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamp default now()
);

-- SPACES table
create table if not exists spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date text not null,
  slug text not null,
  image_url text,
  description text,
  is_public boolean default false,
  created_by uuid not null references users(id),
  created_at timestamp default now(),
  views integer default 0,
  uploads integer default 0
);

-- COHOSTS table
create table if not exists cohosts (
  id uuid primary key default gen_random_uuid(),
  space_id uuid references spaces(id) on delete cascade,
  cohost_id uuid references users(id) on delete cascade,
  created_at timestamp default now()
);

-- PHOTOS table
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  space_slug text not null,
  url text,
  approved boolean default false,
  created_at timestamp default now()
);

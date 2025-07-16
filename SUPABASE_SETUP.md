# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for your Translatea2z application.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `translatea2z` (or your preferred name)
   - Database password: Create a strong password
   - Region: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (usually takes 1-2 minutes)

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xyzcompany.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Update Your Environment File

1. Open the `.env` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

**Important**: Make sure to add `.env` to your `.gitignore` file to keep your credentials secure!

## 4. Configure Authentication Providers

### Email Authentication (Already Configured)

Email authentication is enabled by default and will work immediately after updating your environment variables.

### Google OAuth Setup

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Scroll down to **External OAuth Providers**
3. Find **Google** and click **Enable**
4. You'll need to create a Google OAuth app:

#### Create Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API"
   - Click it and press **Enable**
4. Create OAuth credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Name it "Translatea2z Auth"
   - Add authorized redirect URIs:
     - For development: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
     - For production: `https://YOUR_DOMAIN.com/auth/v1/callback` (replace with your actual domain)
   - Click **Create**
5. Copy the **Client ID** and **Client Secret**

#### Configure in Supabase:

1. Back in Supabase, paste your Google credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
2. Click **Save**

## 5. Set Up Authentication Tables (Optional)

If you want to store additional user profile information:

1. Go to **Table Editor** in Supabase
2. The `auth.users` table is created automatically
3. You can create a `profiles` table for additional user data:

```sql
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 6. Test Your Setup

1. Start your development server: `yarn dev`
2. Go to your application
3. Click the login button
4. Try signing up with email
5. Check your email for the confirmation link
6. Try logging in
7. Test Google sign-in

## 7. Email Configuration (Production)

For production, you'll want to configure custom email templates:

1. Go to **Authentication** > **Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link
3. Update the redirect URLs to point to your production domain

## 8. Security Best Practices

1. **Environment Variables**: Never commit your `.env` file
2. **RLS (Row Level Security)**: Always enable RLS on your tables
3. **HTTPS**: Always use HTTPS in production
4. **Redirect URLs**: Whitelist only your actual domains in OAuth settings

## Troubleshooting

### Common Issues:

1. **"Invalid login credentials"**: Check that email confirmation is working
2. **Google OAuth not working**: Verify redirect URLs match exactly
3. **Environment variables not loading**: Restart your dev server after updating `.env`
4. **CORS errors**: Check that your domain is added to Supabase allowed origins

### Debug Tips:

1. Check the browser console for detailed error messages
2. Check the Supabase logs in your dashboard
3. Verify your environment variables are loaded correctly
4. Test authentication in Supabase's built-in auth UI first

## Support

If you encounter issues:

1. Check the [Supabase documentation](https://supabase.com/docs/guides/auth)
2. Visit the [Supabase Discord community](https://discord.supabase.com/)
3. Check [GitHub issues](https://github.com/supabase/supabase/issues) for known problems

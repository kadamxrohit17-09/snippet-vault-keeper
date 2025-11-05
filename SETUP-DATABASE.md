# Database Setup Instructions

## Quick Setup Steps

### 1. Create `.env.local` file
The `.env.local` file has been created with your Supabase credentials.

### 2. Run SQL Migration in Supabase Dashboard

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Navigate to your project: `oefoazdbtxvtrauqpkyf`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration**
   - Open the file `setup-database.sql` from your project
   - Copy **ALL** the SQL code from `setup-database.sql`
   - Paste it into the SQL Editor in Supabase Dashboard
   - Click "Run" (or press Ctrl+Enter)
   

4. **Verify Tables Were Created**
   - Go to "Table Editor" in the left sidebar
   - You should see:
     - ✅ `snippets` table
     - ✅ `snippet_shares` table
   - Go to "Storage" → "Buckets"
   - You should see:
     - ✅ `snippet-attachments` bucket

### 3. Test the Connection

After running the SQL, your frontend should be able to:
- ✅ Register/Login users
- ✅ Create, read, update, delete snippets
- ✅ Share snippets via tokens
- ✅ Upload attachments (if implemented)

## Troubleshooting

### If you get "relation already exists" errors:
- The tables already exist. This is fine - the script uses `IF NOT EXISTS` clauses.
- You can ignore those errors, or drop the tables first if you want a fresh start.

### If RLS policies conflict:
- The script drops existing policies before creating new ones.
- If you still get errors, manually delete the policies from the Dashboard first.

### If storage bucket already exists:
- The script uses `ON CONFLICT DO NOTHING` so it won't error.
- Check Storage → Buckets to verify.

## What Gets Created

### Tables:
1. **snippets** - Stores code snippets with:
   - id, user_id, title, description, code, language, tags
   - created_at, updated_at timestamps

2. **snippet_shares** - Stores shareable links with:
   - id, snippet_id, share_token, created_at, expires_at, view_count

### Security:
- ✅ Row Level Security (RLS) enabled on both tables
- ✅ Users can only access their own snippets
- ✅ Storage policies for file uploads

### Features:
- ✅ Automatic timestamp updates via trigger
- ✅ Realtime subscriptions enabled
- ✅ Performance indexes on key columns

## Next Steps

Once the database is set up:
1. Run `run.bat` to start your frontend
2. Register a new user account
3. Create your first code snippet!


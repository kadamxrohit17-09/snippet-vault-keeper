# Database Migration Instructions

## Run Migration for New Features

To enable the new features (Favorites and Copy Count), you need to run a database migration.

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New query"

### Step 2: Run the Migration

1. Open the file: `supabase/migrations/20250101000000_add_favorites_and_copy_count.sql`
2. Copy **ALL** the SQL code from that file
3. Paste it into the SQL Editor in Supabase Dashboard
4. Click "Run" (or press Ctrl+Enter)

### Step 3: Verify the Migration

1. Go to "Table Editor" in the left sidebar
2. Click on the `snippets` table
3. Verify the new columns exist:
   - ✅ `is_favorite` (boolean, default: false)
   - ✅ `copy_count` (integer, default: 0)

### What This Migration Does

- Adds `is_favorite` column to store favorite status
- Adds `copy_count` column to track copy usage
- Creates indexes for faster queries on favorites and copy counts
- All existing snippets will have `is_favorite = false` and `copy_count = 0`

### Notes

- This migration is safe to run multiple times (uses `IF NOT EXISTS`)
- Existing data will not be affected
- All snippets will start with default values (not favorited, 0 copies)

After running this migration, the new features will be fully functional!


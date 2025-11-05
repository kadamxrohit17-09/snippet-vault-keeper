# HOW TO CREATE .env.local FILE

## ⚠️ CRITICAL: You Need This File!

Your project **will not work** without the `.env.local` file.

## Steps:

1. **Open your project folder** in File Explorer:
   ```
   C:\Users\ROHIT KADAM\snippet-vault-keeper\
   ```

2. **Create a new file** called `.env.local` in the root folder (same place as `package.json`)

3. **Copy and paste EXACTLY this content** into the file:

```env
VITE_SUPABASE_URL=https://oefoazdbtxvtrauqpkyf.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZm9hemRidHh2dHJhdXFwa3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTEwOTQsImV4cCI6MjA3NzMyNzA5NH0.PmAgT3Ug-5LGLNxCQMnMgYtOvQlajHKU7qOouuFn7XI
```

4. **Save the file**

5. **STOP your current dev server** (Ctrl+C in terminal)

6. **Restart the dev server**:
   ```powershell
   & "C:\Program Files\nodejs\npm.cmd" run dev
   ```

---

## How to Create File in Windows:

**Option 1: Notepad**
1. Right-click in the project folder
2. New → Text Document
3. Name it `.env.local` (include the dot at the beginning)
4. Paste the content above
5. Save

**Option 2: PowerShell**
Run this command in your project folder:
```powershell
@"
VITE_SUPABASE_URL=https://oefoazdbtxvtrauqpkyf.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZm9hemRidHh2dHJhdXFwa3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTEwOTQsImV4cCI6MjA3NzMyNzA5NH0.PmAgT3Ug-5LGLNxCQMnMgYtOvQlajHKU7qOouuFn7XI
"@ | Out-File -FilePath ".env.local" -Encoding utf8
```

**Option 3: VS Code / Cursor**
1. Click "New File" in VS Code
2. Name it `.env.local`
3. Paste the content
4. Save

---

## After Creating the File:

✅ Restart your dev server  
✅ Google login will work  
✅ Regular email/password login will work  
✅ Database will connect properly  

## Still Not Working?

If you're still seeing errors after creating `.env.local`, verify:
1. File is in the root folder (same folder as `package.json`)
2. File is named `.env.local` with a dot at the beginning
3. Dev server was restarted after creating the file
4. No typos in the content (copy exactly as shown)


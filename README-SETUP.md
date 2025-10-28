# How to Run Your Project

## Prerequisites
1. **Node.js** must be installed at `C:\Program Files\nodejs`
   - Download from: https://nodejs.org/en
   - Choose LTS version

2. **Supabase Backend** (choose one option):
   
   **Option A: Hosted (Recommended - Fastest)**
   - Go to https://supabase.com/
   - Create a new project
   - In Project Settings → API, copy:
     - Project URL
     - anon public key
   - These will be needed for the `.env.local` file

   **Option B: Local Supabase**
   - Install Docker Desktop: https://www.docker.com/products/docker-desktop
   - Install Supabase CLI from: https://github.com/supabase/cli/releases
   - Download the `.msi` file and install it

## Quick Start

### 1. Configure Backend (if using hosted Supabase)

Create a file named `.env.local` in the project root with:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

If using local Supabase, run `supabase start` and copy the URL and anon key from the output.

### 2. Run the Project

Simply double-click `run.bat` or run it from command prompt:
```cmd
run.bat
```

The server will start at: **http://localhost:8080**

## Troubleshooting

### If `node` is not recognized:
1. Verify Node.js is installed: Open File Explorer and check `C:\Program Files\nodejs\node.exe` exists
2. If not, reinstall Node.js from https://nodejs.org/en

### If port 8080 is already in use:
Edit `vite.config.ts` and change the port number

### If npm install fails with esbuild errors:
Close all other terminals and try again. If still failing, delete `node_modules` folder and `package-lock.json`, then run `run.bat` again.


# CSE Innovation Hub - Complete Setup Guide for Beginners

Welcome to the CSE Innovation Hub! This guide will help you set up the project from scratch, even if you're completely new to web development.

---

## Table of Contents
1. [What You'll Need to Download](#step-1-download-required-software)
2. [Getting the Project](#step-2-download-the-project)
3. [Installing Dependencies](#step-3-install-project-dependencies)
4. [Running the Application](#step-4-run-the-application)
5. [Understanding the Project](#step-5-understand-the-project-structure)
6. [Deployment Guide](#step-6-deploy-to-vercel)
7. [MySQL Database Setup (Optional)](#step-7-mysql-database-setup-optional)
8. [Troubleshooting](#troubleshooting)

---

## Step 1: Download Required Software

### 1.1 Install Node.js
Node.js is a JavaScript runtime that lets you run this web application on your computer.

**Download Link:** https://nodejs.org/

- Click the **LTS (Long Term Support)** version button (recommended for most users)
- For Windows: Download the `.msi` installer
- For Mac: Download the `.pkg` installer
- For Linux: Use your package manager or download from the website

**Installation:**
1. Run the downloaded installer
2. Click "Next" through all the steps (keep default settings)
3. Wait for installation to complete
4. Click "Finish"

**Verify Installation:**
1. Open Command Prompt (Windows) or Terminal (Mac/Linux)
   - Windows: Press `Win + R`, type `cmd`, press Enter
   - Mac: Press `Cmd + Space`, type `terminal`, press Enter
2. Type: `node --version`
3. You should see something like `v20.x.x`
4. Type: `npm --version`
5. You should see something like `10.x.x`

If you see version numbers, you're ready to go!

---

### 1.2 Install Visual Studio Code (Code Editor)
VS Code is a free code editor that makes it easy to view and edit your project files.

**Download Link:** https://code.visualstudio.com/

**Installation:**
1. Download the installer for your operating system
2. Run the installer
3. Accept the license agreement
4. Keep all default options checked
5. Click "Install" and wait
6. Click "Finish"

---

### 1.3 Install Git (Version Control - Optional but Recommended)
Git helps you track changes and download projects from GitHub.

**Download Link:** https://git-scm.com/downloads

**Installation:**
1. Download for your operating system
2. Run the installer
3. Keep all default settings (just click "Next" through everything)
4. Click "Finish"

**Verify Installation:**
1. Open Command Prompt/Terminal
2. Type: `git --version`
3. You should see something like `git version 2.x.x`

---

## Step 2: Download the Project

You have two options to get the project files:

### Option A: Download from v0.dev (Easiest)
1. Click the **3-dot menu** (⋯) in the top-right of the v0 interface
2. Select **"Download ZIP"**
3. Save the file to your Desktop or Documents folder
4. Right-click the ZIP file and select "Extract All"
5. Choose a location to extract (e.g., `C:\Projects\cse-hub` or `~/Projects/cse-hub`)

### Option B: Download from GitHub (If Pushed)
1. Go to your GitHub repository
2. Click the green **"Code"** button
3. Select **"Download ZIP"**
4. Extract as described above

---

## Step 3: Install Project Dependencies

Dependencies are pre-built code libraries that the project needs to run.

1. **Open the project in VS Code:**
   - Open VS Code
   - Click `File` → `Open Folder`
   - Navigate to where you extracted the project
   - Select the folder and click "Open"

2. **Open the Terminal in VS Code:**
   - Click `Terminal` → `New Terminal` (or press `` Ctrl + ` ``)
   - You should see a terminal panel at the bottom

3. **Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`
   
   This will take 1-3 minutes. You'll see a progress bar and lots of text scrolling. **This is normal!**
   
   When it's done, you'll see a message like:
   \`\`\`
   added 245 packages in 45s
   \`\`\`

---

## Step 4: Run the Application

1. **Start the Development Server:**
   In the VS Code terminal, type:
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Wait for the Server to Start:**
   You'll see output like:
   \`\`\`
   j▲ Next.js 15.x.x
   - Local: http://localhost:3000
   ✓ Ready in 2.5s
   \`\`\`

3. **Open in Browser:**
   - Open your web browser (Chrome, Firefox, Edge, Safari)
   - Go to: **http://localhost:3000**
   - You should see the CSE Innovation Hub homepage!

4. **Keep the Terminal Running:**
   - Do NOT close the terminal window while using the app
   - The app only works while `npm run dev` is running
   - To stop the server: Press `Ctrl + C` in the terminal

---

## Step 5: Understand the Project Structure

Here's what each folder does:

\`\`\`
cse-innovation-hub/
│
├── app/                      # All pages of your website
│   ├── page.tsx             # Homepage (/)
│   ├── login/page.tsx       # Login page (/login)
│   ├── register/page.tsx    # Register page (/register)
│   ├── dashboard/page.tsx   # Dashboard (/dashboard)
│   ├── events/page.tsx      # Events page (/events)
│   ├── jobs/page.tsx        # Jobs page (/jobs)
│   ├── placements/page.tsx  # Placements page (/placements)
│   ├── innovation/page.tsx  # Innovation Hub (/innovation)
│   ├── layout.tsx           # Main layout wrapper
│   └── globals.css          # Global styles
│
├── components/              # Reusable components
│   ├── navbar.tsx          # Navigation bar
│   └── ui/                 # Shadcn UI components
│
├── lib/                     # Helper functions
│   ├── auth.ts             # Authentication logic
│   ├── data.ts             # Mock data (events, jobs, etc.)
│   └── utils.ts            # Utility functions
│
├── database/                # Database files
│   └── schema.sql          # MySQL database schema
│
├── public/                  # Static files (images, etc.)
│
├── package.json            # Project dependencies
├── next.config.mjs         # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file!
\`\`\`

---

## Step 6: Deploy to Vercel (Make It Live on the Internet)

Vercel is a free hosting platform made by the creators of Next.js.

### 6.1 Create a Vercel Account
1. Go to: https://vercel.com/signup
2. Sign up with GitHub (recommended) or email
3. Follow the prompts to create your account

### 6.2 Deploy from v0.dev (Easiest Method)
1. In v0.dev interface, click the **"Publish"** button
2. Connect to your Vercel account if prompted
3. Choose a project name (e.g., `cse-innovation-hub`)
4. Click "Deploy"
5. Wait 1-2 minutes
6. You'll get a live URL like: `cse-innovation-hub.vercel.app`

### 6.3 Deploy from GitHub (Alternative)
1. Push your code to GitHub:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cse-hub.git
   git push -u origin main
   \`\`\`

2. Go to Vercel Dashboard: https://vercel.com/dashboard
3. Click **"New Project"**
4. Import your GitHub repository
5. Click **"Deploy"**
6. Wait for deployment (usually 1-2 minutes)
7. Your site is now live!

---

## Step 7: MySQL Database Setup (Optional - Future Enhancement)

The current version uses browser localStorage (temporary storage). To use a real database:

### 7.1 Install MySQL
**Download:** https://dev.mysql.com/downloads/mysql/

**For Windows:**
1. Download MySQL Installer
2. Choose "Developer Default"
3. Follow installation wizard
4. Set root password (remember this!)

**For Mac:**
1. Download DMG Archive
2. Install MySQL
3. Set root password in System Preferences

### 7.2 Create the Database
1. Open MySQL Workbench or Command Line
2. Log in with your root password
3. Run the SQL script:
   \`\`\`bash
   mysql -u root -p < database/schema.sql
   \`\`\`

### 7.3 Connect to MySQL (Requires Backend Integration)
This step requires Java/Node.js backend setup. The current version is frontend-only, but the SQL schema is ready for future integration.

---

## How to Use the Application

### For Students:
1. **Register:** Go to `/register` and create an account
   - Enter your name, email, roll number, department, and year
   - Click "Register"

2. **Login:** Go to `/login` and sign in
   - Use the email and password you registered with
   - Click "Sign In"

3. **Dashboard:** After login, you'll see the main dashboard with:
   - Quick stats about events, jobs, and placements
   - Quick access buttons to all sections

4. **Explore:**
   - **Events:** View and filter upcoming workshops, hackathons, seminars
   - **Jobs:** Browse job listings, filter by type, view details
   - **Placements:** Access placement resources and guidelines
   - **Innovation:** Showcase your projects (coming soon)

### Demo Credentials:
For testing, you can login with ANY email and password if you haven't registered. The system will let you in automatically.

---

## Troubleshooting

### "npm is not recognized"
**Problem:** Node.js isn't installed or not in PATH

**Solution:**
1. Reinstall Node.js from https://nodejs.org/
2. Restart your computer
3. Try again

### "Cannot find module"
**Problem:** Dependencies not installed

**Solution:**
\`\`\`bash
npm install
\`\`\`

### "Port 3000 is already in use"
**Problem:** Another app is using port 3000

**Solution:**
1. Close other apps using port 3000, or
2. Use a different port:
   \`\`\`bash
   npm run dev -- -p 3001
   \`\`\`
   Then visit: http://localhost:3001

### "Page not found" errors
**Problem:** You might have typos in the URL

**Solution:**
- Make sure you're using the correct routes:
  - `/` - Homepage
  - `/login` - Login page
  - `/register` - Register page
  - `/dashboard` - Dashboard
  - `/events` - Events page
  - `/jobs` - Jobs page
  - `/placements` - Placements page
  - `/innovation` - Innovation hub

### Application is slow
**Problem:** Development mode can be slower

**Solution:**
- This is normal in development mode
- When deployed to Vercel, it will be much faster
- You can also build for production locally:
  \`\`\`bash
  npm run build
  npm start
  \`\`\`

---

## Making Changes to the Code

1. **Edit Files:**
   - Open any file in VS Code
   - Make your changes
   - Save the file (`Ctrl + S` or `Cmd + S`)

2. **See Changes Live:**
   - The browser will automatically reload
   - This is called "Hot Reloading"

3. **Common Files to Edit:**
   - **Colors:** `app/globals.css` (change CSS variables)
   - **Data:** `lib/data.ts` (change events, jobs, etc.)
   - **Pages:** Files in `app/` folder
   - **Navigation:** `components/navbar.tsx`

---

## Project Features

### Current Features:
- User Registration & Login
- Dashboard with Statistics
- Events Listing with Filters
- Jobs Board with Search
- Placement Resources
- Innovation Hub Page
- Responsive Design (works on mobile)
- Dark Theme (RSA-inspired)

### Coming Soon:
- Real Database Integration
- Email Notifications
- Admin Panel
- Resume Upload
- Project Showcase
- User Profiles
- Advanced Search

---

## Next Steps

1. **Customize the Design:**
   - Change colors in `app/globals.css`
   - Update logo and images
   - Modify text content

2. **Add Real Data:**
   - Edit `lib/data.ts` to add real events and jobs
   - Connect to a database for persistent storage

3. **Add Features:**
   - Email notifications
   - File upload for resumes
   - Admin dashboard
   - Search functionality
   - User profiles

4. **Learn More:**
   - Next.js: https://nextjs.org/learn
   - React: https://react.dev/learn
   - TypeScript: https://www.typescriptlang.org/docs/
   - Tailwind CSS: https://tailwindcss.com/docs

---

## Support

If you run into issues:
1. Check the Troubleshooting section above
2. Read the error message carefully
3. Search for the error on Google
4. Ask on Stack Overflow
5. Check Next.js documentation

---

**Congratulations!** You now have a fully functional CSE Innovation Hub running on your computer. Happy coding!

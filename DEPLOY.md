# How to Deploy Belajar! to Vercel

The app is ready for deployment. Since Vercel requires authentication via your browser, you'll need to run the final command from your terminal.

## Option 1: Direct Command Line Deployment (Easiest)

1.  Open your terminal.
2.  Navigate to the app directory:
    ```bash
    cd deliverables/LearnIndonesia/app
    ```
3.  Run the deployment command:
    ```bash
    npx vercel
    ```
    *   It will ask you to log in (if not already logged in).
    *   It will ask a few questions (accept all defaults by pressing Enter):
        *   Set up and deploy? [Y/n] **Y**
        *   Which scope? **(Select your account)**
        *   Link to existing project? [y/N] **N**
        *   Project name? **learn-indonesia-app** (or similar)
        *   In which directory is your code located? **./**
        *   Want to modify these settings? [y/N] **N**

4.  **Done!** It will give you a production URL (e.g., `https://learn-indonesia-app.vercel.app`).

## Option 2: Deploy via GitHub

1.  Initialize a git repository in `deliverables/LearnIndonesia/app`.
2.  Push it to a new GitHub repository.
3.  Go to [Vercel Dashboard](https://vercel.com/dashboard) -> **Add New...** -> **Project**.
4.  Import your GitHub repository.
5.  Vercel will detect Vite and deploy automatically.

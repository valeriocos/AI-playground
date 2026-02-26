---
description: How to deploy this project to Vercel
---

This project is a static site. You can deploy it to Vercel in a few simple steps.

### Method 1: Using the Vercel CLI (Quickest)

1. **Install Vercel CLI** (if you haven't already):
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   From the root of this project, run:
   ```bash
   vercel
   ```
   Follow the prompts. Since it's a static site with an `index.html` in the root, Vercel will detect it automatically.

### Method 2: GitHub Integration (Recommended for CD)

1. **Initialize a Git repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**:
   - Create a new repository on GitHub.
   - Follow the instructions to push your local repo:
     ```bash
     git remote add origin https://github.com/yourusername/your-repo.git
     git branch -M main
     git push -u origin main
     ```

3. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com).
   - Click **Add New** > **Project**.
   - Import your GitHub repository.
   - Click **Deploy**.

### Method 3: Manual Upload (Zero Setup)

1. Go to [vercel.com/new](https://vercel.com/new).
2. Drag and drop the project folder directly into the deployment area.

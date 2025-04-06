#!/bin/bash

# Script to initialize git repository and push to GitHub
# Usage: ./setup-github.sh <github_username>

if [ $# -eq 0 ]; then
    echo "Usage: ./setup-github.sh <github_username>"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="School_Platform"

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    echo "Git repository initialized."
else
    echo "Git repository already initialized."
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore file..."
    cat > .gitignore << EOL
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOL
    echo ".gitignore file created."
else
    echo ".gitignore file already exists."
fi

# Add all files to git
echo "Adding files to git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Initial commit: EdPsychConnect platform with AI Lab and enhanced features"

# Create GitHub repository using GitHub CLI if installed
if command -v gh &> /dev/null; then
    echo "Creating GitHub repository using GitHub CLI..."
    gh repo create $GITHUB_USERNAME/$REPO_NAME --public --source=. --remote=origin
else
    # Add GitHub remote
    echo "Adding GitHub remote..."
    git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
    
    echo "Please create a repository named $REPO_NAME on GitHub manually."
    echo "Then push the code with: git push -u origin main"
    exit 0
fi

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "Repository has been pushed to GitHub: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "You can now deploy it to Vercel by connecting your GitHub repository."
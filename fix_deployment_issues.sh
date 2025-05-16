#!/bin/bash

# Script to fix all deployment issues for School_Platform
echo "Starting comprehensive fix for School_Platform deployment issues..."

# Fix 1: React version conflict
echo "Fixing React version conflict..."
sed -i 's/"react": "\^19.1.0"/"react": "\^18.0.0"/g' package.json
sed -i 's/"react-dom": "\^19.1.0"/"react-dom": "\^18.0.0"/g' package.json
sed -i 's/"@types\/react": "\^19.1.0"/"@types\/react": "\^18.0.0"/g' package.json

# Fix 2: Next.js version downgrade
echo "Downgrading Next.js to stable version..."
sed -i 's/"next": "\^15.2.4"/"next": "\^14.1.0"/g' package.json
sed -i 's/"eslint-config-next": "\^15.2.4"/"eslint-config-next": "\^14.1.0"/g' package.json

# Fix 3: Add coffee-script dependency for vm2
echo "Adding coffee-script dependency..."
npm install --save coffee-script

# Fix 4: Fix TailwindCSS PostCSS plugin issue
echo "Fixing TailwindCSS PostCSS plugin issue..."
npm install --save-dev @tailwindcss/postcss

# Update postcss.config.js
echo "Updating postcss.config.js..."
cat > postcss.config.js << 'EOL'
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
EOL

# Fix 5: Ensure .npmrc has legacy-peer-deps
echo "Ensuring .npmrc has legacy-peer-deps=true..."
echo "legacy-peer-deps=true" > .npmrc

# Fix 6: Update vercel.json with correct configuration
echo "Updating vercel.json configuration..."
cat > vercel.json << 'EOL'
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "installCommand": "npm install --legacy-peer-deps",
        "buildCommand": "prisma generate && next build"
      }
    }
  ]
}
EOL

# Clean up node_modules and package-lock.json
echo "Cleaning up for fresh install..."
rm -rf node_modules
rm -f package-lock.json

echo "Fix completed! Next steps:"
echo "1. Run: npm install --legacy-peer-deps"
echo "2. Commit and push all changes to GitHub"
echo "3. Clear the Vercel build cache before redeploying"
echo "4. Deploy your project on Vercel"
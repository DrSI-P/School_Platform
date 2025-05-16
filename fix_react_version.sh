#!/bin/bash

# Script to fix React version conflict for Vercel deployment
echo "Starting React version conflict fix for School_Platform..."

# Create backups
echo "Creating backups of original files..."
cp package.json package.json.backup
if [ -f package-lock.json ]; then
  cp package-lock.json package-lock.json.backup
fi

# Update package.json to use React 18.0.0
echo "Updating package.json to use React 18.0.0..."
sed -i 's/"@types\/react": "\^19.1.0"/"@types\/react": "\^18.0.0"/g' package.json
sed -i 's/"react": "\^19.1.0"/"react": "\^18.0.0"/g' package.json
sed -i 's/"react-dom": "\^19.1.0"/"react-dom": "\^18.0.0"/g' package.json

# Update Next.js to a stable version
echo "Updating Next.js to version 14.1.0 (stable)..."
sed -i 's/"next": "\^15.2.4"/"next": "\^14.1.0"/g' package.json
sed -i 's/"eslint-config-next": "\^15.2.4"/"eslint-config-next": "\^14.1.0"/g' package.json

# Create .npmrc file
echo "Creating .npmrc file with legacy-peer-deps=true..."
echo "legacy-peer-deps=true" > .npmrc

# Create vercel.json file
echo "Creating vercel.json with custom install and build commands..."
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
echo "Removing node_modules and package-lock.json for clean install..."
rm -rf node_modules
rm -f package-lock.json

echo "Fix completed! Next steps:"
echo "1. Run: npm install --legacy-peer-deps"
echo "2. Commit and push all changes to GitHub"
echo "3. Clear the Vercel build cache before redeploying"
echo "4. Deploy your project on Vercel"
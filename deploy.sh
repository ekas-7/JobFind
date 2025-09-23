#!/usr/bin/env bash

# JobFind - Vercel Deployment Script
# This script prepares and deploys the JobFind app to Vercel

echo "🚀 Preparing JobFind for Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Build steps
echo "📦 Running production build..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "You will need to login to Vercel if not already logged in"
echo "NOTE: Make sure to set these environment variables in the Vercel dashboard:"
echo "- GMAIL_USER=your-gmail@gmail.com"
echo "- GMAIL_APP_PASSWORD=your-app-password"
echo "- NEXT_PUBLIC_APP_URL=your-deployment-url"

# Deploy with Vercel CLI
vercel --prod

echo "✅ Deployment process completed!"
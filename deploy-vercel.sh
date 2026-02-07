#!/bin/bash

echo "🚀 Deploying Taco Town to Vercel..."
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel login..."
vercel login

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your website will be available at the URL shown above"
echo ""
echo "📋 Next steps:"
echo "1. Copy the deployment URL"
echo "2. Test all features (order placement, admin login, etc.)"
echo "3. Update your domain DNS if using custom domain"

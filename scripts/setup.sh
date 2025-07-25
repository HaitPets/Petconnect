#!/bin/bash

# MoPets App Setup Script
# This script sets up the development environment for the MoPets mobile app

set -e

echo "🐾 Setting up MoPets App Development Environment..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_VERSION="18.0.0"
if ! node -e "process.exit(process.versions.node.split('.').map(Number).reduce((a,b,i)=>a+(b<<(8*(2-i))),0) >= '$REQUIRED_VERSION'.split('.').map(Number).reduce((a,b,i)=>a+(b<<(8*(2-i))),0) ? 0 : 1)"; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please install Node.js 18+ and try again."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before running the app"
else
    echo "✅ Environment file already exists"
fi

# Check if PostgreSQL is available
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL detected"
else
    echo "⚠️  PostgreSQL not detected. Please install PostgreSQL for database functionality."
fi

# Generate Prisma client
echo "🗄️  Setting up database schema..."
npx prisma generate

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p public/images/{breeds,users,posts,marketplace}
mkdir -p public/icons
mkdir -p uploads

# Set up Git hooks (if Git is initialized)
if [ -d ".git" ]; then
    echo "🔧 Setting up Git hooks..."
    # Add pre-commit hook for linting
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
npm run lint
npm run type-check
EOF
    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooks configured"
fi

# Create sample images placeholder
echo "🖼️  Setting up image placeholders..."
cat > public/images/placeholder.svg << 'EOF'
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" fill="#6b7280" text-anchor="middle" dy=".3em">MoPets Image Placeholder</text>
</svg>
EOF

# Create basic icon placeholders
for size in 72 96 128 144 152 192 384 512; do
    cat > "public/icons/icon-${size}x${size}.png.placeholder" << EOF
# Placeholder for icon-${size}x${size}.png
# Replace with actual ${size}x${size} PNG icon
EOF
done

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration:"
echo "   - Database URL (PostgreSQL)"
echo "   - Stripe keys"
echo "   - Cloudinary credentials"
echo "   - NextAuth secret"
echo ""
echo "2. Set up your database:"
echo "   npx prisma migrate dev"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Replace image placeholders in public/images/ and public/icons/"
echo ""
echo "📚 Read docs/setup-guide.md for detailed configuration instructions"
echo ""
echo "🚀 Happy coding with MoPets!"